<?php

namespace App\Http\Controllers;

use App\Models\UserSpinLog;
use Illuminate\Http\Request;

class UserSpinLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);
        $sort = $request->get('sort', 'obtained_at');
        $direction = $request->get('direction', 'desc');

        $logs = $user->spinLogs()
            ->with('reward')
            ->orderBy($sort, $direction)
            ->paginate($limit);

        return response()->json($logs);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();

        $log = $user->spinLogs()
            ->with('reward')
            ->findOrFail($id);

        return response()->json($log);
    }

    public function delete($id, Request $request)
    {
        $user = $request->user();

        $log = $user->spinLogs()->findOrFail($id);

        $log->delete();

        return response()->json([
            'message' => 'Spin log deleted successfully',
        ]);
    }

    public function getTodaySpins(Request $request)
    {
        $user = $request->user();

        $spins = $user->spinLogs()
            ->with('reward')
            ->whereDate('obtained_at', now()->toDateString())
            ->orderByLatest()
            ->get();

        return response()->json([
            'count' => $spins->count(),
            'spins' => $spins,
        ]);
    }

    public function getWeeklySpins(Request $request)
    {
        $user = $request->user();
        $days = $request->get('days', 7);

        $startDate = now()->subDays($days)->startOfDay();

        $spins = $user->spinLogs()
            ->with('reward')
            ->where('obtained_at', '>=', $startDate)
            ->orderByLatest()
            ->get();

        $spinsByDay = [];
        for ($i = 0; $i < $days; $i++) {
            $date = now()->subDays($days - 1 - $i)->toDateString();
            $spinsByDay[$date] = $spins->filter(function ($s) use ($date) {
                return $s->obtained_at->toDateString() === $date;
            })->count();
        }

        return response()->json([
            'total_spins' => $spins->count(),
            'spins_by_day' => $spinsByDay,
        ]);
    }

    public function getRewardDistribution(Request $request)
    {
        $user = $request->user();

        $distribution = $user->spinLogs()
            ->with('reward')
            ->get()
            ->groupBy('reward.type')
            ->map(function ($logs) {
                return $logs->count();
            });

        return response()->json($distribution);
    }

    public function getMostRecentSpins(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 10);

        $spins = $user->spinLogs()
            ->with('reward')
            ->latest('obtained_at')
            ->limit($limit)
            ->get();

        return response()->json($spins);
    }
}
