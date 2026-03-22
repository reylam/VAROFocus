<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use App\Models\Task;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
class ReminderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);
        $sent = $request->get('sent');

        $query = $user->reminders();

        if ($sent !== null) {
            $sent = filter_var($sent, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_sent', $sent);
        }

        $reminders = $query->latest()->paginate($limit);

        return response()->json($reminders);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'task_id' => 'required|exists:tasks,id',
            'reminder_time' => 'required|date_format:Y-m-d H:i:s|after:now',
            'type' => 'required|in:email,push,in_app',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $task = $user->tasks()->findOrFail($validated['task_id']);

        $reminder = $user->reminders()->create([
            'task_id' => $validated['task_id'],
            'reminder_time' => $validated['reminder_time'],
            'type' => $validated['type'],
            'is_sent' => false,
        ]);

        return response()->json([
            'message' => 'Reminder created successfully',
            'data' => $reminder,
        ], 201);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();

        $reminder = $user->reminders()->findOrFail($id);

        return response()->json($reminder);
    }

    public function update($id, Request $request)
    {
        $user = $request->user();

        $reminder = $user->reminders()->findOrFail($id);

        $validation = Validator::make($request->all(), [
            'reminder_time' => 'sometimes|date_format:Y-m-d H:i:s|after:now',
            'type' => 'sometimes|in:email,push,in_app',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $reminder->update($validated);

        return response()->json([
            'message' => 'Reminder updated successfully',
            'data' => $reminder,
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();

        $reminder = $user->reminders()->findOrFail($id);

        $reminder->delete();

        return response()->json([
            'message' => 'Reminder deleted successfully',
        ]);
    }

    public function sendReminder($id, Request $request)
    {
        $user = $request->user();

        $reminder = $user->reminders()->findOrFail($id);

        // Send reminder based on type
        // TODO: Implement actual notification sending
        // Mail::send(), Notification::send(), etc.

        $reminder->update([
            'is_sent' => true,
            'sent_at' => now(),
        ]);

        return response()->json([
            'message' => 'Reminder sent successfully',
            'data' => $reminder,
        ]);
    }

    public function getUpcomingReminders(Request $request)
    {
        $user = $request->user();
        $hours = $request->get('hours', 24);

        $reminders = $user->reminders()
            ->where('is_sent', false)
            ->whereBetween('reminder_time', [now(), now()->addHours($hours)])
            ->with('task')
            ->orderBy('reminder_time')
            ->get();

        return response()->json($reminders);
    }

    public function getPendingReminders(Request $request)
    {
        $user = $request->user();

        $reminders = $user->reminders()
            ->where('is_sent', false)
            ->where('reminder_time', '<=', now())
            ->with('task')
            ->orderBy('reminder_time')
            ->get();

        return response()->json($reminders);
    }

    public function getRemindersByType($type, Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);

        $reminders = $user->reminders()
            ->where('type', $type)
            ->latest()
            ->paginate($limit);

        return response()->json($reminders);
    }

    public function getReminderStats(Request $request)
    {
        $user = $request->user();

        $total = $user->reminders()->count();
        $sent = $user->reminders()->where('is_sent', true)->count();
        $pending = $user->reminders()->where('is_sent', false)->count();

        $byType = [];
        $types = ['email', 'push', 'in_app'];
        foreach ($types as $type) {
            $byType[$type] = $user->reminders()->where('type', $type)->count();
        }

        return response()->json([
            'total' => $total,
            'sent' => $sent,
            'pending' => $pending,
            'by_type' => $byType,
        ]);
    }
}
