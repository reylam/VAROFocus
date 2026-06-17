import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './pages/MainLayout'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { TasksPage } from './features/tasks/TasksPage'
import { PomodoroPage } from './features/pomodoro/PomodoroPage'
import { LeaderboardPage } from './features/leaderboard/LeaderboardPage'
import { AchievementsPage } from './features/achievements/AchievementsPage'
import { StudyRoomDetailPage, StudyRoomsPage } from './features/studyRooms/StudyRoomsPage'
import { ProtectedRoute } from './pages/ProtectedRoute'
import { FriendsPage } from './features/friends/FriendsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/friends" element={<FriendsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/study-rooms" element={<StudyRoomsPage />} />
        <Route path="/study-rooms/:id" element={<StudyRoomDetailPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
