<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DailyReward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'username' => 'required|string|unique:users|min:3|max:50',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password),
            'auth_provider' => 'email',
            'level' => 1,
            'xp' => 0,
            'title' => 'Novice',
            'streak_count' => 0,
        ]);

        // Create daily reward record
        DailyReward::create(['user_id' => $user->id]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user->only(['id', 'username', 'email', 'level', 'xp', 'title']),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->only(['id', 'username', 'email', 'level', 'xp', 'title', 'avatar_url']),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['achievements', 'badges', 'pomodoroStreak', 'dailyReward']);

        return response()->json([
            'user' => $user,
            'progress_to_next_level' => $user->getProgressToNextLevel(),
        ]);
    }

    public function refreshToken(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Token refreshed successfully',
            'token' => $token,
        ]);
    }
}
