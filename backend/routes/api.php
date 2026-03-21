<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SubTaskController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\XpLogController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\PomodoroSessionController;
use App\Http\Controllers\PomodoroStreakController;
use App\Http\Controllers\DailyRewardController;
use App\Http\Controllers\SpinRewardController;
use App\Http\Controllers\UserSpinLogController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\TaskCheerController;
use App\Http\Controllers\StudyRoomController;
use App\Http\Controllers\RoomSessionController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\CalendarEventController;
use App\Http\Controllers\MonsterController;
use App\Http\Controllers\ActivityLogController;

// ==================== PUBLIC AUTH ROUTES ====================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// ==================== PROTECTED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    });

    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/top-users', [UserController::class, 'topUsers']);
        Route::get('/search', [UserController::class, 'searchUsers']);
        Route::get('/{id}/stats', [UserController::class, 'getStats']);
        Route::get('/{id}/activity-feed', [UserController::class, 'getActivityFeed']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::post('/{id}/update-password', [UserController::class, 'updatePassword']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::get('/defaults', [CategoryController::class, 'getDefaults']);
        Route::post('/create-defaults', [CategoryController::class, 'createDefault']);
        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });

    Route::prefix('tasks')->group(function () {
        Route::get('/', [TaskController::class, 'index']);
        Route::post('/', [TaskController::class, 'store']);
        Route::get('/public', [TaskController::class, 'getPublicTasks']);
        Route::get('/overdue', [TaskController::class, 'getOverdue']);
        Route::get('/due-soon', [TaskController::class, 'getDueSoon']);
        Route::get('/{id}', [TaskController::class, 'show']);
        Route::put('/{id}', [TaskController::class, 'update']);
        Route::delete('/{id}', [TaskController::class, 'destroy']);
        Route::post('/{id}/start', [TaskController::class, 'start']);
        Route::post('/{id}/complete', [TaskController::class, 'complete']);
        Route::post('/{id}/fail', [TaskController::class, 'fail']);
        Route::post('/{id}/attack-monster', [TaskController::class, 'attackMonster']);
        Route::post('/{id}/add-cheer', [TaskController::class, 'addCheer']);
    });

    Route::prefix('subtasks')->group(function () {
        Route::get('/', [SubTaskController::class, 'index']);
        Route::post('/', [SubTaskController::class, 'store']);
        Route::get('/{id}', [SubTaskController::class, 'show']);
        Route::put('/{id}', [SubTaskController::class, 'update']);
        Route::delete('/{id}', [SubTaskController::class, 'destroy']);
        Route::post('/{id}/toggle', [SubTaskController::class, 'toggle']);
        Route::post('/batch-reorder', [SubTaskController::class, 'reorder']);
    });

    Route::prefix('achievements')->group(function () {
        Route::get('/', [AchievementController::class, 'index']);
        Route::get('/user-achievements', [AchievementController::class, 'getUserAchievements']);
        Route::get('/progress', [AchievementController::class, 'getProgress']);
        Route::post('/check-unlock', [AchievementController::class, 'checkAndUnlock']);
        Route::get('/{id}', [AchievementController::class, 'show']);
    });

    Route::prefix('badges')->group(function () {
        Route::get('/', [BadgeController::class, 'index']);
        Route::get('/by-rarity/{rarity}', [BadgeController::class, 'getByRarity']);
        Route::get('/stats', [BadgeController::class, 'getStats']);
        Route::get('/user-badges', [BadgeController::class, 'getUserBadges']);
        Route::get('/{id}', [BadgeController::class, 'show']);
    });

    Route::prefix('xp-logs')->group(function () {
        Route::get('/', [XpLogController::class, 'index']);
        Route::get('/stats', [XpLogController::class, 'getStats']);
        Route::get('/today', [XpLogController::class, 'getTodayXp']);
        Route::get('/weekly', [XpLogController::class, 'getWeeklyXp']);
    });

    Route::prefix('friends')->group(function () {
        Route::get('/', [FriendController::class, 'index']);
        Route::post('/', [FriendController::class, 'addFriend']);
        Route::delete('/{id}', [FriendController::class, 'removeFriend']);
        Route::post('/{id}/block', [FriendController::class, 'blockFriend']);
        Route::post('/{id}/unblock', [FriendController::class, 'unblockFriend']);
        Route::get('/blocked', [FriendController::class, 'getBlockedFriends']);
        Route::get('/{id}/stats', [FriendController::class, 'getFriendStats']);
    });

    Route::prefix('friend-requests')->group(function () {
        Route::get('/', [FriendRequestController::class, 'index']);
        Route::post('/{id}/accept', [FriendRequestController::class, 'accept']);
        Route::post('/{id}/reject', [FriendRequestController::class, 'reject']);
        Route::get('/pending-count', [FriendRequestController::class, 'getPendingCount']);
    });

    Route::prefix('pomodoro-sessions')->group(function () {
        Route::get('/', [PomodoroSessionController::class, 'index']);
        Route::post('/', [PomodoroSessionController::class, 'store']);
        Route::get('/today-stats', [PomodoroSessionController::class, 'getTodayStats']);
        Route::get('/weekly-stats', [PomodoroSessionController::class, 'getWeeklyStats']);
        Route::get('/{id}', [PomodoroSessionController::class, 'show']);
        Route::put('/{id}', [PomodoroSessionController::class, 'update']);
        Route::delete('/{id}', [PomodoroSessionController::class, 'destroy']);
        Route::post('/{id}/complete', [PomodoroSessionController::class, 'complete']);
        Route::post('/{id}/cancel', [PomodoroSessionController::class, 'cancel']);
    });

    Route::prefix('pomodoro-streaks')->group(function () {
        Route::get('/streak', [PomodoroStreakController::class, 'getStreak']);
        Route::post('/reset', [PomodoroStreakController::class, 'resetStreak']);
    });

    Route::prefix('daily-rewards')->group(function () {
        Route::post('/claim', [DailyRewardController::class, 'claim']);
        Route::get('/status', [DailyRewardController::class, 'getStatus']);
        Route::get('/streak', [DailyRewardController::class, 'getStreak']);
    });

    Route::prefix('spin-rewards')->group(function () {
        Route::get('/', [SpinRewardController::class, 'index']);
        Route::post('/spin', [SpinRewardController::class, 'spin']);
        Route::get('/history', [SpinRewardController::class, 'getUserSpinHistory']);
        Route::get('/stats', [SpinRewardController::class, 'getSpinStats']);
        Route::get('/reward-stats', [SpinRewardController::class, 'getRewardStats']);
    });

    Route::prefix('user-spin-logs')->group(function () {
        Route::get('/', [UserSpinLogController::class, 'index']);
        Route::get('/today', [UserSpinLogController::class, 'getTodaySpins']);
        Route::get('/weekly', [UserSpinLogController::class, 'getWeeklySpins']);
        Route::get('/distribution', [UserSpinLogController::class, 'getRewardDistribution']);
        Route::get('/recent', [UserSpinLogController::class, 'getMostRecentSpins']);
        Route::get('/{id}', [UserSpinLogController::class, 'show']);
        Route::delete('/{id}', [UserSpinLogController::class, 'delete']);
    });

    Route::prefix('tasks/{taskId}/comments')->group(function () {
        Route::get('/', [TaskCommentController::class, 'index']);
        Route::post('/', [TaskCommentController::class, 'store']);
        Route::get('/count', [TaskCommentController::class, 'getCommentCount']);
        Route::get('/{commentId}', [TaskCommentController::class, 'show']);
        Route::put('/{commentId}', [TaskCommentController::class, 'update']);
        Route::delete('/{commentId}', [TaskCommentController::class, 'destroy']);
        Route::get('/{commentId}/replies', [TaskCommentController::class, 'getReplies']);
        Route::post('/{commentId}/replies', [TaskCommentController::class, 'addReply']);
    });

    Route::prefix('tasks/{taskId}/cheers')->group(function () {
        Route::get('/', [TaskCheerController::class, 'getCheers']);
        Route::post('/', [TaskCheerController::class, 'store']);
        Route::delete('/{cheerId}', [TaskCheerController::class, 'destroy']);
        Route::get('/has-cheered', [TaskCheerController::class, 'hasCheer']);
    });

    Route::prefix('study-rooms')->group(function () {
        Route::get('/', [StudyRoomController::class, 'index']);
        Route::post('/', [StudyRoomController::class, 'store']);
        Route::get('/recommended', [StudyRoomController::class, 'getRecommendedRooms']);
        Route::get('/my-rooms', [StudyRoomController::class, 'getUserRooms']);
        Route::get('/{id}', [StudyRoomController::class, 'show']);
        Route::put('/{id}', [StudyRoomController::class, 'update']);
        Route::delete('/{id}', [StudyRoomController::class, 'destroy']);
        Route::post('/{id}/join', [StudyRoomController::class, 'joinRoom']);
        Route::post('/{id}/leave', [StudyRoomController::class, 'leaveRoom']);
        Route::post('/{id}/invite', [StudyRoomController::class, 'inviteUser']);
        Route::post('/{id}/remove-member', [StudyRoomController::class, 'removeMember']);
        Route::post('/{id}/set-role', [StudyRoomController::class, 'setMemberRole']);
        Route::get('/{id}/members', [StudyRoomController::class, 'getMembers']);
        Route::get('/{id}/sessions', [StudyRoomController::class, 'getRoomSessions']);
    });

    Route::prefix('room-sessions')->group(function () {
        Route::get('/', [RoomSessionController::class, 'index']);
        Route::post('/', [RoomSessionController::class, 'store']);
        Route::get('/active', [RoomSessionController::class, 'getActiveSessions']);
        Route::get('/stats', [RoomSessionController::class, 'getSessionStats']);
        Route::get('/today', [RoomSessionController::class, 'getTodaySessions']);
        Route::get('/peak-hours', [RoomSessionController::class, 'getMostActiveTimes']);
        Route::get('/{id}', [RoomSessionController::class, 'show']);
        Route::post('/{id}/end', [RoomSessionController::class, 'endSession']);
        Route::delete('/{id}', [RoomSessionController::class, 'destroy']);
    });

    Route::prefix('leaderboards')->group(function () {
        Route::get('/', [LeaderboardController::class, 'index']);
        Route::get('/global', [LeaderboardController::class, 'getGlobalLeaderboard']);
        Route::get('/weekly', [LeaderboardController::class, 'getWeeklyLeaderboard']);
        Route::get('/monthly', [LeaderboardController::class, 'getMonthlyLeaderboard']);
        Route::get('/by-metric/{metric}', [LeaderboardController::class, 'getByMetric']);
        Route::get('/user-rank', [LeaderboardController::class, 'getUserRank']);
        Route::get('/top-10', [LeaderboardController::class, 'getTop10']);
    });

    Route::prefix('challenges')->group(function () {
        Route::get('/', [ChallengeController::class, 'index']);
        Route::post('/', [ChallengeController::class, 'store']);
        Route::get('/active', [ChallengeController::class, 'getActiveChallenges']);
        Route::get('/my-challenges', [ChallengeController::class, 'getUserChallenges']);
        Route::get('/{id}', [ChallengeController::class, 'show']);
        Route::put('/{id}', [ChallengeController::class, 'update']);
        Route::delete('/{id}', [ChallengeController::class, 'destroy']);
        Route::post('/{id}/join', [ChallengeController::class, 'joinChallenge']);
        Route::post('/{id}/leave', [ChallengeController::class, 'leaveChallenge']);
        Route::get('/{id}/participants', [ChallengeController::class, 'getChallengeParticipants']);
        Route::get('/{id}/rankings', [ChallengeController::class, 'getChallengeRankings']);
    });

    Route::prefix('schedules')->group(function () {
        Route::get('/', [ScheduleController::class, 'index']);
        Route::post('/', [ScheduleController::class, 'store']);
        Route::get('/today', [ScheduleController::class, 'getTodaySchedules']);
        Route::get('/upcoming', [ScheduleController::class, 'getUpcomingSchedules']);
        Route::get('/by-priority/{priority}', [ScheduleController::class, 'getSchedulesByPriority']);
        Route::get('/stats', [ScheduleController::class, 'getScheduleStats']);
        Route::post('/auto-schedule', [ScheduleController::class, 'autoScheduleByDeadline']);
        Route::post('/bulk-update', [ScheduleController::class, 'bulkUpdate']);
        Route::get('/{id}', [ScheduleController::class, 'show']);
        Route::put('/{id}', [ScheduleController::class, 'update']);
        Route::delete('/{id}', [ScheduleController::class, 'destroy']);
    });

    Route::prefix('reminders')->group(function () {
        Route::get('/', [ReminderController::class, 'index']);
        Route::post('/', [ReminderController::class, 'store']);
        Route::get('/upcoming', [ReminderController::class, 'getUpcomingReminders']);
        Route::get('/pending', [ReminderController::class, 'getPendingReminders']);
        Route::get('/by-type/{type}', [ReminderController::class, 'getRemindersByType']);
        Route::get('/stats', [ReminderController::class, 'getReminderStats']);
        Route::get('/{id}', [ReminderController::class, 'show']);
        Route::put('/{id}', [ReminderController::class, 'update']);
        Route::delete('/{id}', [ReminderController::class, 'destroy']);
        Route::post('/{id}/send', [ReminderController::class, 'sendReminder']);
    });

    Route::prefix('calendar-events')->group(function () {
        Route::get('/', [CalendarEventController::class, 'index']);
        Route::post('/', [CalendarEventController::class, 'store']);
        Route::get('/today', [CalendarEventController::class, 'getTodayEvents']);
        Route::get('/upcoming', [CalendarEventController::class, 'getUpcomingEvents']);
        Route::get('/by-date/{date}', [CalendarEventController::class, 'getEventsByDate']);
        Route::post('/by-date-range', [CalendarEventController::class, 'getEventsByDateRange']);
        Route::get('/sync-stats', [CalendarEventController::class, 'getSyncServiceStats']);
        Route::post('/sync-google', [CalendarEventController::class, 'syncWithGoogle']);
        Route::post('/sync-apple', [CalendarEventController::class, 'syncWithApple']);
        Route::post('/sync-outlook', [CalendarEventController::class, 'syncWithOutlook']);
        Route::get('/{id}', [CalendarEventController::class, 'show']);
        Route::put('/{id}', [CalendarEventController::class, 'update']);
        Route::delete('/{id}', [CalendarEventController::class, 'destroy']);
    });

    Route::prefix('monsters')->group(function () {
        Route::get('/', [MonsterController::class, 'index']);
        Route::post('/', [MonsterController::class, 'store']);
        Route::get('/by-rarity/{rarity}', [MonsterController::class, 'getByRarity']);
        Route::get('/by-type/{type}', [MonsterController::class, 'getByType']);
        Route::get('/rarity-stats', [MonsterController::class, 'getRarityStats']);
        Route::get('/type-stats', [MonsterController::class, 'getTypeStats']);
        Route::get('/{id}', [MonsterController::class, 'show']);
        Route::put('/{id}', [MonsterController::class, 'update']);
        Route::delete('/{id}', [MonsterController::class, 'destroy']);
    });


    Route::prefix('activity-logs')->group(function () {
        Route::get('/', [ActivityLogController::class, 'index']);
        Route::get('/today', [ActivityLogController::class, 'getTodayActivity']);
        Route::get('/weekly', [ActivityLogController::class, 'getWeeklyActivity']);
        Route::get('/summary', [ActivityLogController::class, 'getActivitySummary']);
        Route::get('/streak', [ActivityLogController::class, 'getStreak']);
        Route::get('/peak-hours', [ActivityLogController::class, 'getMostActiveHours']);
        Route::get('/recent', [ActivityLogController::class, 'getRecentActivity']);
        Route::post('/delete-old', [ActivityLogController::class, 'deleteOldLogs']);
        Route::get('/{id}', [ActivityLogController::class, 'show']);
    });
});
