from django.utils import timezone
from rest_framework import serializers
from .models import Task, ChatMessage, UserSettings


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'due_date', 'estimated_time', 'priority', 'cognitive_load', 'completed', 'completed_at', 'created_at']
        read_only_fields = ['id', 'completed_at', 'created_at']

    def update(self, instance, validated_data):
        prev_completed = instance.completed
        instance = super().update(instance, validated_data)
        new_completed = instance.completed

        if not prev_completed and new_completed:
            instance.completed_at = timezone.now()
            instance.save(update_fields=['completed_at'])
        elif prev_completed and not new_completed:
            instance.completed_at = None
            instance.save(update_fields=['completed_at'])

        return instance


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'task', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['focus_window', 'ai_tone', 'notifications_enabled', 'updated_at']
        read_only_fields = ['updated_at']
