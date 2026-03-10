# NudgeAI

A procrastination intervention web app. An AI chat assistant starts personalized conversations about overdue or avoided tasks — asking why you're stuck and suggesting small, actionable next steps.

## Tech Stack

- **Backend:** Python Django + Django REST Framework
- **Frontend:** Next.js 14 + React + TypeScript + Tailwind CSS
- **Database:** SQLite
- **AI:** Anthropic Claude API

---

## Setup & Running

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- An [Anthropic API key](https://console.anthropic.com/)

---

### Backend (Django)

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run migrations
python manage.py migrate

# Seed sample tasks
python manage.py seed_tasks

# Start the dev server (port 8000)
python manage.py runserver
```

---

### Frontend (Next.js)

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List all tasks |
| POST | `/api/tasks/` | Create a task |
| PATCH | `/api/tasks/<id>/` | Update a task |
| DELETE | `/api/tasks/<id>/` | Delete a task |
| GET | `/api/tasks/<id>/messages/` | Get chat messages for a task |
| POST | `/api/chat/` | Send message, get AI response |
| POST | `/api/chat/initial/` | Generate initial nudge for a task |
| GET | `/api/stats/` | Get weekly stats |

---

## Environment Variables

Create `backend/.env` (copy from `.env.example`):

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DJANGO_SECRET_KEY=your-secret-key-here
```

---

## Project Structure

```
nudgeai/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── nudgeai/         # Django project config
│   │   ├── settings.py
│   │   └── urls.py
│   └── core/            # Main app
│       ├── models.py    # Task, ChatMessage
│       ├── serializers.py
│       ├── views.py     # API views + AI logic
│       ├── urls.py
│       └── management/commands/seed_tasks.py
└── frontend/
    ├── package.json
    └── src/
        ├── app/         # Next.js app router
        ├── components/  # UI components
        ├── lib/api.ts   # API helper functions
        └── types/       # TypeScript interfaces
```
