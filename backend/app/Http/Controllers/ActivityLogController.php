<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);
        $action = $request->get('action');
        $entityType = $request->get('entity_type');

        $query = $user->activityLogs();

        if ($action) {
            $query->where('action', $action);
        }

        if ($entityType) {
            $query->where('entity_type', $entityType);
        }

        $logs = $query->latest()->paginate($limit);

        return response()->json($logs);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();

        $log = $user->activityLogs()->findOrFail($id);

        return response()->json($log);
    }

    public function getTodayActivity(Request $request)
    {
        $user = $request->user();

        $activities = $user->activityLogs()
            ->whereDate('created_at', now()->toDateString())
            ->latest()
            ->get();

        return response()->json([
            'count' => $activities->count(),
            'activities' => $activities,
        ]);
    }

    public function getWeeklyActivity(Request $request)
    {
        $user = $request->user();
        $days = $request->get('days', 7);

        $startDate = now()->subDays($days)->startOfDay();

        $activities = $user->activityLogs()
            ->where('created_at', '>=', $startDate)
            ->latest()
            ->get();

        $activitiesByDay = [];
        for ($i = 0; $i < $days; $i++) {
            $date = now()->subDays($days - 1 - $i)->toDateString();
            $activitiesByDay[$date] = $activities->filter(function ($a) use ($date) {
                return $a->created_at->toDateString() === $date;
            })->count();
        }

        return response()->json([
            'total_activities' => $activities->count(),
            'activities_by_day' => $activitiesByDay,
        ]);
    }

    public function getActivitySummary(Request $request)
    {
        $user = $request->user();

        $actions = $user->activityLogs()
            ->get()
            ->groupBy('action')
            ->map(function ($logs) {
                return $logs->count();
            });

        $entityTypes = $user->activityLogs()
            ->get()
            ->groupBy('entity_type')
            ->map(function ($logs) {
                return $logs->count();
            });

        return response()->json([
            'actions' => $actions,
            'entity_types' => $entityTypes,
            'total' => $user->activityLogs()->count(),
        ]);
    }

    public function getStreak(Request $request)
    {
        $user = $request->user();

        // Calculate activity streak
        $streak = 0;
        $currentDate = now()->copy();

        while (true) {
            $dateString = $currentDate->toDateString();
            $hasActivity = $user->activityLogs()
                ->whereDate('created_at', $dateString)
                ->exists();

            if (!$hasActivity) {
                break;
            }

            $streak++;
            $currentDate->subDay();
        }

        return response()->json([
            'current_streak' => $streak,
            'user_id' => $user->id,
        ]);
    }

    public function getMostActiveHours(Request $request)
    {
        $user = $request->user();
        $hours = [];

        for ($i = 0; $i < 24; $i++) {
            $hours[$i] = $user->activityLogs()
                ->whereRaw('HOUR(created_at) = ?', [$i])
                ->count();
        }

        arsort($hours);
        $topHours = array_slice($hours, 0, 5, true);

        return response()->json([
            'all_hours' => $hours,
            'top_5_active_hours' => $topHours,
        ]);
    }

    public function getRecentActivity(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 10);

        $activities = $user->activityLogs()
            ->latest()
            ->limit($limit)
            ->get();

        return response()->json($activities);
    }

    public function deleteOldLogs(Request $request)
    {
        $user = $request->user();
        $days = $request->get('older_than_days', 30);

        $deletedCount = $user->activityLogs()
            ->where('created_at', '<', now()->subDays($days))
            ->delete();

        return response()->json([
            'message' => 'Old logs deleted successfully',
            'deleted_count' => $deletedCount,
        ]);
    }
}
