from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.task_list, name='task-list'),
    path('tasks/<int:pk>/', views.task_detail, name='task-detail'),
    path('tasks/<int:pk>/messages/', views.task_messages, name='task-messages'),
    path('chat/', views.chat, name='chat'),
    path('chat/initial/', views.initial_nudge, name='initial-nudge'),
    path('stats/', views.stats, name='stats'),
    path('settings/', views.settings_view, name='settings'),
    path('focus-recommendation/', views.focus_recommendation, name='focus-recommendation'),
]
