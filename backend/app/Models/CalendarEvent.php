<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalendarEvent extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'calendar_events';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'task_id',
        'external_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'provider',
        'sync_token',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
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

    public function scopeByProvider($query, $provider)
    {
        return $query->where('provider', $provider);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>=', now())
            ->orderBy('start_time');
    }

    public function scopeToday($query)
    {
        return $query->where('start_time', '>=', now()->startOfDay())
            ->where('start_time', '<', now()->endOfDay());
    }

    public function scopeThisMonth($query)
    {
        return $query->where('start_time', '>=', now()->startOfMonth())
            ->where('start_time', '<', now()->endOfMonth());
    }

    public function getDuration()
    {
        return $this->end_time->diffInMinutes($this->start_time);
    }

    public function isUpcoming()
    {
        return $this->start_time > now();
    }

    public function isOngoing()
    {
        return $this->start_time <= now() && $this->end_time >= now();
    }

    public function isPast()
    {
        return $this->end_time < now();
    }
}
