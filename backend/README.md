# X Project Backend

FastAPI-based authentication and task management backend.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 3. Run the Backend

```bash
python main.py
```

The API will be available at `http://localhost:8000`

API documentation available at `http://localhost:8000/docs`

## API Endpoints

### Authentication

- `POST /token` - Login and get access token
- `POST /register` - Register new user
- `POST /forgot-password` - Request password reset link
- `POST /reset-password` - Reset password using token

### User

- `GET /users/me` - Get current user information (protected)

### Items/Tasks

- `GET /items/` - Get all items for current user (protected)
- `GET /items/{item_id}` - Get specific item (protected)
- `POST /items/` - Create new item (protected)
- `DELETE /items/{item_id}` - Delete item (protected)

## Database

The backend uses SQLite by default. The database file is created automatically at `sql_app.db`

Initial admin user is created on startup:
- Username: `admin`
- Email: `admin@example.com`
- Password: `senha123`

## Requirements

- Python 3.8+
- FastAPI
- SQLAlchemy
- python-jose
- passlib
- python-dotenv
- pydantic

See `requirements.txt` for complete list.
