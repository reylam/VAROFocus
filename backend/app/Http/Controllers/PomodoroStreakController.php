<?php

namespace App\Http\Controllers;

use App\Models\PomodoroStreak;
use Illuminate\Http\Request;

class PomodoroStreakController extends Controller
{
    public function getStreak(Request $request)
    {
        $user = $request->user();

        $streak = $user->pomodoroStreak ?? PomodoroStreak::create([
            'user_id' => $user->id,
            'current_streak' => 0,
            'max_streak' => 0,
        ]);

        return response()->json([
            'current_streak' => $streak->current_streak,
            'max_streak' => $streak->max_streak,
            'last_session_at' => $streak->last_session_at,
            'streak_bonus_multiplier' => $streak->getStreakBonus(),
        ]);
    }

    public function resetStreak(Request $request)
    {
        $user = $request->user();
        $streak = $user->pomodoroStreak;

        if (!$streak) {
            return response()->json([
                'message' => 'No streak to reset',
            ], 422);
        }

        $streak->resetStreak();

        return response()->json([
            'message' => 'Streak reset',
            'current_streak' => 0,
        ]);
    }
}
