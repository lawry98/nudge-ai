from rest_framework import serializers
from .models import Task, ChatMessage


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'due_date', 'estimated_time', 'priority', 'completed', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'task', 'timestamp']
        read_only_fields = ['id', 'timestamp']
