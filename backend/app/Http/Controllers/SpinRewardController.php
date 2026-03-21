<?php

namespace App\Http\Controllers;

use App\Models\SpinReward;
use App\Models\UserSpinLog;
use Illuminate\Http\Request;

class SpinRewardController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 20);
        $type = $request->get('type');

        $query = SpinReward::active();

        if ($type) {
            $query->byType($type);
        }

        $rewards = $query->paginate($limit);

        return response()->json($rewards);
    }

    public function spin(Request $request)
    {
        $user = $request->user();

        $reward = SpinReward::spinWheel();

        if (!$reward) {
            return response()->json([
                'message' => 'No rewards available',
            ], 422);
        }

        // Apply reward
        $reward->applyReward($user);

        // Log the spin
        UserSpinLog::create([
            'user_id' => $user->id,
            'reward_id' => $reward->id,
            'obtained_at' => now(),
        ]);

        return response()->json([
            'message' => 'Spin successful!',
            'reward' => [
                'id' => $reward->id,
                'name' => $reward->name,
                'description' => $reward->description,
                'type' => $reward->type,
                'value' => $reward->value,
            ],
        ]);
    }

    public function getUserSpinHistory(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);

        $history = $user->spinLogs()
            ->with('reward')
            ->orderByLatest()
            ->paginate($limit);

        return response()->json($history);
    }

    public function getSpinStats(Request $request)
    {
        $user = $request->user();

        $totalSpins = $user->spinLogs()->count();
        $spinsByType = [];

        $types = ['xp_boost', 'theme', 'item', 'badge'];
        foreach ($types as $type) {
            $spinsByType[$type] = $user->spinLogs()
                ->whereHas('reward', function ($q) use ($type) {
                    $q->where('type', $type);
                })
                ->count();
        }

        return response()->json([
            'total_spins' => $totalSpins,
            'spins_by_type' => $spinsByType,
        ]);
    }

    public function getRewardStats(Request $request)
    {
        $rewardId = $request->get('reward_id');

        if (!$rewardId) {
            return response()->json([
                'message' => 'Reward ID required',
            ], 422);
        }

        $reward = SpinReward::findOrFail($rewardId);
        $claimCount = $reward->getTimesClaimed();

        return response()->json([
            'reward' => $reward,
            'claimed_count' => $claimCount,
            'probability' => $reward->probability,
        ]);
    }
}
