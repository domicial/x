# X Project Frontend

Modern React-based authentication and task management frontend using Vite, TypeScript, Tailwind CSS, and Lucide icons.

## Features

- User authentication (Login, Register, Password Reset)
- Task/Item management dashboard
- Beautiful, responsive UI with animated gradients
- Type-safe React components with TypeScript
- Tailwind CSS for styling

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── LoginForm.tsx           # Login page
│   ├── RegisterForm.tsx        # User registration
│   ├── ForgotPassword.tsx      # Password reset request
│   ├── ResetPasswordForm.tsx   # Password reset confirmation
│   └── Dashboard.tsx           # Main task management
├── App.tsx                     # Main app component with routing
├── App.css                     # App-level styles
├── index.css                   # Global styles with Tailwind
├── main.tsx                    # React entry point
└── assets/                     # Static assets
```

## Environment Configuration

By default, the frontend connects to:
- Backend API: `http://localhost:8000`

Update the `API_URL` constants in each component if using a different backend URL.

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React DOM** - DOM rendering

## Key Components

### LoginForm
- User authentication
- Navigate to registration or password reset
- Stores access token in localStorage

### RegisterForm
- New user registration
- Email and password validation
- Automatic redirect to login on success

### ForgotPassword
- Password reset request
- Email validation
- Simulated email sending

### ResetPasswordForm
- Password reset with token from email link
- Token validation
- Password confirmation

### Dashboard
- Display current user information
- Create new tasks/items
- View all user tasks
- Delete tasks

## API Integration

The frontend communicates with the backend via:
- `POST /token` - User login
- `POST /register` - User registration
- `GET /users/me` - Get current user
- `POST /items/` - Create task
- `GET /items/` - List user tasks
- `DELETE /items/{id}` - Delete task
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Confirm password reset

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
