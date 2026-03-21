# VAROFocus Laravel Models Documentation

Complete Laravel Eloquent models for the VAROFocus gamified task management application.

---

## Core Entity Models

### User Model

**File:** `app/Models/User.php`

Core user model extending Authenticatable with UUID primary keys.

#### Key Methods:

- `addXp($amount)` - Add XP and auto-calculate level
- `calculateLevel()` - Calculate level based on XP using formula: floor(√(xp/100)) + 1
- `updateLastActive()` - Update last active timestamp
- `getProgressToNextLevel()` - Get XP progress percentage to next level
- `hasAchievement($achievementId)` - Check if user has achievement
- `unlockAchievement($achievementId)` - Unlock achievement
- `addBadge($badgeId)` - Add badge to user

#### Relations:

- `categories()` HasMany
- `tasks()` HasMany
- `xpLogs()` HasMany
- `achievements()` BelongsToMany
- `badges()` BelongsToMany
- `friends()` BelongsToMany (bidirectional)
- `pomodoroSessions()` HasMany
- `pomodoroStreak()` HasOne
- `activityLogs()` HasMany
- `studyRooms()` BelongsToMany
- `leaderboardEntries()` HasMany
- `challenges()` BelongsToMany
- And many more...

#### Scopes:

- `byUsername($username)`
- `byEmail($email)`
- `topByXp($limit = 10)`
- `byLevel($level)`
- `active()` - Last active in 7 days

---

### Category Model

**File:** `app/Models/Category.php`

Task categories (Math, Programming, Personal, etc.)

#### Key Methods:

- None special, basic CRUD

#### Relations:

- `user()` BelongsTo
- `tasks()` HasMany

#### Scopes:

- `default()` - Default categories
- `byUser($userId)`

---

### Task Model

**File:** `app/Models/Task.php`

Main task/monster entity in the system.

#### Key Methods:

- `complete()` - Mark task as completed, award XP, update monster
- `fail()` - Mark task as failed
- `start()` - Start task (in_progress)
- `takeDamage($damage)` - Reduce HP, complete if HP reaches 0
- `getHpPercentage()` - Get monster HP bar percentage
- `isOverdue()` - Check if task past due date
- `isDueSoon($days = 7)` - Check if due within N days
- `canStart()` - Check if all dependencies completed
- `addCheer($userId)` - Add cheer (like system)
- `getCheerCount()` - Get total cheers

#### Relations:

- `user()` BelongsTo
- `category()` BelongsTo
- `subTasks()` HasMany
- `tasksThisDependsOn()` BelongsToMany
- `tasksThatDependOnThis()` BelongsToMany
- `monster()` HasMany
- `schedules()` HasMany
- `reminders()` HasMany
- `calendarEvents()` HasMany
- `comments()` HasMany
- `cheers()` HasMany

#### Scopes:

- `byUser($userId)`
- `byStatus($status)` - pending, in_progress, completed, failed
- `pending()`, `inProgress()`, `completed()`, `failed()`
- `byDifficulty($difficulty)` - easy, medium, hard, boss
- `byPriority($priority)`
- `public()`
- `overdue()`
- `dueSoon($days = 7)`

---

### SubTask Model

**File:** `app/Models/SubTask.php`

Subtasks for breaking down larger tasks.

#### Key Methods:

- `complete()` - Mark subtask complete
- `uncomplete()` - Mark subtask incomplete
- `toggle()` - Toggle completion status

#### Relations:

- `task()` BelongsTo

---

### TaskDependency Model

**File:** `app/Models/TaskDependency.php`

Task dependency tracking (task A must complete before task B).

#### Relations:

- `task()` BelongsTo
- `dependsOnTask()` BelongsTo

---

### TaskTemplate Model

**File:** `app/Models/TaskTemplate.php`

Pre-made task templates for common tasks.

#### Key Methods:

- `createTaskFromTemplate(User $user, ?Category $category = null)` - Create task from template
- `getXpRewardByDifficulty()` - Auto-calculate XP reward
- `getHpByDifficulty()` - Auto-calculate monster HP

#### Relations:

- `category()` BelongsTo
- `creator()` BelongsTo (User)

#### Scopes:

- `system()` - System templates
- `byDifficulty($difficulty)`

---

## Social System Models

### Friend Model

**File:** `app/Models/Friend.php`

Friend relationships (one-directional record).

#### Key Methods:

- `accept()` - Accept friendship
- `block()` - Block friend
- `unblock()` - Unblock friend

#### Relations:

- `user()` BelongsTo
- `friend()` BelongsTo

#### Scopes:

- `accepted()`
- `pending()`
- `blocked()`

---

### FriendRequest Model

**File:** `app/Models/FriendRequest.php`

Friend request tracking.

#### Key Methods:

- `accept()` - Accept and create bidirectional friendships
- `reject()` - Reject friend request

