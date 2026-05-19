<?php

namespace App\Http\Controllers;

use App\Models\StudyRoom;
use App\Models\RoomSession;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;

class StudyRoomController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 20);
        $isPrivate = $request->get('is_private');

        $query = StudyRoom::with('owner:id,username,avatar_url')
            ->withCount('members');

        if ($isPrivate !== null) {
            $query->where('is_private', (bool) $isPrivate);
        } else {
            $query->where('is_private', false);
        }

        $rooms = $query->paginate($limit);

        return response()->json($rooms);
    }

    public function getRecommendedRooms(Request $request)
    {
        $limit = $request->get('limit', 20);

        $rooms = StudyRoom::with('owner:id,username,avatar_url')
            ->withCount('members')
            ->where('is_private', false)
            ->orderByDesc('members_count')
            ->paginate($limit);

        return response()->json($rooms);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_private' => 'boolean|default:false',
            'max_members' => 'integer|min:2|max:50|default:10',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $room = StudyRoom::create([
            'owner_id' => $user->id,
            ...$validated,
        ]);

        // Add owner as member
        $room->addMember($user, 'owner');

        return response()->json([
            'message' => 'Study room created successfully',
            'room' => $room->load('owner', 'members'),
        ], 201);
    }

    public function show($id, Request $request)
    {
        $room = StudyRoom::with(['owner', 'members', 'sessions'])->findOrFail($id);

        $stats = [
            'member_count' => $room->getMemberCount(),
            'is_full' => $room->isFull(),
            'active_session' => $room->getActiveSession() !== null,
        ];

        return response()->json([
            'room' => $room,
            'stats' => $stats,
        ]);
    }

    public function update($id, Request $request)
    {
        $user = $request->user();
        $room = StudyRoom::findOrFail($id);

        if ($room->owner_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validation = Validator::make($request->all(), [
            'name' => 'string|max:100',
            'description' => 'nullable|string',
            'is_private' => 'boolean',
            'max_members' => 'integer|min:2|max:50',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $room->update($validated);

        return response()->json([
            'message' => 'Study room updated successfully',
            'room' => $room,
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $room = StudyRoom::findOrFail($id);

        if ($room->owner_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $room->delete();

        return response()->json([
            'message' => 'Study room deleted successfully',
        ]);
    }

    public function join($id, Request $request)
    {
        $user = $request->user();
        $room = StudyRoom::findOrFail($id);

        if ($room->isMember($user)) {
            return response()->json([
                'message' => 'Already a member',
            ], 422);
        }

        if ($room->isFull()) {
            return response()->json([
                'message' => 'Room is full',
            ], 422);
        }

        $room->addMember($user, 'member');

        return response()->json([
            'message' => 'Joined study room successfully',
            'room' => $room->load('members'),
        ]);
    }

    public function leave($id, Request $request)
    {
        $user = $request->user();
        $room = StudyRoom::findOrFail($id);

        if (!$room->isMember($user)) {
            return response()->json([
                'message' => 'Not a member',
            ], 422);
        }

        if ($room->isOwner($user)) {
            return response()->json([
                'message' => 'Owner cannot leave (delete instead)',
            ], 422);
        }

        $room->removeMember($user);

        return response()->json([
            'message' => 'Left study room successfully',
        ]);
    }

    public function startSession($id, Request $request)
    {
        $user = $request->user();
        $room = StudyRoom::findOrFail($id);

        if (!$room->isMember($user)) {
            return response()->json([
                'message' => 'Not a member',
            ], 403);
        }

        $activeSession = $room->getActiveSession();

        if ($activeSession) {
            return response()->json([
                'message' => 'Session already active',
                'session' => $activeSession,
            ], 422);
        }

        $session = $room->startSession();

        return response()->json([
            'message' => 'Session started',
            'session' => $session,
        ], 201);
    }

    public function endSession($id, Request $request)
    {
        $user = $request->user();
        $room = StudyRoom::findOrFail($id);

        if (!$room->isMember($user)) {
            return response()->json([
                'message' => 'Not a member',
            ], 403);
        }

        $session = $room->getActiveSession();

        if (!$session) {
            return response()->json([
                'message' => 'No active session',
            ], 422);
        }

        $session->end();

        return response()->json([
            'message' => 'Session ended',
            'session' => $session,
            'duration_minutes' => $session->getDuration(),
        ]);
    }

    public function getMembers($id, Request $request)
    {
        $room = StudyRoom::findOrFail($id);
        $limit = $request->get('limit', 20);

        $members = $room->members()
            ->with('roomMembers')
            ->paginate($limit);

        return response()->json($members);
    }

    public function getUserRooms(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 10);

        $rooms = $user->studyRooms()
            ->with('owner:id,username,avatar_url')
            ->withCount('members')
            ->paginate($limit);

        return response()->json($rooms);
    }
}
