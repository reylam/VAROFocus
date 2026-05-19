<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Users (dengan data sample)
        $users = [
            [
                'id' => '019e3b5c-351c-7348-82fb-3b6b1a543f89',
                'username' => 'reysi_13',
                'email' => 'reynaldolamhot@gmail.com',
                'password_hash' => bcrypt('password123'),
                'auth_provider' => 'email',
                'avatar_url' => null,
                'level' => 5,
                'xp' => 1250,
                'title' => 'Focus Warrior',
                'streak_count' => 3,
                'last_active_at' => Carbon::now(),
                'settings' => json_encode(['theme' => 'dark', 'notifications' => true]),
                'remember_token' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'username' => 'focus_master',
                'email' => 'master@example.com',
                'password_hash' => bcrypt('password123'),
                'auth_provider' => 'email',
                'avatar_url' => null,
                'level' => 10,
                'xp' => 3500,
                'title' => 'Legendary Focuser',
                'streak_count' => 15,
                'last_active_at' => Carbon::now(),
                'settings' => json_encode(['theme' => 'light', 'notifications' => true]),
                'remember_token' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'username' => 'productivity_guru',
                'email' => 'guru@example.com',
                'password_hash' => bcrypt('password123'),
                'auth_provider' => 'email',
                'avatar_url' => null,
                'level' => 7,
                'xp' => 2200,
                'title' => 'Task Slayer',
                'streak_count' => 8,
                'last_active_at' => Carbon::now(),
                'settings' => json_encode(['theme' => 'dark', 'notifications' => false]),
                'remember_token' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'username' => 'study_king',
                'email' => 'king@example.com',
                'password_hash' => bcrypt('password123'),
                'auth_provider' => 'email',
                'avatar_url' => null,
                'level' => 3,
                'xp' => 800,
                'title' => 'Novice',
                'streak_count' => 2,
                'last_active_at' => Carbon::now(),
                'settings' => json_encode(['theme' => 'light', 'notifications' => true]),
                'remember_token' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'username' => 'pomodoro_champ',
                'email' => 'champ@example.com',
                'password_hash' => bcrypt('password123'),
                'auth_provider' => 'email',
                'avatar_url' => null,
                'level' => 8,
                'xp' => 2800,
                'title' => 'Pomodoro Legend',
                'streak_count' => 12,
                'last_active_at' => Carbon::now(),
                'settings' => json_encode(['theme' => 'dark', 'notifications' => true]),
                'remember_token' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('users')->insert($users);

        // 2. Badges
        $badges = [
            [
                'id' => Str::uuid(),
                'name' => 'Task Master',
                'description' => 'Complete 100 tasks',
                'icon' => '🏆',
                'rarity' => 'rare',
                'created_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Pomodoro Pro',
                'description' => 'Complete 50 pomodoro sessions',
                'icon' => '🍅',
                'rarity' => 'epic',
                'created_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Streak Warrior',
                'description' => 'Maintain 30-day streak',
                'icon' => '🔥',
                'rarity' => 'legendary',
                'created_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Early Bird',
                'description' => 'Complete 10 tasks before 9 AM',
                'icon' => '🌅',
                'rarity' => 'common',
                'created_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Focus God',
                'description' => 'Reach level 50',
                'icon' => '⭐',
                'rarity' => 'mythic',
                'created_at' => Carbon::now(),
            ],
        ];

        DB::table('badges')->insert($badges);

        // 3. Achievements
        $achievements = [
            [
                'id' => Str::uuid(),
                'name' => 'First Blood',
                'description' => 'Complete your first task',
                'icon' => '🎯',
                'condition_type' => 'tasks_completed',
                'condition_value' => 1,
                'xp_reward' => 50,
                'badge_id' => null,
                'created_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Task Annihilator',
                'description' => 'Complete 100 tasks',
                'icon' => '💪',
                'condition_type' => 'tasks_completed',
                'condition_value' => 100,
                'xp_reward' => 500,
                'badge_id' => $badges[0]['id'],
                'created_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Pomodoro Warrior',
                'description' => 'Complete 50 pomodoro sessions',
                'icon' => '🍅',
                'condition_type' => 'pomodoros_completed',
                'condition_value' => 50,
                'xp_reward' => 1000,
                'badge_id' => $badges[1]['id'],
                'created_at' => Carbon::now(),
            ],
        ];

        DB::table('achievements')->insert($achievements);

        // 4. Categories
        $categories = [];
        foreach ($users as $user) {
            $categories[] = [
                'id' => Str::uuid(),
                'user_id' => $user['id'],
                'name' => 'Work',
                'icon' => '💼',
                'color' => '#3B82F6',
                'is_default' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
            $categories[] = [
                'id' => Str::uuid(),
                'user_id' => $user['id'],
                'name' => 'Study',
                'icon' => '📚',
                'color' => '#10B981',
                'is_default' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
            $categories[] = [
                'id' => Str::uuid(),
                'user_id' => $user['id'],
                'name' => 'Exercise',
                'icon' => '💪',
                'color' => '#EF4444',
                'is_default' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        DB::table('categories')->insert($categories);

        // Get categories as array for later use
        $categoriesList = DB::table('categories')->get()->keyBy('id');

        // 5. Tasks
        $tasks = [];
        $difficulties = ['easy', 'medium', 'hard'];
        $statuses = ['pending', 'in_progress', 'completed'];
        $hp = [100, 200, 300];
        $xpRewards = [10, 25, 50];
        
        foreach ($users as $user) {
            // Get user's categories
            $userCategories = DB::table('categories')
                ->where('user_id', $user['id'])
                ->get();
            
            for ($i = 0; $i < 5; $i++) {
                $difficultyIndex = $i % 3;
                $categoryId = $userCategories->isNotEmpty() ? $userCategories[$i % $userCategories->count()]->id : null;
                
                $tasks[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user['id'],
                    'category_id' => $categoryId,
                    'title' => "Task {$i} for " . $user['username'],
                    'description' => "This is a sample task description for testing",
                    'difficulty' => $difficulties[$difficultyIndex],
                    'hp' => $hp[$difficultyIndex],
                    'current_hp' => $hp[$difficultyIndex],
                    'xp_reward' => $xpRewards[$difficultyIndex],
                    'due_date' => Carbon::now()->addDays(rand(1, 7)),
                    'estimated_minutes' => rand(15, 120),
                    'status' => $statuses[$i % 3],
                    'is_public' => false,
                    'priority' => rand(1, 5),
                    'completed_at' => $i % 3 === 2 ? Carbon::now()->subDays(rand(1, 5)) : null,
                    'created_at' => Carbon::now()->subDays(rand(0, 10)),
                    'updated_at' => Carbon::now(),
                ];
            }
        }
        DB::table('tasks')->insert($tasks);

        // Get tasks for later use
        $tasksList = DB::table('tasks')->get();

        // 6. Leaderboards (sudah ada)
        $leaderboards = [
            [
                'id' => 'a48c734b-536a-11f1-a327-1413338b6400',
                'type' => 'global',
                'category' => 'xp',
                'season_start' => Carbon::now(),
                'season_end' => Carbon::now()->addDays(30),
                'is_active' => true,
                'created_at' => Carbon::now(),
            ],
            [
                'id' => 'a4989c4a-536a-11f1-a327-1413338b6400',
                'type' => 'weekly',
                'category' => 'xp',
                'season_start' => Carbon::now(),
                'season_end' => Carbon::now()->addDays(7),
                'is_active' => true,
                'created_at' => Carbon::now(),
            ],
            [
                'id' => 'a49d82f9-536a-11f1-a327-1413338b6400',
                'type' => 'monthly',
                'category' => 'xp',
                'season_start' => Carbon::now(),
                'season_end' => Carbon::now()->addDays(30),
                'is_active' => true,
                'created_at' => Carbon::now(),
            ],
        ];
        DB::table('leaderboards')->insert($leaderboards);

        // 7. Leaderboard Entries
        $leaderboardEntries = [];
        $sortedUsers = collect($users)->sortByDesc('xp')->values();
        
        foreach ($leaderboards as $leaderboard) {
            foreach ($sortedUsers as $rank => $user) {
                $leaderboardEntries[] = [
                    'id' => Str::uuid(),
                    'leaderboard_id' => $leaderboard['id'],
                    'user_id' => $user['id'],
                    'score' => $user['xp'],
                    'rank' => $rank + 1,
                    'updated_at' => Carbon::now(),
                ];
            }
        }
        DB::table('leaderboard_entries')->insert($leaderboardEntries);

        // 8. Pomodoro Sessions
        $pomodoroSessions = [];
        $pomodoroStatuses = ['pending', 'in_progress', 'completed'];
        
        foreach ($users as $user) {
            for ($i = 0; $i < 10; $i++) {
                $status = $pomodoroStatuses[rand(0, 2)];
                $startedAt = Carbon::now()->subDays(rand(0, 30));
                $taskId = $tasksList->isNotEmpty() ? $tasksList[rand(0, $tasksList->count() - 1)]->id : null;
                
                $pomodoroSessions[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user['id'],
                    'task_id' => $taskId,
                    'duration_minutes' => 25,
                    'break_minutes' => 5,
                    'status' => $status,
                    'started_at' => $status !== 'pending' ? $startedAt : null,
                    'ended_at' => $status === 'completed' ? $startedAt->copy()->addMinutes(25) : null,
                    'completed_pomodoros' => $status === 'completed' ? 1 : 0,
                    'created_at' => Carbon::now()->subDays(rand(0, 30)),
                ];
            }
        }
        DB::table('pomodoro_sessions')->insert($pomodoroSessions);

        // 9. Pomodoro Streaks
        $pomodoroStreaks = [];
        foreach ($users as $user) {
            $pomodoroStreaks[] = [
                'id' => Str::uuid(),
                'user_id' => $user['id'],
                'current_streak' => rand(0, 15),
                'max_streak' => rand(5, 30),
                'last_session_at' => Carbon::now()->subDays(rand(0, 3)),
                'updated_at' => Carbon::now(),
            ];
        }
        DB::table('pomodoro_streaks')->insert($pomodoroStreaks);

        // 10. Daily Rewards
        $dailyRewards = [];
        foreach ($users as $user) {
            $dailyRewards[] = [
                'id' => Str::uuid(),
                'user_id' => $user['id'],
                'last_claimed_at' => Carbon::now()->subDays(rand(0, 2)),
                'streak' => rand(0, 10),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        DB::table('daily_rewards')->insert($dailyRewards);

        // 11. Activity Logs
        $activityLogs = [];
        $activityTypes = ['task_completed', 'pomodoro_completed', 'level_up', 'badge_earned'];
        
        foreach ($users as $user) {
            for ($i = 0; $i < 20; $i++) {
                $activityLogs[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user['id'],
                    'type' => $activityTypes[array_rand($activityTypes)],
                    'message' => "User {$user['username']} performed an action",
                    'metadata' => json_encode(['action' => 'sample_action', 'value' => rand(1, 100)]),
                    'created_at' => Carbon::now()->subHours(rand(0, 168)),
                ];
            }
        }
        DB::table('activity_logs')->insert($activityLogs);

        // 12. XP Logs
        $xpLogs = [];
        $sources = ['task_completion', 'pomodoro_completion', 'daily_reward', 'achievement'];
        
        foreach ($users as $user) {
            for ($i = 0; $i < 30; $i++) {
                $xpLogs[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user['id'],
                    'amount' => rand(10, 100),
                    'source' => $sources[array_rand($sources)],
                    'reference_id' => null,
                    'created_at' => Carbon::now()->subDays(rand(0, 30)),
                ];
            }
        }
        DB::table('xp_logs')->insert($xpLogs);

        // 13. User Achievements
        $userAchievements = [];
        foreach ($users as $user) {
            foreach ($achievements as $achievement) {
                if (rand(0, 1)) {
                    $userAchievements[] = [
                        'id' => Str::uuid(),
                        'user_id' => $user['id'],
                        'achievement_id' => $achievement['id'],
                        'unlocked_at' => Carbon::now()->subDays(rand(0, 20)),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
                }
            }
        }
        DB::table('user_achievements')->insert($userAchievements);

        // 14. User Badges
        $userBadges = [];
        foreach ($users as $user) {
            foreach ($badges as $badge) {
                if (rand(0, 1)) {
                    $userBadges[] = [
                        'id' => Str::uuid(),
                        'user_id' => $user['id'],
                        'badge_id' => $badge['id'],
                        'obtained_at' => Carbon::now()->subDays(rand(0, 20)),
                        'created_at' => Carbon::now(),
                    ];
                }
            }
        }
        DB::table('user_badges')->insert($userBadges);

        // 15. Sub Tasks
        $subTasks = [];
        foreach ($tasksList as $task) {
            for ($i = 0; $i < rand(0, 3); $i++) {
                $subTasks[] = [
                    'id' => Str::uuid(),
                    'task_id' => $task->id,
                    'title' => "Sub-task " . ($i + 1),
                    'is_completed' => (bool) rand(0, 1),
                    'order_index' => $i,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
        }
        DB::table('sub_tasks')->insert($subTasks);

        // 16. Study Rooms
        $studyRooms = [];
        foreach ($users as $index => $user) {
            $studyRooms[] = [
                'id' => Str::uuid(),
                'name' => "Study Room " . ($index + 1),
                'owner_id' => $user['id'],
                'description' => "A collaborative study space for focused learning",
                'is_private' => false,
                'max_members' => 10,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        DB::table('study_rooms')->insert($studyRooms);

        // 17. Study Room Members
        $roomMembers = [];
        $rooms = DB::table('study_rooms')->get();
        foreach ($rooms as $room) {
            foreach ($users as $user) {
                if (rand(0, 2) < 2) { // 66% chance to add member
                    $roomMembers[] = [
                        'id' => Str::uuid(),
                        'room_id' => $room->id,
                        'user_id' => $user['id'],
                        'role' => $room->owner_id === $user['id'] ? 'owner' : 'member',
                        'joined_at' => Carbon::now()->subDays(rand(0, 10)),
                        'created_at' => Carbon::now(),
                    ];
                }
            }
        }
        DB::table('study_room_members')->insert($roomMembers);

        // 18. Challenges
        $challengeTypes = ['tasks_completed', 'pomodoros_completed', 'streak_days'];
        $challenges = [];
        for ($i = 0; $i < 3; $i++) {
            $challenges[] = [
                'id' => Str::uuid(),
                'creator_id' => $users[0]['id'],
                'title' => "Challenge " . ($i + 1),
                'description' => "Complete this challenge to earn rewards",
                'challenge_type' => $challengeTypes[$i],
                'target_value' => rand(10, 50),
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(rand(7, 30)),
                'reward_xp' => rand(100, 500),
                'reward_badge_id' => $badges[$i]['id'] ?? null,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        DB::table('challenges')->insert($challenges);

        // 19. Challenge Participants
        $challengeParticipants = [];
        $challengesDb = DB::table('challenges')->get();
        foreach ($challengesDb as $challenge) {
            foreach ($users as $user) {
                if (rand(0, 1)) {
                    $challengeParticipants[] = [
                        'id' => Str::uuid(),
                        'challenge_id' => $challenge->id,
                        'user_id' => $user['id'],
                        'progress' => rand(0, $challenge->target_value),
                        'completed_at' => rand(0, 1) ? Carbon::now()->subDays(rand(0, 5)) : null,
                        'joined_at' => Carbon::now()->subDays(rand(0, 10)),
                        'created_at' => Carbon::now(),
                    ];
                }
            }
        }
        DB::table('challenge_participants')->insert($challengeParticipants);

        // 20. Monsters (for tasks)
        $monsters = [];
        $incompleteTasks = DB::table('tasks')->where('status', '!=', 'completed')->get();
        $monsterTypes = ['goblin', 'orc', 'dragon', 'slime', 'skeleton'];
        
        foreach ($incompleteTasks as $task) {
            $maxHp = rand(50, 500);
            $monsters[] = [
                'id' => Str::uuid(),
                'task_id' => $task->id,
                'type' => $monsterTypes[array_rand($monsterTypes)],
                'max_hp' => $maxHp,
                'current_hp' => rand(1, $maxHp),
                'image_url' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        DB::table('monsters')->insert($monsters);

        // 21. Monster Attacks
        $monsterAttacks = [];
        $monstersDb = DB::table('monsters')->get();
        foreach ($monstersDb as $monster) {
            for ($i = 0; $i < rand(1, 5); $i++) {
                $monsterAttacks[] = [
                    'id' => Str::uuid(),
                    'user_id' => $users[array_rand($users)]['id'],
                    'monster_id' => $monster->id,
                    'damage' => rand(10, 100),
                    'source' => 'pomodoro',
                    'created_at' => Carbon::now()->subHours(rand(0, 48)),
                ];
            }
        }
        DB::table('monster_attacks')->insert($monsterAttacks);

        // 22. Spin Rewards
        $spinRewards = [
            [
                'id' => Str::uuid(),
                'name' => '50 XP',
                'description' => 'Gain 50 experience points',
                'type' => 'xp',
                'value' => json_encode(['amount' => 50]),
                'probability' => 0.3,
                'is_active' => true,
                'created_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => '100 XP',
                'description' => 'Gain 100 experience points',
                'type' => 'xp',
                'value' => json_encode(['amount' => 100]),
                'probability' => 0.2,
                'is_active' => true,
                'created_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Rare Badge',
                'description' => 'Earn a rare badge',
                'type' => 'badge',
                'value' => json_encode(['badge_id' => $badges[0]['id']]),
                'probability' => 0.05,
                'is_active' => true,
                'created_at' => Carbon::now(),
            ],
        ];
        DB::table('spin_rewards')->insert($spinRewards);

        // 23. Calendar Events
        $calendarEvents = [];
        foreach ($users as $user) {
            for ($i = 0; $i < 5; $i++) {
                $taskId = $tasksList->isNotEmpty() ? $tasksList[rand(0, $tasksList->count() - 1)]->id : null;
                $calendarEvents[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user['id'],
                    'task_id' => $taskId,
                    'external_id' => null,
                    'title' => "Event " . ($i + 1),
                    'description' => "Sample calendar event",
                    'start_time' => Carbon::now()->addDays(rand(1, 30)),
                    'end_time' => Carbon::now()->addDays(rand(1, 30))->addHours(rand(1, 4)),
                    'provider' => 'local',
                    'sync_token' => null,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
        }
        DB::table('calendar_events')->insert($calendarEvents);

        // 24. Reminders
        $reminders = [];
        foreach ($tasksList as $task) {
            $reminders[] = [
                'id' => Str::uuid(),
                'user_id' => $task->user_id,
                'task_id' => $task->id,
                'remind_at' => Carbon::now()->addHours(rand(1, 24)),
                'type' => 'notification',
                'is_sent' => false,
                'created_at' => Carbon::now(),
            ];
        }
        DB::table('reminders')->insert($reminders);

        // 25. Schedules
        $schedules = [];
        foreach ($tasksList as $task) {
            if ($task->status !== 'completed') {
                $schedules[] = [
                    'id' => Str::uuid(),
                    'user_id' => $task->user_id,
                    'task_id' => $task->id,
                    'scheduled_start' => Carbon::now()->addDays(rand(0, 3))->setTime(rand(8, 20), 0, 0),
                    'scheduled_end' => Carbon::now()->addDays(rand(0, 3))->setTime(rand(8, 20), 0, 0)->addHours(rand(1, 4)),
                    'source' => 'manual',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
        }
        DB::table('schedules')->insert($schedules);
    }
}