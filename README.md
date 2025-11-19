# X Project

A modern full-stack authentication and task management application with a beautiful, responsive UI.

## Project Overview

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Authentication**: JWT tokens with password hashing
- **Styling**: Tailwind CSS v4 with animated gradients

## Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- npm or yarn

### Backend Setup

1. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Update backend/.env with your values
   ```

3. **Run the backend**
   ```bash
   cd backend
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`
   API docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

## Default Credentials

When the backend starts, it creates an initial admin user:
- **Username**: `admin`
- **Email**: `admin@example.com`
- **Password**: `senha123`

## Project Structure

```
X_project/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py          # Database models
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── crud.py            # CRUD operations
│   ├── main.py                # FastAPI app
│   ├── .env.example           # Environment template
│   ├── README.md              # Backend docs
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ResetPasswordForm.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── App.tsx            # Main app
│   │   ├── App.css            # Gradient background
│   │   ├── index.css          # Global styles
│   │   └── main.tsx           # React entry
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── README.md              # Frontend docs
│   └── postcss.config.js
│
├── README.md                  # This file
└── requirements.txt           # Backend dependencies
```

## Features

### Authentication
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password reset via email (simulated)
- ✅ Session management with localStorage

### Task Management
- ✅ Create tasks/items
- ✅ View all user tasks
- ✅ Delete tasks
- ✅ User-specific task ownership

### UI/UX
- ✅ Beautiful animated gradient background
- ✅ Responsive design (mobile-friendly)
- ✅ Modern card-based layout
- ✅ Smooth transitions and hover effects
- ✅ Color-coded form screens
- ✅ Lucide icons throughout

## API Endpoints

### Public Endpoints
- `GET /` - Welcome message
- `POST /token` - User login
- `POST /register` - User registration
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Confirm password reset

### Protected Endpoints (require JWT token)
- `GET /users/me` - Get current user info
- `GET /items/` - List user's tasks
- `GET /items/{item_id}` - Get specific task
- `POST /items/` - Create new task
- `DELETE /items/{item_id}` - Delete task

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
python main.py   # Run with auto-reload
```

## Technologies

### Frontend Stack
- React 19
- TypeScript 5.9
- Tailwind CSS 4
- Vite 7
- Axios (HTTP client)
- Lucide React (icons)

### Backend Stack
- FastAPI 0.104
- SQLAlchemy 2.0
- SQLite (default database)
- python-jose (JWT)
- passlib + bcrypt (password hashing)
- Pydantic (validation)

## Code Quality Improvements Made

✅ Fixed duplicate routes in backend (`GET /`, `POST /token`)
✅ Added missing `create_initial_user` function
✅ Added missing `/items/` GET endpoint
✅ Added missing `/items/{item_id}` GET endpoint
✅ Added environment variable defaults
✅ Improved error handling and messages
✅ Added comprehensive documentation
✅ Created `.env.example` for configuration
✅ Added proper package `__init__.py`
✅ Improved HTML metadata and title
✅ Added type safety throughout

## Security Notes

⚠️ **Development Only**: This project uses default JWT secret and SQLite. For production:
- Change `SECRET_KEY` in `.env`
- Use a production database (PostgreSQL, MySQL)
- Enable HTTPS
- Configure proper CORS origins
- Use environment-specific settings

## Troubleshooting

### Backend fails to start
- Ensure Python 3.8+ is installed
- Install all dependencies: `pip install -r requirements.txt`
- Check if port 8000 is available
- Verify `.env` file is configured correctly

### Frontend won't connect to backend
- Ensure backend is running on `http://localhost:8000`
- Check CORS configuration in `backend/main.py`
- Verify frontend is running on `http://localhost:5173`

### Database errors
- SQLite database is created automatically
- If issues persist, delete `backend/sql_app.db` and restart

## Contributing

Feel free to submit issues and pull requests to improve the project.

## License

This project is licensed under the MIT License.
