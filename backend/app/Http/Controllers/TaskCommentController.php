<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    public function index($taskId, Request $request)
    {
        $limit = $request->get('limit', 20);

        $task = Task::findOrFail($taskId);
        $comments = $task->comments()
            ->topLevel()
            ->with(['user:id,username,avatar_url', 'replies.user:id,username,avatar_url'])
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json($comments);
    }

    public function store($taskId, Request $request)
    {
        $user = $request->user();
        $task = Task::findOrFail($taskId);

        $validated = $request->validate([
            'comment' => 'required|string|max:5000',
            'parent_comment_id' => 'nullable|exists:task_comments,id',
        ]);

        $comment = $task->comments()->create([
            'user_id' => $user->id,
            'comment' => $validated['comment'],
            'parent_comment_id' => $validated['parent_comment_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => $comment->load('user:id,username,avatar_url'),
        ], 201);
    }

    public function update($taskId, $commentId, Request $request)
    {
        $user = $request->user();
        $task = Task::findOrFail($taskId);
        $comment = $task->comments()->findOrFail($commentId);

        if (!$comment->canBeEditedBy($user)) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:5000',
        ]);

        $comment->edit($validated['comment']);

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment,
        ]);
    }

    public function destroy($taskId, $commentId, Request $request)
    {
        $user = $request->user();
        $task = Task::findOrFail($taskId);
        $comment = $task->comments()->findOrFail($commentId);

        if (!$comment->canBeEditedBy($user)) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }

    public function getReplies($taskId, $commentId, Request $request)
    {
        $limit = $request->get('limit', 10);
        $task = Task::findOrFail($taskId);
        $comment = $task->comments()->findOrFail($commentId);

        $replies = $comment->replies()
            ->with('user:id,username,avatar_url')
            ->orderBy('created_at', 'asc')
            ->paginate($limit);

        return response()->json($replies);
    }
}
