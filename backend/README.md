# VAROFocus Backend API

**VAROFocus** adalah aplikasi manajemen tugas berbasis gamifikasi yang mengubah produktivitas menjadi petualangan seru dengan sistem monster combat, achievement unlocking, dan kolaborasi sosial.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Stack Teknologi](#stack-teknologi)
- [Instalasi & Setup](#instalasi--setup)
- [Autentikasi](#autentikasi)
- [Format Response](#format-response)
- [Panduan Endpoint](#panduan-endpoint)
- [Contoh Penggunaan](#contoh-penggunaan)

---

## Fitur Utama

### 1. **Manajemen Tugas dengan Monster Combat**

- Tambah, edit, hapus tugas dengan deadline dan prioritas
- Sistem difficulty level (Easy, Medium, Hard, Boss) yang mempengaruhi reward XP
- Attack monster saat menyelesaikan tugas (RPG mechanics)
- Subtask untuk breakdown tugas kompleks
- Task status tracking (pending, in_progress, completed, failed)

### 2. **Sistem Gamifikasi**

- **XP & Level**: Dapatkan XP dari berbagai aktivitas, naik level otomatis
- **Achievements**: 15+ achievement yang bisa di-unlock berdasarkan milestone
- **Badges**: Koleksi badge dengan rarity tier (common, rare, epic, legendary)
- **Leaderboard**: Global, weekly, monthly ranking berdasarkan XP, jumlah tugas, streak
- **Daily Streaks**: Maintain streak untuk bonus XP multiplier

### 3. **Sistem Reward & Spin Wheel**

- Daily login reward dengan streak bonus
- Spin wheel untuk random rewards (XP boost, theme, item, badge)
- Tracking riwayat claim dan spin

### 4. **Pomodoro & Fokus**

- Pomodoro session tracking dengan monster attack integration
- Pomodoro streak dengan bonus multiplier (x2 at 50+, x1.5 at 20+, x1.2 at 10+)
- Today & weekly statistics

### 5. **Fitur Sosial**

- Friend system dengan bidirectional relationship
- Friend request workflow (sent/received, accept/reject)
- Task comment dengan nested reply system
- Task cheer/like untuk motivasi teman (award XP kepada task owner)
- Block user functionality

### 6. **Study Rooms - Virtual Co-working**

- Buat/join virtual study room untuk kolaborasi
- Member roles: owner, moderator, member
- Room session tracking dengan duration
- Real-time member management

### 7. **Scheduling & Reminders**

- Schedule tugas untuk hari tertentu dengan priority level
- Auto-scheduling berdasarkan deadline
- Reminder system (email, push, in-app)
- Calendar event sync dengan Google Calendar, Apple Calendar, Outlook

### 8. **Challenge System**

- Buat challenge dan invite teman
- Kompetisi dengan real-time leaderboard
- Challenge progress tracking

### 9. **Analytics & Activity**

- Activity log tracking (task_complete, pomodoro, etc)
- XP breakdown by source (task, pomodoro, achievement, daily_reward)
- User statistics (total XP, tasks, achievements, badges, streaks)
- Peak activity hours analysis

---

## 🛠 Stack Teknologi

| Component      | Technology                     |
| -------------- | ------------------------------ |
| Framework      | Laravel 12                     |
| Database       | PostgreSQL (UUID primary keys) |
| Authentication | Laravel Sanctum (Token-based)  |
| ORM            | Eloquent                       |
| API Style      | RESTful JSON                   |
| Environment    | PHP 8.3+                       |

---

## Instalasi & Setup

### Prerequisites

- PHP 8.3+
- PostgreSQL 14+
- Composer
- Node.js & npm (untuk asset compilation)

### Langkah-Langkah

1. **Clone Repository**

```bash
git clone <repository-url>
cd backend
```

2. **Install Dependencies**

```bash
composer install
npm install
```

3. **Setup Environment File**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure Database**
   Edit `.env`:

```env
DB_CONNECTION=
DB_URL =
```

5. **Run Migrations**

```bash
php artisan migrate
```

6. **Install Sanctum**

```bash
php artisan install:api
```

7. **Start Development Server**

```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

---

## Autentikasi

VAROFocus menggunakan **Laravel Sanctum** untuk token-based authentication.

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201)**:

```json
{
    "message": "User registered successfully",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**:

```json
{
    "message": "Login successful",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "user": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
}
```

### Menggunakan Token

Tambahkan header di setiap request yang memerlukan autentikasi:

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

---

## Format Response

Semua response mengikuti format JSON standar:

### Success Response

```json
{
  "message": "Operation successful",
  "data": {...}
}
```

### HTTP Status Codes

- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `400 Bad Request` - Request tidak valid
- `401 Unauthorized` - Token tidak valid/expired
- `403 Forbidden` - Akses ditolak
- `404 Not Found` - Resource tidak ditemukan
- `422 Unprocessable Entity` - Validasi gagal
- `500 Internal Server Error` - Server error

---

## Endpoint

Total **120+ REST endpoints** yang tersedia untuk semua fitur.

### Authentication Endpoints (5 endpoints)

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh token

### User Endpoints (8 endpoints)

- `GET /api/users` - List users
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update profile
- `GET /api/users/{id}/stats` - Get user stats
- `GET /api/users/top-users` - Top XP users

### Task Endpoints (13 endpoints)

- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task detail
- `POST /api/tasks/{id}/complete` - Complete task (award XP)
- `POST /api/tasks/{id}/attack-monster` - Attack monster
- Plus lebih banyak custom actions...

### Friend & Social (11 endpoints)

- `GET /api/friends` - List friends
- `POST /api/friends` - Add friend
- Task comments, task cheers, chats

### Pomodoro (9 endpoints)

- `POST /api/pomodoro-sessions` - Start session
- `POST /api/pomodoro-sessions/{id}/complete` - Complete session
- Streak management, statistics

### Gamification (15 endpoints)

- Achievements, badges, XP logging, leaderboards

### Study Rooms (13 endpoints)

- Room CRUD, member management, sessions

### Scheduling (11 endpoints)

- Schedule tasks, reminders, calendar events

### Challenges (10 endpoints)

- Create challenges, join, rankings

### Plus banyak custom analytics endpoints!

Untuk dokumentasi lengkap endpoint, lihat file `VAROFocus-API.postman_collection.json`

---

## Contoh Penggunaan

### Login & Get Token

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Complete Task dengan Monster Attack

```bash
curl -X POST http://localhost:8000/api/tasks/550e8400/complete \
  -H "Authorization: Bearer token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "hard"
  }'
```

### Spin Wheel & Get Reward

```bash
curl -X POST http://localhost:8000/api/spin-rewards/spin \
  -H "Authorization: Bearer token_here"
```

### Get Achievement Progress

```bash
curl -X GET http://localhost:8000/api/achievements/progress \
  -H "Authorization: Bearer token_here"
```

---

## Testing Postman

Import file `VAROFocus-API.postman_collection.json` ke Postman:

1. Di Postman, klik Import
2. Pilih file collection JSON
3. Setup environment variable `token` dengan token dari login
4. Jalankan request

---