#### Relations:

- `sender()` BelongsTo
- `receiver()` BelongsTo

#### Scopes:

- `pending()`
- `accepted()`
- `rejected()`

---

## Gamification System Models

### XpLog Model

**File:** `app/Models/XpLog.php`

Track all XP gains with source.

#### Relations:

- `user()` BelongsTo

#### Scopes:

- `bySource($source)` - task_complete, pomodoro, bonus, etc.
- `today()`
- `thisWeek()`
- `thisMonth()`
- `forUser($userId)`
- `orderByLatest()`

---

### Achievement Model

**File:** `app/Models/Achievement.php`

Achievement system with condition-based unlocking.

#### Key Methods:

- `checkUnlock(User $user)` - Check if user meets condition to unlock

#### Relations:

- `users()` BelongsToMany
- `badge()` BelongsTo

#### Scopes:

- `byCondition($type)` - task_count, streak, level, xp, pomodoro_count

---

### UserAchievement Model

**File:** `app/Models/UserAchievement.php`

Junction table for user achievements with unlock timestamp.

#### Relations:

- `user()` BelongsTo
- `achievement()` BelongsTo

---

### Badge Model

**File:** `app/Models/Badge.php`

Badge/reward system with rarity levels.

#### Relations:

- `users()` BelongsToMany
- `achievements()` BelongsToMany

#### Scopes:

- `byRarity($rarity)` - common, rare, epic, legendary
- `legendary()`, `epic()`, `rare()`, `common()`

---

### UserBadge Model

**File:** `app/Models/UserBadge.php`

Junction table for user badges with obtained timestamp.

#### Relations:

- `user()` BelongsTo
- `badge()` BelongsTo

---

## Monster System Models

### Monster Model

**File:** `app/Models/Monster.php`

Monster representation (1:1 with Task).

#### Key Methods:

- `takeDamage($damage)` - Reduce HP, auto-complete task if dead
- `isDead()` - Check if HP <= 0
- `getHpPercentage()` - Get HP bar percentage
- `getTotalDamageTaken()` - Sum of all damage from attacks
- `getAttackCount()` - Total number of attacks
- `heal($amount = null)` - Restore HP

#### Relations:

- `task()` BelongsTo
- `attacks()` HasMany

---

### MonsterAttack Model

**File:** `app/Models/MonsterAttack.php`

Track each attack on a monster.

#### Relations:

- `user()` BelongsTo
- `monster()` BelongsTo

#### Scopes:

- `bySource($source)` - task_complete, pomodoro
- `today()`
- `byUser($userId)`
- `byMonster($monsterId)`

---

## Pomodoro System Models

### PomodoroSession Model

**File:** `app/Models/PomodoroSession.php`

Individual pomodoro focus sessions.

#### Key Methods:

- `complete()` - Mark complete, add XP, attack monster, update streak
- `cancel()` - Cancel session
- `getDuration()` - Get session duration in minutes

#### Relations:

- `user()` BelongsTo
- `task()` BelongsTo

#### Scopes:

- `running()`, `completed()`, `cancelled()`
- `byUser($userId)`
- `today()`
- `thisWeek()`

---

### PomodoroStreak Model

**File:** `app/Models/PomodoroStreak.php`

Pomodoro streak tracking per user.

#### Key Methods:

- `incrementStreak()` - Increase streak, update max, award milestone XP
- `resetStreak()` - Reset to 0
- `getStreakBonus()` - Get XP multiplier: x2 at 50+, x1.5 at 20+, x1.2 at 10+

#### Relations:

- `user()` BelongsTo

---

## Scheduling System Models

### Schedule Model

**File:** `app/Models/Schedule.php`

Task scheduling/calendar blocking.

#### Key Methods:

- `getDuration()` - Duration between start and end
- `isStarted()` - Has start time passed
- `isCompleted()` - Has end time passed

#### Relations:

- `user()` BelongsTo
- `task()` BelongsTo

#### Scopes:

- `byUser($userId)`
- `upcoming()`
- `today()`
- `thisWeek()`

---

### Reminder Model

**File:** `app/Models/Reminder.php`

Task reminders (email, push, or both).

#### Key Methods:

- `send()` - Mark as sent (integrate with notification service)
- `isDue()` - Check if should send now

#### Relations:

- `user()` BelongsTo
- `task()` BelongsTo

#### Scopes:

- `pending()` - Not yet sent
- `sent()`
- `byType($type)` - email, push, both
- `due()` - Ready to send
- `upcoming()` - Future reminders

---

### CalendarEvent Model

**File:** `app/Models/CalendarEvent.php`

External calendar sync (Google, Apple, Outlook).

#### Key Methods:

- `getDuration()` - Duration in minutes
- `isUpcoming()`, `isOngoing()`, `isPast()`

