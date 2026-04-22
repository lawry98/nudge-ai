import os
from datetime import date, timedelta, datetime, time
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import anthropic

from .models import Task, ChatMessage, UserSettings
from .serializers import TaskSerializer, ChatMessageSerializer, UserSettingsSerializer

SYSTEM_PROMPT = (
    "You are NudgeAI, a friendly and empathetic AI accountability partner. "
    "Your job is to help users overcome procrastination. When a user tells you why "
    "they're stuck on a task, respond with understanding (1 sentence) and then suggest "
    "1-2 small, concrete first steps they can take right now (keep each step under 15 words). "
    "Be warm but concise. Never lecture. Never be preachy."
)


@api_view(['GET', 'POST'])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def task_messages(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    messages = task.messages.all()
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def chat(request):
    task_id = request.data.get('task_id')
    user_message = request.data.get('message', '').strip()

    if not task_id or not user_message:
        return Response({'error': 'task_id and message are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    # Save user message
    ChatMessage.objects.create(role='user', content=user_message, task=task)

    # Load full conversation history
    history = task.messages.all()
    messages = [
        {'role': msg.role, 'content': msg.content}
        for msg in history
    ]

    # Call Anthropic API
    api_key = settings.ANTHROPIC_API_KEY
    if not api_key:
        return Response({'error': 'ANTHROPIC_API_KEY not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model='claude-sonnet-4-6',
            max_tokens=512,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        ai_content = response.content[0].text
    except Exception as e:
        return Response({'error': f'AI service error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Save AI response
    ChatMessage.objects.create(role='assistant', content=ai_content, task=task)

    return Response({'response': ai_content})


@api_view(['POST'])
def initial_nudge(request):
    """Generate an initial AI opening message for a task with no conversation history."""
    task_id = request.data.get('task_id')
    if not task_id:
        return Response({'error': 'task_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    # Only generate if no messages exist yet
    if task.messages.exists():
        serializer = ChatMessageSerializer(task.messages.all(), many=True)
        return Response({'already_exists': True, 'messages': serializer.data})

    today = date.today()
    if task.due_date < today:
        status_text = 'overdue'
    elif task.due_date == today:
        status_text = 'due today'
    else:
        status_text = 'coming up soon'

    opening = (
        f"Hey! I noticed \"{task.name}\" is {status_text}. "
        f"What's been keeping you from starting it?"
    )

    ChatMessage.objects.create(role='assistant', content=opening, task=task)
    return Response({'response': opening})


@api_view(['GET'])
def stats(request):
    today = date.today()
    # Monday of the current week at 00:00 local time, converted to aware datetime
    week_start_date = today - timedelta(days=today.weekday())
    week_start = timezone.make_aware(datetime.combine(week_start_date, time.min))

    # Tasks completed this week: completed=True AND completed_at >= Monday 00:00
    completed_this_week = Task.objects.filter(
        completed=True,
        completed_at__gte=week_start,
    ).count()

    completed_all_time = Task.objects.filter(completed=True).count()

    # Tasks created this week (tasks the user has been working with since Monday)
    total_this_week = Task.objects.filter(created_at__gte=week_start).count()

    checkins_this_week = ChatMessage.objects.filter(
        role='user',
        timestamp__gte=week_start,
    ).count()

    # Streak: count consecutive days ending today that have at least one completed task
    streak = 0
    check_day = today
    for _ in range(30):
        had_completion = Task.objects.filter(
            completed=True,
            completed_at__date=check_day,
        ).exists()
        if had_completion:
            streak += 1
            check_day -= timedelta(days=1)
        else:
            break

    return Response({
        'completed_this_week': completed_this_week,
        'completed_all_time': completed_all_time,
        'total_this_week': total_this_week,
        'checkins_this_week': checkins_this_week,
        'streak': streak,
    })


@api_view(['GET'])
def focus_recommendation(request):
    user_settings = UserSettings.get_or_create_settings()
    window = user_settings.focus_window

    current_hour = datetime.now().hour
    window_ranges = {
        'morning':   (6, 12),
        'afternoon': (12, 18),
        'evening':   (18, 24),
    }

    in_window = False
    if window != 'none' and window in window_ranges:
        start, end = window_ranges[window]
        in_window = start <= current_hour < end

    if not in_window:
        return Response({'in_focus_window': False, 'window': window, 'task': None})

    load_order = {'deep': 0, 'medium': 1, 'light': 2}
    priority_order = {'urgent': 0, 'medium': 1, 'low': 2}

    incomplete = list(Task.objects.filter(completed=False))
    if not incomplete:
        return Response({'in_focus_window': True, 'window': window, 'task': None})

    def sort_key(t):
        due = t.due_date if t.due_date else date.max
        return (
            load_order.get(t.cognitive_load, 1),
            priority_order.get(t.priority, 1),
            due,
        )

    best = sorted(incomplete, key=sort_key)[0]
    serializer = TaskSerializer(best)
    return Response({'in_focus_window': True, 'window': window, 'task': serializer.data})


@api_view(['GET', 'PATCH'])
def settings_view(request):
    user_settings = UserSettings.get_or_create_settings()

    if request.method == 'GET':
        serializer = UserSettingsSerializer(user_settings)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = UserSettingsSerializer(user_settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
