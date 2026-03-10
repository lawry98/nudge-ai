from django.db import models


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('urgent', 'Urgent'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    name = models.CharField(max_length=255)
    due_date = models.DateField()
    estimated_time = models.CharField(max_length=50)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date', 'created_at']

    def __str__(self):
        return self.name


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
