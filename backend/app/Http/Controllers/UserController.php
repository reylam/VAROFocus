<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\Validator;
class UserController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $users = User::paginate($limit);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with(['achievements', 'badges', 'pomodoroStreak', 'activityLogs'])
            ->findOrFail($id);

        $stats = [
            'total_tasks' => $user->tasks()->count(),
            'completed_tasks' => $user->tasks()->completed()->count(),
            'total_pomodoros' => $user->pomodoroSessions()->count(),
            'completed_pomodoros' => $user->pomodoroSessions()->completed()->count(),
            'total_xp_earned' => $user->xpLogs()->sum('amount'),
            'friends_count' => $user->friends()->count(),
        ];

        return response()->json([
            'user' => $user,
            'stats' => $stats,
            'progress_to_next_level' => $user->getProgressToNextLevel(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'username' => [
                'string',
                'min:3',
                'max:50',
                Rule::unique('users')->ignore($user->id),
            ],
            'email' => [
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'avatar_url' => 'nullable|url',
            'settings' => 'nullable|json',
            'title' => 'nullable|string|max:50',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->only(['id', 'username', 'email', 'avatar_url', 'title', 'settings']),
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        if (!Hash::check($validated['current_password'], $user->password_hash)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->update([
            'password_hash' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    public function getStats(Request $request)
    {
        $user = $request->user();

        $stats = [
            'level' => $user->level,
            'xp' => $user->xp,
            'title' => $user->title,
            'streak_count' => $user->streak_count,
            'total_tasks' => $user->tasks()->count(),
            'completed_tasks' => $user->tasks()->completed()->count(),
            'in_progress_tasks' => $user->tasks()->inProgress()->count(),
            'pending_tasks' => $user->tasks()->pending()->count(),
            'total_xp_earned' => $user->xpLogs()->sum('amount') ?? 0,
            'pomodoro_count' => $user->pomodoroSessions()->completed()->count(),
            'achievements_unlocked' => $user->achievements()->count(),
            'badges_earned' => $user->badges()->count(),
            'friends_count' => $user->friends()->count(),
            'progress_to_next_level' => $user->getProgressToNextLevel(),
        ];

        return response()->json($stats);
    }

    public function getActivityFeed(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);

        $activities = $user->activityLogs()
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json($activities);
    }

    public function topUsers(Request $request)
    {
        $limit = $request->get('limit', 10);

        $users = User::topByXp($limit)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'avatar_url' => $user->avatar_url,
                    'level' => $user->level,
                    'xp' => $user->xp,
                    'title' => $user->title,
                ];
            });

        return response()->json($users);
    }

    public function searchUsers(Request $request)
    {
        $query = $request->get('q');
        $limit = $request->get('limit', 10);

        if (!$query || strlen($query) < 2) {
            return response()->json([
                'message' => 'Query must be at least 2 characters',
            ], 422);
        }

        $users = User::where('username', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->limit($limit)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'avatar_url' => $user->avatar_url,
                    'level' => $user->level,
                    'xp' => $user->xp,
                ];
            });

        return response()->json($users);
    }
}
