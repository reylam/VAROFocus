<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Task;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);

        $schedules = $user->schedules()
            ->with('task')
            ->latest('scheduled_date')
            ->paginate($limit);

        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'scheduled_date' => 'required|date_format:Y-m-d|after:today',
            'priority' => 'sometimes|in:low,medium,high,urgent',
        ]);

        // Verify task belongs to user
        $task = $user->tasks()->findOrFail($validated['task_id']);

        $schedule = $user->schedules()->create([
            'task_id' => $validated['task_id'],
            'scheduled_date' => $validated['scheduled_date'],
            'priority' => $validated['priority'] ?? 'medium',
        ]);

        return response()->json([
            'message' => 'Schedule created successfully',
            'data' => $schedule->load('task'),
        ], 201);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();

        $schedule = $user->schedules()->with('task')->findOrFail($id);

        return response()->json($schedule);
    }

    public function update($id, Request $request)
    {
        $user = $request->user();

        $schedule = $user->schedules()->findOrFail($id);

        $validated = $request->validate([
            'scheduled_date' => 'sometimes|date_format:Y-m-d|after:today',
            'priority' => 'sometimes|in:low,medium,high,urgent',
        ]);

        $schedule->update($validated);

        return response()->json([
            'message' => 'Schedule updated successfully',
            'data' => $schedule,
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();

        $schedule = $user->schedules()->findOrFail($id);

        $schedule->delete();

        return response()->json([
            'message' => 'Schedule deleted successfully',
        ]);
    }

    public function getSchedulesByDate($date, Request $request)
    {
        $user = $request->user();

        $schedules = $user->schedules()
            ->where('scheduled_date', $date)
            ->with('task')
            ->orderBy('priority')
            ->get();

        return response()->json($schedules);
    }

    public function getUpcomingSchedules(Request $request)
    {
        $user = $request->user();
        $days = $request->get('days', 7);

        $endDate = now()->addDays($days)->toDateString();

        $schedules = $user->schedules()
            ->whereBetween('scheduled_date', [now()->toDateString(), $endDate])
            ->with('task')
            ->orderBy('scheduled_date')
            ->orderBy('priority')
            ->get();

        return response()->json($schedules);
    }

    public function getTodaySchedules(Request $request)
    {
        $user = $request->user();

        $schedules = $user->schedules()
            ->where('scheduled_date', now()->toDateString())
            ->with('task')
            ->orderBy('priority')
            ->get();

        return response()->json($schedules);
    }

    public function getSchedulesByPriority($priority, Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);

        $schedules = $user->schedules()
            ->where('priority', $priority)
            ->with('task')
            ->latest('scheduled_date')
            ->paginate($limit);

        return response()->json($schedules);
    }

    public function getScheduleStats(Request $request)
    {
        $user = $request->user();

        $total = $user->schedules()->count();
        $upcoming = $user->schedules()
            ->where('scheduled_date', '>', now()->toDateString())
            ->count();
        $today = $user->schedules()
            ->where('scheduled_date', now()->toDateString())
            ->count();
        $overdue = $user->schedules()
            ->where('scheduled_date', '<', now()->toDateString())
            ->count();

        $byPriority = [];
        $priorities = ['low', 'medium', 'high', 'urgent'];
        foreach ($priorities as $priority) {
            $byPriority[$priority] = $user->schedules()
                ->where('priority', $priority)
                ->count();
        }

        return response()->json([
            'total' => $total,
            'upcoming' => $upcoming,
            'today' => $today,
            'overdue' => $overdue,
            'by_priority' => $byPriority,
        ]);
    }

    public function autoScheduleByDeadline(Request $request)
    {
        $user = $request->user();

        $tasks = $user->tasks()
            ->whereNotNull('deadline')
            ->where('status', '!=', 'completed')
            ->get();

        $created = 0;
        foreach ($tasks as $task) {
            // Check if schedule already exists
            $existingSchedule = $user->schedules()
                ->where('task_id', $task->id)
                ->first();

            if (!$existingSchedule) {
                $user->schedules()->create([
                    'task_id' => $task->id,
                    'scheduled_date' => $task->deadline->toDateString(),
                    'priority' => $task->difficultyLevel() === 'boss' ? 'urgent' : 'high',
                ]);
                $created++;
            }
        }

        return response()->json([
            'message' => 'Auto-scheduling completed',
            'schedules_created' => $created,
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'schedule_ids' => 'required|array',
            'schedule_ids.*' => 'exists:schedules,id',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'scheduled_date' => 'sometimes|date_format:Y-m-d',
        ]);

        $updated = $user->schedules()
            ->whereIn('id', $validated['schedule_ids'])
            ->update(array_filter([
                'priority' => $validated['priority'] ?? null,
                'scheduled_date' => $validated['scheduled_date'] ?? null,
            ], function ($value) {
                return $value !== null;
            }));

        return response()->json([
            'message' => 'Schedules updated successfully',
            'updated_count' => $updated,
        ]);
    }
}
