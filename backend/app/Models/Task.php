<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Task extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'tasks';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'difficulty',
        'hp',
        'current_hp',
        'xp_reward',
        'due_date',
        'estimated_minutes',
        'status',
        'is_public',
        'priority',
        'completed_at',
    ];

    protected $casts = [
        'hp' => 'integer',
        'current_hp' => 'integer',
        'xp_reward' => 'integer',
        'estimated_minutes' => 'integer',
        'priority' => 'integer',
        'is_public' => 'boolean',
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subTasks(): HasMany
    {
        return $this->hasMany(SubTask::class);
    }

    public function tasksThisDependsOn(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_dependencies', 'task_id', 'depends_on_task_id')
            ->withTimestamps();
    }

    public function tasksThatDependOnThis(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_dependencies', 'depends_on_task_id', 'task_id')
            ->withTimestamps();
    }

    public function monster(): HasMany
    {
        return $this->hasMany(Monster::class);
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

    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    public function cheers(): HasMany
    {
        return $this->hasMany(TaskCheer::class);
    }

    public function pomodoroSessions(): HasMany
    {
        return $this->hasMany(PomodoroSession::class);
    }

    // Scopes
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeByDifficulty($query, $difficulty)
    {
        return $query->where('difficulty', $difficulty);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->whereIn('status', ['pending', 'in_progress']);
    }

    public function scopeDueSoon($query, $days = 7)
    {
        return $query->whereBetween('due_date', [now(), now()->addDays($days)])
            ->whereIn('status', ['pending', 'in_progress']);
    }

    // Methods
    public function complete()
    {
        $this->status = 'completed';
        $this->completed_at = now();
        $this->current_hp = 0;
        $this->save();

        // Add XP to user
        $this->user->addXp($this->xp_reward);

        // Create activity log
        $this->user->activityLogs()->create([
            'type' => 'task_complete',
            'message' => "Completed task: {$this->title}",
            'metadata' => [
                'task_id' => $this->id,
                'xp_earned' => $this->xp_reward,
            ],
        ]);

        return $this;
    }

    public function fail()
    {
        $this->status = 'failed';
        $this->save();

        $this->user->activityLogs()->create([
            'type' => 'task_failed',
            'message' => "Failed task: {$this->title}",
            'metadata' => ['task_id' => $this->id],
        ]);

        return $this;
    }

    public function start()
    {
        $this->status = 'in_progress';
        $this->save();

        return $this;
    }

    public function takeDamage($damage)
    {
        $this->current_hp = max(0, $this->current_hp - $damage);
        if ($this->current_hp === 0 && $this->status !== 'completed') {
            $this->complete();
        }
        $this->save();

        return $this;
    }

    public function getHpPercentage()
    {
        return $this->hp > 0 ? ($this->current_hp / $this->hp) * 100 : 0;
    }

    public function isOverdue()
    {
        return $this->due_date && $this->due_date < now() && !in_array($this->status, ['completed', 'failed']);
    }

    public function isDueSoon($days = 7)
    {
        return $this->due_date &&
            $this->due_date < now()->addDays($days) &&
            $this->due_date >= now() &&
            !in_array($this->status, ['completed', 'failed']);
    }

    public function canStart()
    {
        $dependencies = $this->tasksThisDependsOn()->where('status', '!=', 'completed')->count();
        return $dependencies === 0;
    }

    public function addCheer($userId)
    {
        if (!$this->cheers()->where('user_id', $userId)->exists()) {
            TaskCheer::create([
                'task_id' => $this->id,
                'user_id' => $userId,
            ]);

            $this->user->addXp(5);
        }

        return $this;
    }

    public function getCheerCount()
    {
        return $this->cheers()->count();
    }
}
