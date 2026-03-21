# VAROFocus API - Postman Collection

## 📋 Overview
Complete Postman collection for testing the VAROFocus backend API. This collection includes all endpoints with proper authentication and example data.

## 🚀 Getting Started

### 1. Import Collection
- Open Postman
- Click "Import" button
- Select "File" tab
- Choose `VAROFocus_Postman_Collection.json`
- Click "Import"

### 2. Set Environment Variables
Create a new environment in Postman with these variables:
- `base_url`: `http://localhost:3000` (or your deployed URL)
- `auth_token`: (leave empty initially, will be set after login)

### 3. Start Testing

#### Authentication Flow:
1. **Sign Up** → Create new account
2. **Sign In** → Get access token
3. **Set Token** → Copy the `access_token` from signin response and set it as `auth_token` variable
4. **Test Protected Routes** → All authenticated endpoints will now work

## 📚 API Endpoints

### 🔐 Authentication (Public)
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user
- `GET /auth/me` - Get current user info (requires auth)

### 👤 Profiles (Protected)
- `GET /profiles/me` - Get user profile
- `PATCH /profiles/me` - Update user profile

### 📋 Tasks (Protected)
- `POST /tasks` - Create new task
- `GET /tasks` - Get all user tasks
- `GET /tasks/:id` - Get specific task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### ⏱️ Focus Sessions (Protected)
- `POST /focus-sessions` - Start focus session
- `GET /focus-sessions` - Get all sessions
- `GET /focus-sessions/:id` - Get specific session
- `PATCH /focus-sessions/:id` - Update session
- `DELETE /focus-sessions/:id` - Delete session

### 👹 Monsters (Public)
- `GET /monsters` - Get all monsters
- `GET /monsters/:id` - Get specific monster
- `POST /monsters` - Create monster (admin)
- `PATCH /monsters/:id` - Update monster (admin)
- `DELETE /monsters/:id` - Delete monster (admin)

### 🏆 Achievements (Mixed)
- `GET /achievements` - Get all achievements (public)
- `GET /achievements/me` - Get user achievements (protected)

### 📅 Daily Quests (Mixed)
- `GET /daily-quests` - Get all quest templates (public)
- `GET /daily-quests/me` - Get user's daily quests (protected)
- `POST /daily-quests/me/assign` - Assign new daily quests (protected)

## 🔑 Authentication Notes

- **Bearer Token**: Include `Authorization: Bearer {{auth_token}}` header
- **Token Storage**: Set `auth_token` variable after successful signin
- **Protected Routes**: All user-specific endpoints require authentication

## 📝 Example Usage

### 1. Sign Up
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "username": "hero_player"
}
```

### 2. Sign In
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### 3. Create Task
```json
{
  "monster_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation",
  "difficulty": "medium",
  "estimated_minutes": 60,
  "is_daily_quest": false
}
```

## 🐛 Troubleshooting

- **400 Bad Request**: Check request body format and required fields
- **401 Unauthorized**: Ensure valid Bearer token is set
- **404 Not Found**: Check endpoint URL and parameters
- **500 Internal Server Error**: Check server logs and database connection

## 📊 Response Examples

All responses include proper HTTP status codes and JSON data. Successful operations return the created/updated resource data.

---

Happy testing! 🎮✨