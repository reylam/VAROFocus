<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PomodoroSession extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'pomodoro_sessions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'task_id',
        'duration_minutes',
        'break_minutes',
        'status',
        'started_at',
        'ended_at',
        'completed_pomodoros',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'break_minutes' => 'integer',
        'completed_pomodoros' => 'integer',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function scopeRunning($query)
    {
        return $query->where('status', 'running');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeToday($query)
    {
        return $query->where('started_at', '>=', now()->startOfDay());
    }

    public function scopeThisWeek($query)
    {
        return $query->where('started_at', '>=', now()->startOfWeek());
    }

    public function complete()
    {
        $this->status = 'completed';
        $this->ended_at = now();
        $this->completed_pomodoros += 1;
        $this->save();

        // Add XP to user
        $this->user->addXp(25);

        // Update pomodoro streak
        $streak = $this->user->pomodoroStreak ?? PomodoroStreak::create(['user_id' => $this->user_id]);
        $streak->incrementStreak();

        // Attack monster if task has one
        if ($this->task && $this->task->monster) {
            MonsterAttack::create([
                'user_id' => $this->user_id,
                'monster_id' => $this->task->monster->id,
                'damage' => 10,
                'source' => 'pomodoro',
            ]);
            $this->task->monster->takeDamage(10);
        }

        return $this;
    }

    public function cancel()
    {
        $this->status = 'cancelled';
        $this->save();
        return $this;
    }

    public function getDuration()
    {
        if ($this->ended_at) {
            return $this->ended_at->diffInMinutes($this->started_at);
        }
        return now()->diffInMinutes($this->started_at);
    }
}
