<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\XpLog;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 20);
        $achievements = Achievement::paginate($limit);

        return response()->json($achievements);
    }

    public function show($id)
    {
        $achievement = Achievement::findOrFail($id);
        $unlockedCount = $achievement->users()->count();

        return response()->json([
            'achievement' => $achievement,
            'unlocked_by_count' => $unlockedCount,
        ]);
    }

    public function getUserAchievements(Request $request)
    {
        $user = $request->user();
        $achievements = $user->achievements()
            ->withPivot('unlocked_at')
            ->paginate(20);

        return response()->json($achievements);
    }

    public function checkAndUnlock(Request $request)
    {
        $user = $request->user();
        $achievements = Achievement::all();

        $newlyUnlocked = [];
        foreach ($achievements as $achievement) {
            if ($achievement->checkUnlock($user)) {
                $newlyUnlocked[] = $achievement;
            }
        }

        return response()->json([
            'newly_unlocked' => $newlyUnlocked,
            'total_achievements' => $newlyUnlocked,
        ]);
    }

    public function getProgress(Request $request)
    {
        $user = $request->user();
        $achievements = Achievement::all();

        $progress = [];
        foreach ($achievements as $achievement) {
            $current = match ($achievement->condition_type) {
                'task_count' => $user->tasks()->where('status', 'completed')->count(),
                'streak' => $user->streak_count,
                'level' => $user->level,
                'xp' => $user->xp,
                'pomodoro_count' => $user->pomodoroSessions()->where('status', 'completed')->count(),
                default => 0,
            };

            $progress[] = [
                'achievement' => $achievement,
                'current_progress' => $current,
                'target' => $achievement->condition_value,
                'percentage' => min(100, ($current / $achievement->condition_value) * 100),
                'unlocked' => $user->hasAchievement($achievement->id),
            ];
        }

        return response()->json($progress);
    }
}
