<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\Validator;\nclass CategoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $categories = $user->categories()->paginate(10);

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories')->where('user_id', $user->id),
            ],
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|regex:/^#[0-9A-F]{6}$/i',
            'is_default' => 'boolean',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $category = $user->categories()->create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();
        $category = $user->categories()->findOrFail($id);

        $taskCount = $category->tasks()->count();
        $completedCount = $category->tasks()->completed()->count();

        return response()->json([
            'category' => $category,
            'stats' => [
                'total_tasks' => $taskCount,
                'completed_tasks' => $completedCount,
            ],
        ]);
    }

    public function update($id, Request $request)
    {
        $user = $request->user();
        $category = $user->categories()->findOrFail($id);

        $validation = Validator::make($request->all(), [
            'name' => [
                'string',
                'max:100',
                Rule::unique('categories')
                    ->where('user_id', $user->id)
                    ->ignore($category->id),
            ],
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|regex:/^#[0-9A-F]{6}$/i',
            'is_default' => 'boolean',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category,
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $category = $user->categories()->findOrFail($id);

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }

    public function getDefaults(Request $request)
    {
        $defaults = Category::default()->get();

        return response()->json($defaults);
    }

    public function createDefault(Request $request)
    {
        $user = $request->user();

        $defaultCategories = [
            ['name' => 'Work', 'icon' => '💼', 'color' => '#3B82F6', 'is_default' => true],
            ['name' => 'Study', 'icon' => '📚', 'color' => '#10B981', 'is_default' => true],
            ['name' => 'Personal', 'icon' => '✨', 'color' => '#F59E0B', 'is_default' => true],
            ['name' => 'Health', 'icon' => '💪', 'color' => '#EF4444', 'is_default' => true],
        ];

        $created = [];
        foreach ($defaultCategories as $cat) {
            $cat['user_id'] = $user->id;
            $created[] = Category::firstOrCreate(
                ['user_id' => $user->id, 'name' => $cat['name']],
                $cat
            );
        }

        return response()->json([
            'message' => 'Default categories created',
            'categories' => $created,
        ], 201);
    }
}
