<?php

namespace App\Http\Controllers;

use App\Models\DailyReward;
use App\Models\SpinReward;
use App\Models\UserSpinLog;
use Illuminate\Http\Request;

class DailyRewardController extends Controller
{
    public function getStatus(Request $request)
    {
        $user = $request->user();

        $dailyReward = $user->dailyReward ?? DailyReward::create(['user_id' => $user->id]);

        return response()->json([
            'can_claim' => $dailyReward->canClaim(),
            'last_claimed_at' => $dailyReward->last_claimed_at,
            'streak' => $dailyReward->streak,
            'streak_bonus' => $dailyReward->getStreakBonus(),
            'next_claim_at' => $dailyReward->last_claimed_at?->addDay(),
        ]);
    }

    public function claim(Request $request)
    {
        $user = $request->user();

        $dailyReward = $user->dailyReward ?? DailyReward::create(['user_id' => $user->id]);

        if (!$dailyReward->canClaim()) {
            return response()->json([
                'message' => 'Already claimed today',
                'next_claim_at' => $dailyReward->last_claimed_at->addDay(),
            ], 422);
        }

        $dailyReward->claim();
        $baseXp = 10 + ($dailyReward->streak * 5);

        return response()->json([
            'message' => 'Daily reward claimed successfully',
            'xp_earned' => $baseXp,
            'streak' => $dailyReward->streak,
            'streak_bonus' => $dailyReward->getStreakBonus(),
        ]);
    }

    public function getStreak(Request $request)
    {
        $user = $request->user();

        $dailyReward = $user->dailyReward ?? DailyReward::create(['user_id' => $user->id]);

        return response()->json([
            'current_streak' => $dailyReward->streak,
            'last_claimed_at' => $dailyReward->last_claimed_at,
            'streak_bonus_multiplier' => $dailyReward->getStreakBonus(),
        ]);
    }
}
