<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use Illuminate\Http\Request;

class FriendRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $type = $request->get('type', 'received'); // received, sent

        if ($type === 'received') {
            $requests = $user->receivedFriendRequests()
                ->where('status', 'pending')
                ->with('sender:id,username,avatar_url,level')
                ->paginate(20);
        } else {
            $requests = $user->sentFriendRequests()
                ->where('status', 'pending')
                ->with('receiver:id,username,avatar_url,level')
                ->paginate(20);
        }

        return response()->json($requests);
    }

    public function accept($requestId, Request $request)
    {
        $user = $request->user();
        $friendRequest = $user->receivedFriendRequests()->findOrFail($requestId);

        if ($friendRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Request already processed',
            ], 422);
        }

        $friendRequest->accept();

        return response()->json([
            'message' => 'Friend request accepted',
            'friend_request' => $friendRequest,
        ]);
    }

    public function reject($requestId, Request $request)
    {
        $user = $request->user();
        $friendRequest = $user->receivedFriendRequests()->findOrFail($requestId);

        if ($friendRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Request already processed',
            ], 422);
        }

        $friendRequest->reject();

        return response()->json([
            'message' => 'Friend request rejected',
        ]);
    }

    public function getPendingCount(Request $request)
    {
        $user = $request->user();
        $count = $user->receivedFriendRequests()->where('status', 'pending')->count();

        return response()->json([
            'pending_count' => $count,
        ]);
    }
}
