<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\SubTask;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
class SubTaskController extends Controller
{
    public function index($taskId, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($taskId);

        $subTasks = $task->subTasks()
            ->orderBy('order_index')
            ->get();

        return response()->json($subTasks);
    }

    public function store($taskId, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($taskId);

        $validation = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'order_index' => 'nullable|integer',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $orderIndex = $validated['order_index'] ?? $task->subTasks()->count();

        $subTask = $task->subTasks()->create([
            'title' => $validated['title'],
            'order_index' => $orderIndex,
            'is_completed' => false,
        ]);

        return response()->json([
            'message' => 'Sub-task created successfully',
            'sub_task' => $subTask,
        ], 201);
    }

    public function update($taskId, $subTaskId, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($taskId);
        $subTask = $task->subTasks()->findOrFail($subTaskId);

        $validation = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'is_completed' => 'boolean',
            'order_index' => 'integer',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $subTask->update($validated);

        return response()->json([
            'message' => 'Sub-task updated successfully',
            'sub_task' => $subTask,
        ]);
    }

    public function toggle($taskId, $subTaskId, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($taskId);
        $subTask = $task->subTasks()->findOrFail($subTaskId);

        $subTask->toggle();

        return response()->json([
            'message' => 'Sub-task toggled',
            'sub_task' => $subTask,
            'is_completed' => $subTask->is_completed,
        ]);
    }

    public function destroy($taskId, $subTaskId, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($taskId);
        $subTask = $task->subTasks()->findOrFail($subTaskId);

        $subTask->delete();

        return response()->json([
            'message' => 'Sub-task deleted successfully',
        ]);
    }

    public function reorder($taskId, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($taskId);

        $validation = Validator::make($request->all(), [
            'sub_tasks' => 'required|array',
            'sub_tasks.*.id' => 'required|string',
            'sub_tasks.*.order_index' => 'required|integer',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        foreach ($validated['sub_tasks'] as $item) {
            $task->subTasks()
                ->where('id', $item['id'])
                ->update(['order_index' => $item['order_index']]);
        }

        return response()->json([
            'message' => 'Sub-tasks reordered successfully',
        ]);
    }
}
