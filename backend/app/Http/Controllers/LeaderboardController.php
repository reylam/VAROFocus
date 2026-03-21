<?php

namespace App\Http\Controllers;

use App\Models\Leaderboard;
use App\Models\LeaderboardEntry;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->get('type', 'global');
        $category = $request->get('category', 'xp');

        $leaderboard = Leaderboard::where('type', $type)
            ->where('category', $category)
            ->active()
            ->first();

        if (!$leaderboard) {
            return response()->json([
                'message' => 'Leaderboard not found',
            ], 404);
        }

        return response()->json($leaderboard);
    }

    public function getTopEntries(Request $request)
    {
        $type = $request->get('type', 'global');
        $category = $request->get('category', 'xp');
        $limit = $request->get('limit', 10);

        $leaderboard = Leaderboard::where('type', $type)
            ->where('category', $category)
            ->active()
            ->first();

        if (!$leaderboard) {
            return response()->json([
                'message' => 'Leaderboard not found',
            ], 404);
        }

        $entries = $leaderboard->entries()
            ->with('user:id,username,avatar_url,level,xp')
            ->orderBy('rank')
            ->limit($limit)
            ->get();

        return response()->json([
            'leaderboard' => $leaderboard,
            'entries' => $entries,
        ]);
    }

    public function getRanking(Request $request)
    {
        $user = $request->user();
        $type = $request->get('type', 'global');
        $category = $request->get('category', 'xp');

        $leaderboard = Leaderboard::where('type', $type)
            ->where('category', $category)
            ->active()
            ->first();

        if (!$leaderboard) {
            return response()->json([
                'message' => 'Leaderboard not found',
            ], 404);
        }

        $entry = $leaderboard->entries()
            ->where('user_id', $user->id)
            ->first();

        if (!$entry) {
            return response()->json([
                'message' => 'User not ranked yet',
            ], 404);
        }

        return response()->json([
            'rank' => $entry->rank,
            'score' => $entry->score,
            'category' => $leaderboard->category,
            'type' => $leaderboard->type,
        ]);
    }

    public function aroundMe(Request $request)
    {
        $user = $request->user();
        $type = $request->get('type', 'global');
        $category = $request->get('category', 'xp');
        $range = $request->get('range', 5);

        $leaderboard = Leaderboard::where('type', $type)
            ->where('category', $category)
            ->active()
            ->first();

        if (!$leaderboard) {
            return response()->json([
                'message' => 'Leaderboard not found',
            ], 404);
        }

        $myEntry = $leaderboard->entries()->where('user_id', $user->id)->first();

        if (!$myEntry) {
            return response()->json([
                'message' => 'You are not ranked yet',
            ], 404);
        }

        $minRank = max(1, $myEntry->rank - $range);
        $maxRank = $myEntry->rank + $range;

        $entries = $leaderboard->entries()
            ->with('user:id,username,avatar_url,level')
            ->whereBetween('rank', [$minRank, $maxRank])
            ->orderBy('rank')
            ->get();

        return response()->json([
            'my_rank' => $myEntry->rank,
            'nearby_entries' => $entries,
        ]);
    }

    public function getByType(Request $request)
    {
        $type = $request->get('type', 'global');

        $leaderboards = Leaderboard::where('type', $type)
            ->active()
            ->get();

        return response()->json($leaderboards);
    }

    public function getAllActive(Request $request)
    {
        $leaderboards = Leaderboard::active()->get();

        return response()->json($leaderboards);
    }
}
