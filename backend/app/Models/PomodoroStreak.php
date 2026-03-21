<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PomodoroStreak extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'pomodoro_streaks';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'current_streak',
        'max_streak',
        'last_session_at',
    ];

    protected $casts = [
        'current_streak' => 'integer',
        'max_streak' => 'integer',
        'last_session_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function incrementStreak()
    {
        $this->current_streak += 1;
        if ($this->current_streak > $this->max_streak) {
            $this->max_streak = $this->current_streak;
        }
        $this->last_session_at = now();
        $this->save();

        // Milestone bonuses
        if ($this->current_streak % 10 === 0) {
            $this->user->addXp(50);
        }

        return $this;
    }

    public function resetStreak()
    {
        $this->current_streak = 0;
        $this->save();
        return $this;
    }

    public function getStreakBonus()
    {
        if ($this->current_streak >= 50) {
            return 2.0;
        } elseif ($this->current_streak >= 20) {
            return 1.5;
        } elseif ($this->current_streak >= 10) {
            return 1.2;
        }
        return 1.0;
    }
}
