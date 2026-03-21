<?php

namespace App\Http\Controllers;

use App\Models\Monster;
use Illuminate\Http\Request;

class MonsterController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 20);
        $rarity = $request->get('rarity');
        $type = $request->get('type');

        $query = Monster::query();

        if ($rarity) {
            $query->where('rarity', $rarity);
        }

        if ($type) {
            $query->where('type', $type);
        }

        $monsters = $query->paginate($limit);

        return response()->json($monsters);
    }

    public function show($id, Request $request)
    {
        $monster = Monster::findOrFail($id);

        return response()->json($monster);
    }

    public function store(Request $request)
    {
        // Admin only
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:monsters',
            'description' => 'required|string',
            'type' => 'required|in:fire,water,earth,wind,light,dark',
            'rarity' => 'required|in:common,rare,epic,legendary',
            'base_hp' => 'required|integer|min:50|max:500',
            'base_damage' => 'required|integer|min:10|max:100',
            'image_url' => 'required|url',
            'icon_url' => 'required|url',
        ]);

        $monster = Monster::create($validated);

        return response()->json([
            'message' => 'Monster created successfully',
            'data' => $monster,
        ], 201);
    }

    public function update($id, Request $request)
    {
        // Admin only
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $monster = Monster::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|unique:monsters,name,' . $id,
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:fire,water,earth,wind,light,dark',
            'rarity' => 'sometimes|in:common,rare,epic,legendary',
            'base_hp' => 'sometimes|integer|min:50|max:500',
            'base_damage' => 'sometimes|integer|min:10|max:100',
            'image_url' => 'sometimes|url',
            'icon_url' => 'sometimes|url',
        ]);

        $monster->update($validated);

        return response()->json([
            'message' => 'Monster updated successfully',
            'data' => $monster,
        ]);
    }

    public function destroy($id, Request $request)
    {
        // Admin only
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $monster = Monster::findOrFail($id);

        $monster->delete();

        return response()->json([
            'message' => 'Monster deleted successfully',
        ]);
    }

    public function getByRarity($rarity, Request $request)
    {
        $monsters = Monster::where('rarity', $rarity)
            ->paginate($request->get('limit', 20));

        return response()->json($monsters);
    }

    public function getByType($type, Request $request)
    {
        $monsters = Monster::where('type', $type)
            ->paginate($request->get('limit', 20));

        return response()->json($monsters);
    }

    public function getRarityStats(Request $request)
    {
        $stats = [];
        $rarities = ['common', 'rare', 'epic', 'legendary'];

        foreach ($rarities as $rarity) {
            $stats[$rarity] = Monster::where('rarity', $rarity)->count();
        }

        return response()->json($stats);
    }

    public function getTypeStats(Request $request)
    {
        $stats = [];
        $types = ['fire', 'water', 'earth', 'wind', 'light', 'dark'];

        foreach ($types as $type) {
            $stats[$type] = Monster::where('type', $type)->count();
        }

        return response()->json($stats);
    }
}