#### Relations:

- `user()` BelongsTo
- `task()` BelongsTo

#### Scopes:

- `byUser($userId)`
- `byProvider($provider)` - google, apple, outlook
- `upcoming()`
- `today()`
- `thisMonth()`

---

## Collaboration System Models

### StudyRoom Model

**File:** `app/Models/StudyRoom.php`

Virtual study/focus rooms with members.

#### Key Methods:

- `addMember(User $user, $role = 'member')` - Add member if room not full
- `removeMember(User $user)` - Remove member (not owner)
- `isMember(User $user)` - Check membership
- `isOwner(User $user)` - Check ownership
- `getMemberCount()`
- `isFull()` - Check if at max members
- `startSession()` - Start new room session
- `getActiveSession()` - Get current active session

#### Relations:

- `owner()` BelongsTo
- `members()` BelongsToMany
- `roomMembers()` HasMany
- `sessions()` HasMany

#### Scopes:

- `public()`, `private()`
- `byOwner($userId)`
- `active()` - Has sessions

---

### StudyRoomMember Model

**File:** `app/Models/StudyRoomMember.php`

Study room membership with role.

#### Key Methods:

- `promoteToModerator()`
- `demoteToMember()`

#### Relations:

- `room()` BelongsTo
- `user()` BelongsTo

#### Scopes:

- `byRole($role)` - owner, moderator, member
- `owners()`, `moderators()`, `members()`

---

### RoomSession Model

**File:** `app/Models/RoomSession.php`

Track study session in a room.

#### Key Methods:

- `end()` - End session
- `getDuration()` - Duration in minutes
- `isActive()`

#### Relations:

- `room()` BelongsTo

#### Scopes:

- `active()`
- `completed()`

---

### ActivityLog Model

**File:** `app/Models/ActivityLog.php`

User activity feed (task_complete, level_up, join_room, etc.).

#### Key Methods:

- `static log($userId, $type, $message, $metadata = [])` - Helper to create log

#### Relations:

- `user()` BelongsTo

#### Scopes:

- `byType($type)`
- `byUser($userId)`
- `recent($days = 7)`
- `today()`, `thisWeek()`, `thisMonth()`
- `orderByLatest()`

---

## Leaderboard System Models

### Leaderboard Model

**File:** `app/Models/Leaderboard.php`

Leaderboard definition (global, weekly, monthly, daily).

#### Key Methods:

- `getTopEntries($limit = 10)` - Get top ranked entries
- `getUserRank($userId)` - Get user's rank
- `updateRanks()` - Recalculate all ranks by score
- `isActive()` - Check if active season
- `getCategoryName()` - Human readable category

#### Relations:

- `entries()` HasMany

#### Scopes:

- `global()`, `weekly()`, `monthly()`, `daily()`
- `active()`
- `byCategory($category)` - xp, tasks_completed, streak, pomodoros

---

### LeaderboardEntry Model

**File:** `app/Models/LeaderboardEntry.php`

User entry in a leaderboard.

#### Key Methods:

- `addScore($points)` - Add points and update ranks
- `subtractScore($points)` - Subtract points (minimum 0)
- `getRankBadge()` - Get emoji badge (🥇🥈🥉🎖️⭐)

#### Relations:

- `leaderboard()` BelongsTo
- `user()` BelongsTo

#### Scopes:

- `byLeaderboard($leaderboardId)`
- `byUser($userId)`
- `topRanked($limit = 10)`

---

### Challenge Model

**File:** `app/Models/Challenge.php`

User-created or system challenges.

#### Key Methods:

- `addParticipant(User $user)` - Add participant
- `removeParticipant(User $user)`
- `updateParticipantProgress($userId, $progress)` - Update progress, complete at target
- `getCompletedCount()`
- `isActive()`
- `isPast()`
- `getTopParticipants($limit = 10)`

#### Relations:

- `creator()` BelongsTo
- `rewardBadge()` BelongsTo
- `participants()` BelongsToMany
- `participantRecords()` HasMany

#### Scopes:

- `active()`
- `upcoming()`
- `ended()`
- `byType($type)` - tasks_completed, xp_gained
- `byCreator($userId)`

---

### ChallengeParticipant Model

**File:** `app/Models/ChallengeParticipant.php`

Challenge participation tracking.

#### Key Methods:

- `getProgressPercentage()` - Progress as percentage
- `isCompleted()`
- `getDaysElapsed()`

#### Relations:

- `challenge()` BelongsTo
- `user()` BelongsTo

#### Scopes:

- `completed()`, `incomplete()`
- `byChallenge($challengeId)`
- `byUser($userId)`
- `orderByProgress()`

---

## Reward System Models

### DailyReward Model

**File:** `app/Models/DailyReward.php`

Daily login reward with streak bonuses.

#### Key Methods:

