<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Monster;
use App\Models\MonsterAttack;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;\nclass TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $status = $request->get('status');
        $difficulty = $request->get('difficulty');
        $category_id = $request->get('category_id');
        $limit = $request->get('limit', 15);

        $query = $user->tasks()->with(['category', 'subTasks', 'monster', 'cheers']);

        if ($status) {
            $query->byStatus($status);
        }

        if ($difficulty) {
            $query->byDifficulty($difficulty);
        }

        if ($category_id) {
            $query->where('category_id', $category_id);
        }

        $tasks = $query->orderBy('created_at', 'desc')->paginate($limit);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'difficulty' => 'in:easy,medium,hard,boss|default:medium',
            'due_date' => 'nullable|date_format:Y-m-d H:i:s',
            'estimated_minutes' => 'nullable|integer|min:1',
            'priority' => 'integer|between:0,5|default:0',
            'is_public' => 'boolean|default:false',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        // Set HP and XP based on difficulty
        $difficultyMap = [
            'easy' => ['hp' => 50, 'xp' => 25],
            'medium' => ['hp' => 100, 'xp' => 50],
            'hard' => ['hp' => 200, 'xp' => 100],
            'boss' => ['hp' => 500, 'xp' => 250],
        ];

        $difficulty = $validated['difficulty'] ?? 'medium';
        $stats = $difficultyMap[$difficulty];

        $task = $user->tasks()->create([
            ...$validated,
            'hp' => $stats['hp'],
            'current_hp' => $stats['hp'],
            'xp_reward' => $stats['xp'],
            'status' => 'pending',
        ]);

        // Create associated monster
        $monsterTypes = ['slime', 'goblin', 'orc', 'dragon', 'phantom', 'skeleton'];
        Monster::create([
            'task_id' => $task->id,
            'type' => $monsterTypes[array_rand($monsterTypes)],
            'max_hp' => $stats['hp'],
            'current_hp' => $stats['hp'],
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task->load(['category', 'monster']),
        ], 201);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()
            ->with(['category', 'subTasks', 'monster', 'cheers', 'comments', 'schedules', 'reminders'])
            ->findOrFail($id);

        $stats = [
            'cheer_count' => $task->cheers()->count(),
            'comment_count' => $task->comments()->topLevel()->count(),
            'can_start' => $task->canStart(),
            'is_overdue' => $task->isOverdue(),
            'is_due_soon' => $task->isDueSoon(),
        ];

        return response()->json([
            'task' => $task,
            'stats' => $stats,
        ]);
    }

    public function update($id, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($id);

        $validation = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'difficulty' => 'in:easy,medium,hard,boss',
            'due_date' => 'nullable|date_format:Y-m-d H:i:s',
            'estimated_minutes' => 'nullable|integer|min:1',
            'priority' => 'integer|between:0,5',
            'status' => 'in:pending,in_progress,completed,failed',
            'is_public' => 'boolean',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $task->update($validated);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task,
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($id);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }

    public function start($id, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($id);

        if (!$task->canStart()) {
            return response()->json([
                'message' => 'Cannot start task: dependencies not completed',
            ], 422);
        }

        $task->start();

        return response()->json([
            'message' => 'Task started',
            'task' => $task,
        ]);
    }

    public function complete($id, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($id);

        $task->complete();

        ActivityLog::log($user->id, 'task_complete', "Completed task: {$task->title}", [
            'task_id' => $task->id,
            'xp_earned' => $task->xp_reward,
        ]);

        return response()->json([
            'message' => 'Task completed successfully',
            'task' => $task,
            'xp_earned' => $task->xp_reward,
        ]);
    }

    public function fail($id, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($id);

        $task->fail();

        return response()->json([
            'message' => 'Task marked as failed',
            'task' => $task,
        ]);
    }

    public function attackMonster($id, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($id);

        $validation = Validator::make($request->all(), [
            'damage' => 'required|integer|min:1|max:500',
            'source' => 'required|string|in:pomodoro,manual,skill',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        if (!$task->monster) {
            return response()->json([
                'message' => 'Task has no associated monster',
            ], 422);
        }

        $monster = $task->monster;
        $attack = MonsterAttack::create([
            'user_id' => $user->id,
            'monster_id' => $monster->id,
            'damage' => $validated['damage'],
            'source' => $validated['source'],
        ]);

        $monster->takeDamage($validated['damage']);

        $response = [
            'message' => 'Attack successful',
            'attack' => $attack,
            'monster_hp' => $monster->current_hp,
            'monster_hp_percentage' => $monster->getHpPercentage(),
            'is_dead' => $monster->isDead(),
        ];

        if ($monster->isDead()) {
            $response['message'] = 'Monster defeated!';
            $response['xp_earned'] = $task->xp_reward;
            $response['task_completed'] = true;
        }

        return response()->json($response);
    }

    public function addCheer($id, Request $request)
    {
        $user = $request->user();
        $task = $user->tasks()->findOrFail($id);

        if ($task->cheers()->where('user_id', auth()->id())->exists()) {
            return response()->json([
                'message' => 'You already cheered this task',
            ], 422);
        }

        $task->addCheer(auth()->id());

        return response()->json([
            'message' => 'Cheer added',
            'cheer_count' => $task->getCheerCount(),
        ]);
    }

    public function getOverdue(Request $request)
    {
        $user = $request->user();
        $tasks = $user->tasks()->overdue()->get();

        return response()->json($tasks);
    }

    public function getDueSoon(Request $request)
    {
        $user = $request->user();
        $days = $request->get('days', 7);
        $tasks = $user->tasks()->dueSoon($days)->get();

        return response()->json($tasks);
    }

    public function getPublicTasks(Request $request)
    {
        $limit = $request->get('limit', 20);

        $tasks = Task::public()
            ->with(['user:id,username,avatar_url', 'category', 'cheers'])
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json($tasks);
    }
}
