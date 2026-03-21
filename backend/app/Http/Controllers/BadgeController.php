<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 20);
        $rarity = $request->get('rarity');

        $query = Badge::query();

        if ($rarity) {
            $query->byRarity($rarity);
        }

        $badges = $query->paginate($limit);

        return response()->json($badges);
    }

    public function show($id)
    {
        $badge = Badge::findOrFail($id);
        $userCount = $badge->users()->count();

        return response()->json([
            'badge' => $badge,
            'earned_by_count' => $userCount,
        ]);
    }

    public function getUserBadges(Request $request)
    {
        $user = $request->user();
        $badges = $user->badges()
            ->withPivot('obtained_at')
            ->paginate(20);

        return response()->json($badges);
    }

    public function getByRarity(Request $request)
    {
        $rarity = $request->get('rarity');

        if (!in_array($rarity, ['common', 'rare', 'epic', 'legendary'])) {
            return response()->json([
                'message' => 'Invalid rarity',
            ], 422);
        }

        $badges = Badge::byRarity($rarity)->get();

        return response()->json($badges);
    }

    public function getStats(Request $request)
    {
        $stats = [
            'common' => Badge::common()->count(),
            'rare' => Badge::rare()->count(),
            'epic' => Badge::epic()->count(),
            'legendary' => Badge::legendary()->count(),
            'total' => Badge::count(),
        ];

        return response()->json($stats);
    }
}
