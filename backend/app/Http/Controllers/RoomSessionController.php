<?php

namespace App\Http\Controllers;

use App\Models\RoomSession;
use App\Models\StudyRoom;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;\nclass RoomSessionController extends Controller
{
    public function index(Request $request)
    {
        $roomId = $request->get('room_id');
        $limit = $request->get('limit', 20);

        $query = RoomSession::query();

        if ($roomId) {
            $query->where('study_room_id', $roomId);
        }

        $sessions = $query->with(['room', 'startedBy'])
            ->latest('started_at')
            ->paginate($limit);

        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'study_room_id' => 'required|exists:study_rooms,id',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $room = StudyRoom::findOrFail($validated['study_room_id']);

        // Authorization: user must be a member
        if (!$room->members()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'You are not a member of this room',
            ], 403);
        }

        $session = RoomSession::create([
            'study_room_id' => $validated['study_room_id'],
            'started_by' => $user->id,
            'started_at' => now(),
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Room session started successfully',
            'data' => $session->load(['room', 'startedBy']),
        ], 201);
    }

    public function show($id, Request $request)
    {
        $session = RoomSession::with(['room', 'startedBy', 'room.members'])
            ->findOrFail($id);

        return response()->json($session);
    }

    public function endSession($id, Request $request)
    {
        $user = $request->user();
        $session = RoomSession::findOrFail($id);

        // Authorization: only the one who started or room owner can end
        if ($session->started_by !== $user->id && $session->room->owner_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to end this session',
            ], 403);
        }

        $session->update([
            'ended_at' => now(),
            'is_active' => false,
        ]);

        $durationMinutes = $session->started_at->diffInMinutes($session->ended_at);

        return response()->json([
            'message' => 'Room session ended successfully',
            'data' => [
                'session' => $session,
                'duration_minutes' => $durationMinutes,
            ],
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $session = RoomSession::findOrFail($id);

        // Authorization: only room owner can delete
        if ($session->room->owner_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this session',
            ], 403);
        }

        $session->delete();

        return response()->json([
            'message' => 'Room session deleted successfully',
        ]);
    }

    public function getActiveSessions(Request $request)
    {
        $sessions = RoomSession::where('is_active', true)
            ->with(['room', 'startedBy'])
            ->latest('started_at')
            ->get();

        return response()->json($sessions);
    }

    public function getSessionsByRoom($roomId, Request $request)
    {
        $limit = $request->get('limit', 20);

        $sessions = RoomSession::where('study_room_id', $roomId)
            ->with('startedBy')
            ->latest('started_at')
            ->paginate($limit);

        return response()->json($sessions);
    }

    public function getSessionStats(Request $request)
    {
        $total = RoomSession::count();
        $active = RoomSession::where('is_active', true)->count();
        $completed = RoomSession::where('is_active', false)
            ->whereNotNull('ended_at')
            ->count();

        $avgDuration = RoomSession::whereNotNull('ended_at')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (ended_at - started_at))) as avg_seconds')
            ->first()
            ->avg_seconds ?? 0;

        return response()->json([
            'total_sessions' => $total,
            'active_sessions' => $active,
            'completed_sessions' => $completed,
            'average_duration_minutes' => round($avgDuration / 60, 2),
        ]);
    }

    public function getSessionsByUser($userId, Request $request)
    {
        $limit = $request->get('limit', 20);

        $sessions = RoomSession::where('started_by', $userId)
            ->with('room')
            ->latest('started_at')
            ->paginate($limit);

        return response()->json($sessions);
    }

    public function getTodaySessions(Request $request)
    {
        $sessions = RoomSession::whereDate('started_at', now()->toDateString())
            ->with(['room', 'startedBy'])
            ->orderBy('started_at')
            ->get();

        return response()->json([
            'count' => $sessions->count(),
            'sessions' => $sessions,
        ]);
    }

    public function getMostActiveTimes(Request $request)
    {
        // Get peak session times
        $sessions = RoomSession::all();
        $hours = [];

        foreach ($sessions as $session) {
            $hour = $session->started_at->format('H');
            $hours[$hour] = ($hours[$hour] ?? 0) + 1;
        }

        arsort($hours);
        $peakHours = array_slice($hours, 0, 5, true);

        return response()->json([
            'peak_hours' => $peakHours,
            'all_hours' => $hours,
        ]);
    }
}
