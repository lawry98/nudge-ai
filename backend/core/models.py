from django.db import models
from django.utils import timezone


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('urgent', 'Urgent'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    COGNITIVE_LOAD_CHOICES = [
        ('deep', 'Deep focus'),
        ('medium', 'Medium'),
        ('light', 'Light'),
    ]

    name = models.CharField(max_length=255)
    due_date = models.DateField()
    estimated_time = models.CharField(max_length=50)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    cognitive_load = models.CharField(max_length=10, choices=COGNITIVE_LOAD_CHOICES, default='medium')
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date', 'created_at']

    def __str__(self):
        return self.name


class UserSettings(models.Model):
    FOCUS_WINDOW_CHOICES = [
        ('morning', 'Morning (6am–12pm)'),
        ('afternoon', 'Afternoon (12pm–6pm)'),
        ('evening', 'Evening (6pm–12am)'),
        ('none', 'Not set'),
    ]
    AI_TONE_CHOICES = [
        ('warm', 'Warm & empathetic'),
        ('direct', 'Direct & concise'),
        ('playful', 'Playful'),
    ]

    focus_window = models.CharField(max_length=20, choices=FOCUS_WINDOW_CHOICES, default='none')
    ai_tone = models.CharField(max_length=20, choices=AI_TONE_CHOICES, default='warm')
    notifications_enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_or_create_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return 'UserSettings'


class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.role}: {self.content[:50]}"
