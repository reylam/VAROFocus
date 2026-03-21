<?php

namespace App\Http\Controllers;

use App\Models\XpLog;
use Illuminate\Http\Request;

class XpLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);
        $source = $request->get('source');

        $query = $user->xpLogs();

        if ($source) {
            $query->bySource($source);
        }

        $logs = $query->orderByLatest()->paginate($limit);

        return response()->json($logs);
    }

    public function getStats(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_xp' => $user->xpLogs()->sum('amount') ?? 0,
            'today_xp' => $user->xpLogs()->today()->sum('amount') ?? 0,
            'week_xp' => $user->xpLogs()->thisWeek()->sum('amount') ?? 0,
            'month_xp' => $user->xpLogs()->thisMonth()->sum('amount') ?? 0,
            'by_source' => $this->getXpBySource($user),
        ];

        return response()->json($stats);
    }

    public function getTodayXp(Request $request)
    {
        $user = $request->user();
        $logs = $user->xpLogs()->today()->orderByLatest()->get();

        return response()->json([
            'total' => $logs->sum('amount'),
            'logs' => $logs,
        ]);
    }

    public function getWeeklyXp(Request $request)
    {
        $user = $request->user();
        $logs = $user->xpLogs()->thisWeek()->get();

        $byDay = [];
        for ($i = 0; $i < 7; $i++) {
            $date = now()->subDays($i)->startOfDay();
            $byDay[now()->subDays($i)->format('l')] = $logs
                ->where('created_at', '>=', $date)
                ->where('created_at', '<', $date->addDay())
                ->sum('amount');
        }

        return response()->json([
            'total' => $logs->sum('amount'),
            'by_day' => $byDay,
            'logs' => $logs->orderByLatest(),
        ]);
    }

    private function getXpBySource($user)
    {
        $sources = ['task_complete', 'pomodoro', 'bonus', 'daily_streak', 'achievement'];
        $bySource = [];

        foreach ($sources as $source) {
            $bySource[$source] = $user->xpLogs()->bySource($source)->sum('amount') ?? 0;
        }

        return $bySource;
    }
}
