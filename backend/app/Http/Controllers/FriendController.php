<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;

class FriendController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);

        $friends = $user->friends()
            ->with(['pomodoroStreak', 'achievements', 'badges'])
            ->paginate($limit);

        return response()->json($friends);
    }

    public function addFriend($userId, Request $request)
    {
        $sender = $request->user();
        $receiver = User::findOrFail($userId);

        if ($sender->id === $receiver->id) {
            return response()->json([
                'message' => 'Cannot add yourself as friend',
            ], 422);
        }

        if ($sender->friends()->where('friend_id', $userId)->exists()) {
            return response()->json([
                'message' => 'Already friends',
            ], 422);
        }

        $existingRequest = FriendRequest::where('sender_id', $sender->id)
            ->where('receiver_id', $userId)
            ->first();

        if ($existingRequest) {
            return response()->json([
                'message' => 'Friend request already sent',
            ], 422);
        }

        $friendRequest = FriendRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $userId,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Friend request sent',
            'friend_request' => $friendRequest,
        ], 201);
    }

    public function removeFriend($userId, Request $request)
    {
        $user = $request->user();

        Friend::where('user_id', $user->id)
            ->where('friend_id', $userId)
            ->delete();

        Friend::where('user_id', $userId)
            ->where('friend_id', $user->id)
            ->delete();

        return response()->json([
            'message' => 'Friend removed',
        ]);
    }

    public function blockFriend($userId, Request $request)
    {
        $user = $request->user();

        Friend::where('user_id', $user->id)
            ->where('friend_id', $userId)
            ->update(['status' => 'blocked']);

        return response()->json([
            'message' => 'Friend blocked',
        ]);
    }

    public function unblockFriend($userId, Request $request)
    {
        $user = $request->user();

        Friend::where('user_id', $user->id)
            ->where('friend_id', $userId)
            ->update(['status' => 'accepted']);

        return response()->json([
            'message' => 'Friend unblocked',
        ]);
    }

    public function getBlockedFriends(Request $request)
    {
        $user = $request->user();
        $blocked = $user->friendships()->blocked()->get();

        return response()->json($blocked);
    }

    public function getFriendStats($userId, Request $request)
    {
        $friend = User::findOrFail($userId);

        $stats = [
            'level' => $friend->level,
            'xp' => $friend->xp,
            'title' => $friend->title,
            'streak_count' => $friend->streak_count,
            'completed_tasks' => $friend->tasks()->completed()->count(),
            'total_pomodoros' => $friend->pomodoroSessions()->completed()->count(),
            'achievements' => $friend->achievements()->count(),
            'badges' => $friend->badges()->count(),
            'friends_count' => $friend->friends()->count(),
        ];

        return response()->json($stats);
    }
}
