<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Achievement extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'achievements';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'condition_type',
        'condition_value',
        'xp_reward',
        'badge_id',
    ];

    protected $casts = [
        'condition_value' => 'integer',
        'xp_reward' => 'integer',
        'created_at' => 'datetime',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }

    public function badge(): BelongsTo
    {
        return $this->belongsTo(Badge::class);
    }

    public function scopeByCondition($query, $type)
    {
        return $query->where('condition_type', $type);
    }

    public function checkUnlock(User $user)
    {
        $condition = match ($this->condition_type) {
            'task_count' => $user->tasks()->where('status', 'completed')->count(),
            'streak' => $user->streak_count,
            'level' => $user->level,
            'xp' => $user->xp,
            'pomodoro_count' => $user->pomodoroSessions()->where('status', 'completed')->count(),
            default => 0,
        };

        if ($condition >= $this->condition_value) {
            $user->unlockAchievement($this->id);
            return true;
        }

        return false;
    }
}