- `claim()` - Claim daily reward, manage streak
- `canClaim()` - Check if able to claim today
- `resetStreak()`
- `getStreakBonus()` - Multiplier: x5 at 100+, x3 at 50+, x2 at 30+, etc.

#### Relations:

- `user()` BelongsTo

---

### SpinReward Model

**File:** `app/Models/SpinReward.php`

Spin wheel reward pool entries.

#### Key Methods:

- `getTimesClaimed()` - Count claims
- `applyReward(User $user)` - Apply reward (XP, theme, item, badge)
- `static spinWheel()` - Randomly select reward by probability

#### Relations:

- `userSpinLogs()` HasMany

#### Scopes:

- `active()`
- `byType($type)` - xp_boost, theme, item, badge

---

### UserSpinLog Model

**File:** `app/Models/UserSpinLog.php`

Spin reward history.

#### Relations:

- `user()` BelongsTo
- `reward()` BelongsTo

#### Scopes:

- `byUser($userId)`
- `byReward($rewardId)`
- `today()`, `thisWeek()`, `thisMonth()`
- `orderByLatest()`

---

## Social Interaction Models

### TaskComment Model

**File:** `app/Models/TaskComment.php`

Discussion/comments on tasks with nested replies.

#### Key Methods:

- `edit($newComment)` - Edit comment, mark as edited
- `isEdited()`
- `canBeEditedBy(User $user)` - Check owner
- `getReplyCount()`

#### Relations:

- `task()` BelongsTo
- `user()` BelongsTo
- `parentComment()` BelongsTo
- `replies()` HasMany

#### Scopes:

- `byTask($taskId)`
- `byUser($userId)`
- `topLevel()` - Root comments only
- `replies()` - Nested replies only
- `orderByLatest()`

---

### TaskCheer Model

**File:** `app/Models/TaskCheer.php`

Like/cheer system for tasks (motivational).

#### Relations:

- `task()` BelongsTo
- `user()` BelongsTo

#### Scopes:

- `byTask($taskId)`
- `byUser($userId)`
- `today()`
- `recent($days = 7)`

---

## Usage Examples

### Adding XP to User

```php
$user = User::find($userId);
$user->addXp(50); // Auto-calculates level
```

### Complete a Task

```php
$task = Task::find($taskId);
$task->complete(); // Awards XP, completes monster, logs activity
```

### Create a Challenge

```php
$challenge = Challenge::create([
    'creator_id' => auth()->id(),
    'title' => '30 Day Coding Challenge',
    'challenge_type' => 'tasks_completed',
    'target_value' => 30,
    'start_date' => now(),
    'end_date' => now()->addDays(30),
    'reward_xp' => 1000,
]);

$challenge->addParticipant($user);
```

### Pomodoro Workflow

```php
$session = PomodoroSession::create([
    'user_id' => $userId,
    'task_id' => $taskId,
    'duration_minutes' => 25,
]);

// Later...
$session->complete(); // Adds XP, attacks monster, updates streak
```

### Spin the Wheel

```php
$reward = SpinReward::spinWheel();
$reward->applyReward($user);

UserSpinLog::create([
    'user_id' => $user->id,
    'reward_id' => $reward->id,
    'obtained_at' => now(),
]);
```

### Leaderboard Operations

```php
$leaderboard = Leaderboard::where('category', 'xp')->active()->first();
$leaderboard->updateRanks();
$topUsers = $leaderboard->getTopEntries(10);
```

---

## Total Models: 30

1. User
2. Category
3. Task
4. SubTask
5. TaskDependency
6. TaskTemplate
7. Friend
8. FriendRequest
9. XpLog
10. Achievement
11. UserAchievement
12. Badge
13. UserBadge
14. Monster
15. MonsterAttack
16. PomodoroSession
17. PomodoroStreak
18. Schedule
19. Reminder
20. CalendarEvent
21. StudyRoom
22. StudyRoomMember
23. RoomSession
24. ActivityLog
25. Leaderboard
26. LeaderboardEntry
27. Challenge
28. ChallengeParticipant
29. DailyReward
30. SpinReward
31. UserSpinLog
32. TaskComment
33. TaskCheer

---

## Key Features

✅ All relationships properly defined
✅ Comprehensive scopes for filtering
✅ Helper methods for common operations
✅ Type casting for database fields
✅ UUID primary keys throughout
✅ Activity tracking and logging
✅ XP and level system
✅ Achievement unlocking
✅ Monster combat mechanics
✅ Social features (friends, comments, cheers)
✅ Gamification (streaks, leaderboards, challenges)
✅ Task management (dependencies, templates, scheduling)
✅ Pomodoro focus sessions
✅ Calendar integration support
✅ Study rooms with members
✅ Reward systems (daily, spin wheel)

---

**Ready to use!** All models are fully functional and can be used immediately in your application.
