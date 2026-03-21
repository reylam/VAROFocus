<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskCheer;
use Illuminate\Http\Request;

class TaskCheerController extends Controller
{
    public function store($taskId, Request $request)
    {
        $user = $request->user();
        $task = Task::findOrFail($taskId);

        if ($task->cheers()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'You already cheered this task',
            ], 422);
        }

        $task->addCheer($user->id);

        return response()->json([
            'message' => 'Cheer added successfully',
            'total_cheers' => $task->getCheerCount(),
        ], 201);
    }

    public function destroy($taskId, Request $request)
    {
        $user = $request->user();
        $task = Task::findOrFail($taskId);

        $task->cheers()
            ->where('user_id', $user->id)
            ->delete();

        return response()->json([
            'message' => 'Cheer removed',
            'total_cheers' => $task->getCheerCount(),
        ]);
    }

    public function getCheers($taskId, Request $request)
    {
        $task = Task::findOrFail($taskId);
        $limit = $request->get('limit', 20);

        $cheers = $task->cheers()
            ->with('user:id,username,avatar_url')
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json($cheers);
    }

    public function hasCheer($taskId, Request $request)
    {
        $user = $request->user();
        $task = Task::findOrFail($taskId);

        $hasCheer = $task->cheers()->where('user_id', $user->id)->exists();

        return response()->json([
            'has_cheer' => $hasCheer,
        ]);
    }
}
