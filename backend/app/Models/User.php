<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Database\Factories\UserFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids;

    protected $table = 'users';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'username',
        'email',
        'password_hash',
        'auth_provider',
        'auth_provider_id',
        'avatar_url',
        'level',
        'xp',
        'title',
        'streak_count',
        'last_active_at',
        'settings',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'level' => 'integer',
        'xp' => 'integer',
        'streak_count' => 'integer',
        'last_active_at' => 'datetime',
        'settings' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function xpLogs(): HasMany
    {
        return $this->hasMany(XpLog::class);
    }

    public function achievements(): BelongsToMany
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }

    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'user_badges')
            ->withPivot('obtained_at');
    }

    public function sentFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    public function receivedFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }

    public function friendships(): HasMany
    {
        return $this->hasMany(Friend::class, 'user_id');
    }

    public function friends(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
            ->whereStatus('accepted')
            ->withPivot('status', 'created_at');
    }

    public function pomodoroSessions(): HasMany
    {
        return $this->hasMany(PomodoroSession::class);
    }

    public function pomodoroStreak(): HasOne
    {
        return $this->hasOne(PomodoroStreak::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    public function calendarEvents(): HasMany
    {
        return $this->hasMany(CalendarEvent::class);
    }

    public function ownedStudyRooms(): HasMany
    {
        return $this->hasMany(StudyRoom::class, 'owner_id');
    }

    public function studyRoomMemberships(): HasMany
    {
        return $this->hasMany(StudyRoomMember::class);
    }

    public function studyRooms(): BelongsToMany
    {
        return $this->belongsToMany(StudyRoom::class, 'study_room_members')
            ->withPivot('role', 'joined_at');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function monsterAttacks(): HasMany
    {
        return $this->hasMany(MonsterAttack::class);
    }

    public function leaderboardEntries(): HasMany
    {
        return $this->hasMany(LeaderboardEntry::class);
    }

    public function taskComments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    public function taskCheers(): HasMany
    {
        return $this->hasMany(TaskCheer::class);
    }

    public function spinLogs(): HasMany
    {
        return $this->hasMany(UserSpinLog::class);
    }

    public function dailyReward(): HasOne
    {
        return $this->hasOne(DailyReward::class);
    }

    public function createdChallenges(): HasMany
    {
        return $this->hasMany(Challenge::class, 'creator_id');
    }

    public function challengeParticipations(): HasMany
    {
        return $this->hasMany(ChallengeParticipant::class);
    }

    public function challenges(): BelongsToMany
    {
        return $this->belongsToMany(Challenge::class, 'challenge_participants')
            ->withPivot('progress', 'completed_at', 'joined_at');
    }

    // Scopes
    public function scopeByUsername($query, $username)
    {
        return $query->where('username', $username);
    }

    public function scopeByEmail($query, $email)
    {
        return $query->where('email', $email);
    }

    public function scopeTopByXp($query, $limit = 10)
    {
        return $query->orderBy('xp', 'desc')->limit($limit);
    }

    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    public function scopeActive($query)
    {
        return $query->where('last_active_at', '>=', now()->subDays(7));
    }

    // Methods
    public function addXp($amount)
    {
        $oldLevel = $this->level;
        $this->xp += $amount;
        $this->level = $this->calculateLevel();
        $this->save();

        // Log XP gain
        XpLog::create([
            'user_id' => $this->id,
            'amount' => $amount,
            'source' => 'manual',
        ]);

        // Check level up
        if ($oldLevel < $this->level) {
            $this->activityLogs()->create([
                'type' => 'level_up',
                'message' => "Congratulations! You reached level {$this->level}",
                'metadata' => ['new_level' => $this->level, 'old_level' => $oldLevel],
            ]);
        }

        return $this;
    }

    public function calculateLevel()
    {
        return (int) floor(sqrt($this->xp / 100)) + 1;
    }

    public function updateLastActive()
    {
        $this->update(['last_active_at' => now()]);
        return $this;
    }

    public function getProgressToNextLevel()
    {
        $currentLevelXp = ($this->level - 1) ** 2 * 100;
        $nextLevelXp = ($this->level) ** 2 * 100;
        $progressXp = $this->xp - $currentLevelXp;
        $requiredXp = $nextLevelXp - $currentLevelXp;

        return [
            'current_xp' => $progressXp,
            'required_xp' => $requiredXp,
            'percentage' => ($progressXp / $requiredXp) * 100,
        ];
    }

    public function hasAchievement($achievementId)
    {
        return $this->achievements()->where('achievement_id', $achievementId)->exists();
    }

    public function unlockAchievement($achievementId)
    {
        if (!$this->hasAchievement($achievementId)) {
            $this->achievements()->attach($achievementId, ['unlocked_at' => now()]);
            return true;
        }
        return false;
    }

    public function addBadge($badgeId)
    {
        return $this->badges()->syncWithoutDetaching([$badgeId => ['obtained_at' => now()]]);
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
