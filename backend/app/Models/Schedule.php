<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'schedules';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'task_id',
        'scheduled_start',
        'scheduled_end',
        'source',
    ];

    protected $casts = [
        'scheduled_start' => 'datetime',
        'scheduled_end' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_start', '>=', now())
            ->orderBy('scheduled_start');
    }

    public function scopeToday($query)
    {
        return $query->where('scheduled_start', '>=', now()->startOfDay())
            ->where('scheduled_start', '<', now()->endOfDay());
    }

    public function scopeThisWeek($query)
    {
        return $query->where('scheduled_start', '>=', now()->startOfWeek())
            ->where('scheduled_start', '<', now()->endOfWeek());
    }

    public function getDuration()
    {
        if ($this->scheduled_end) {
            return $this->scheduled_end->diffInMinutes($this->scheduled_start);
        }
        return null;
    }

    public function isStarted()
    {
        return now() >= $this->scheduled_start;
    }

    public function isCompleted()
    {
        return $this->scheduled_end && now() >= $this->scheduled_end;
    }
}
