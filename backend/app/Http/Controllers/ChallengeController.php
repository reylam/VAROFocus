<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\ChallengeParticipant;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'active');
        $limit = $request->get('limit', 20);

        $query = Challenge::with(['creator:id,username,avatar_url', 'participants']);

        if ($status === 'active') {
            $query->active();
        } elseif ($status === 'upcoming') {
            $query->upcoming();
        } elseif ($status === 'ended') {
            $query->ended();
        }

        $challenges = $query->paginate($limit);

        return response()->json($challenges);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'challenge_type' => 'required|string|in:tasks_completed,xp_gained,pomodoros',
            'target_value' => 'required|integer|min:1',
            'start_date' => 'required|date_format:Y-m-d H:i:s',
            'end_date' => 'required|date_format:Y-m-d H:i:s|after:start_date',
            'reward_xp' => 'integer|min:0|default:100',
            'reward_badge_id' => 'nullable|exists:badges,id',
        ]);

        $challenge = Challenge::create([
            'creator_id' => $user->id,
            ...$validated,
            'is_active' => true,
        ]);

        // Add creator as participant
        $challenge->addParticipant($user);

        return response()->json([
            'message' => 'Challenge created successfully',
            'challenge' => $challenge->load('creator', 'participants'),
        ], 201);
    }

    public function show($id, Request $request)
    {
        $challenge = Challenge::with([
            'creator:id,username,avatar_url',
            'rewardBadge:id,name,icon',
            'participants' => function ($q) {
                $q->select('users.id', 'users.username', 'users.avatar_url', 'users.level');
            },
        ])->findOrFail($id);

        $userParticipation = null;
        if (auth()->check()) {
            $userParticipation = $challenge->participantRecords()
                ->where('user_id', auth()->id())
                ->first();
        }

        return response()->json([
            'challenge' => $challenge,
            'user_participation' => $userParticipation,
            'participant_count' => $challenge->participants()->count(),
            'completed_count' => $challenge->getCompletedCount(),
        ]);
    }

    public function update($id, Request $request)
    {
        $user = $request->user();
        $challenge = Challenge::findOrFail($id);

        if ($challenge->creator_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'reward_xp' => 'integer|min:0',
        ]);

        $challenge->update($validated);

        return response()->json([
            'message' => 'Challenge updated successfully',
            'challenge' => $challenge,
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $challenge = Challenge::findOrFail($id);

        if ($challenge->creator_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $challenge->delete();

        return response()->json([
            'message' => 'Challenge deleted successfully',
        ]);
    }

    public function join($id, Request $request)
    {
        $user = $request->user();
        $challenge = Challenge::findOrFail($id);

        if (!$challenge->isActive()) {
            return response()->json([
                'message' => 'Challenge is not active',
            ], 422);
        }

        if ($challenge->participants()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'Already participating',
            ], 422);
        }

        $challenge->addParticipant($user);

        return response()->json([
            'message' => 'Joined challenge successfully',
        ], 201);
    }

    public function leave($id, Request $request)
    {
        $user = $request->user();
        $challenge = Challenge::findOrFail($id);

        $challenge->removeParticipant($user);

        return response()->json([
            'message' => 'Left challenge successfully',
        ]);
    }

    public function updateProgress($id, Request $request)
    {
        $user = $request->user();
        $challenge = Challenge::findOrFail($id);

        $validated = $request->validate([
            'progress' => 'required|integer|min:0',
        ]);

        $participant = $challenge->updateParticipantProgress($user->id, $validated['progress']);

        if (!$participant) {
            return response()->json([
                'message' => 'Not a participant',
            ], 422);
        }

        return response()->json([
            'message' => 'Progress updated',
            'participation' => $participant,
            'completed' => $participant->isCompleted(),
        ]);
    }

    public function getLeaderboard($id, Request $request)
    {
        $challenge = Challenge::findOrFail($id);
        $limit = $request->get('limit', 20);

        $leaderboard = $challenge->participantRecords()
            ->with('user:id,username,avatar_url,level')
            ->orderBy('progress', 'desc')
            ->paginate($limit);

        return response()->json($leaderboard);
    }

    public function getUserChallenges(Request $request)
    {
        $user = $request->user();
        $status = $request->get('status', 'active');
        $limit = $request->get('limit', 10);

        $query = $user->challenges()->with('creator:id,username,avatar_url');

        if ($status === 'active') {
            $query->active();
        } elseif ($status === 'completed') {
            $query->where('challenge_participants.completed_at', '!=', null);
        }

        $challenges = $query->paginate($limit);

        return response()->json($challenges);
    }
}
