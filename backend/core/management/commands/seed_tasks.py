from datetime import date, timedelta
from django.core.management.base import BaseCommand
from core.models import Task


class Command(BaseCommand):
    help = 'Seed the database with sample tasks'

    def handle(self, *args, **options):
        if Task.objects.exists():
            self.stdout.write(self.style.WARNING('Tasks already exist. Skipping seed.'))
            return

        today = date.today()

        tasks = [
            {
                'name': 'Finish Q1 project report',
                'due_date': today - timedelta(days=3),
                'estimated_time': '2 hours',
                'priority': 'urgent',
                'completed': False,
            },
            {
                'name': 'Reply to client emails',
                'due_date': today - timedelta(days=1),
                'estimated_time': '30 min',
                'priority': 'urgent',
                'completed': False,
            },
            {
                'name': 'Review pull requests',
                'due_date': today,
                'estimated_time': '1 hour',
                'priority': 'medium',
                'completed': False,
            },
            {
                'name': 'Update project documentation',
                'due_date': today + timedelta(days=2),
                'estimated_time': '1 hour',
                'priority': 'low',
                'completed': False,
            },
            {
                'name': 'Prepare slide deck for team meeting',
                'due_date': today + timedelta(days=4),
                'estimated_time': '3+ hours',
                'priority': 'medium',
                'completed': False,
            },
            {
                'name': 'Set up development environment',
                'due_date': today - timedelta(days=7),
                'estimated_time': '1 hour',
                'priority': 'low',
                'completed': True,
            },
        ]

        for task_data in tasks:
            Task.objects.create(**task_data)
            self.stdout.write(self.style.SUCCESS(f"Created: {task_data['name']}"))

        self.stdout.write(self.style.SUCCESS(f'\nSeeded {len(tasks)} tasks successfully.'))
