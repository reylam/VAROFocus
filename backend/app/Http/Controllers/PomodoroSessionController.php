<?php

namespace App\Http\Controllers;

use App\Models\PomodoroSession;
use App\Models\PomodoroStreak;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
class PomodoroSessionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $status = $request->get('status');
        $limit = $request->get('limit', 20);

        $query = $user->pomodoroSessions()->with(['task:id,title']);

        if ($status) {
            $query->where('status', $status);
        }

        $sessions = $query->orderBy('started_at', 'desc')->paginate($limit);

        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'task_id' => 'nullable|exists:tasks,id',
            'duration_minutes' => 'integer|min:15|max:60|default:25',
            'break_minutes' => 'integer|min:5|max:30|default:5',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $session = $user->pomodoroSessions()->create([
            'task_id' => $validated['task_id'] ?? null,
            'duration_minutes' => $validated['duration_minutes'] ?? 25,
            'break_minutes' => $validated['break_minutes'] ?? 5,
            'status' => 'running',
            'started_at' => now(),
        ]);

        return response()->json([
            'message' => 'Pomodoro session started',
            'session' => $session,
        ], 201);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();
        $session = $user->pomodoroSessions()->findOrFail($id);

        return response()->json($session);
    }

    public function complete($id, Request $request)
    {
        $user = $request->user();
        $session = $user->pomodoroSessions()->findOrFail($id);

        if ($session->status !== 'running') {
            return response()->json([
                'message' => 'Session is not running',
            ], 422);
        }

        $session->complete();

        return response()->json([
            'message' => 'Pomodoro session completed',
            'session' => $session,
            'xp_earned' => 25,
        ]);
    }

    public function cancel($id, Request $request)
    {
        $user = $request->user();
        $session = $user->pomodoroSessions()->findOrFail($id);

        $session->cancel();

        return response()->json([
            'message' => 'Pomodoro session cancelled',
            'session' => $session,
        ]);
    }

    public function getTodayStats(Request $request)
    {
        $user = $request->user();

        $today = $user->pomodoroSessions()->today()->get();

        $stats = [
            'total_sessions' => $today->count(),
            'completed_sessions' => $today->where('status', 'completed')->count(),
            'total_minutes' => $today->where('status', 'completed')->sum('duration_minutes'),
            'xp_earned' => $today->where('status', 'completed')->count() * 25,
        ];

        return response()->json($stats);
    }

    public function getWeeklyStats(Request $request)
    {
        $user = $request->user();
        $sessions = $user->pomodoroSessions()->thisWeek()->get();

        $stats = [
            'total_sessions' => $sessions->count(),
            'completed_sessions' => $sessions->where('status', 'completed')->count(),
            'total_minutes' => $sessions->where('status', 'completed')->sum('duration_minutes'),
            'xp_earned' => $sessions->where('status', 'completed')->count() * 25,
        ];

        return response()->json($stats);
    }
}
