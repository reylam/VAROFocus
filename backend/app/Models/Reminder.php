<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'reminders';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'task_id',
        'remind_at',
        'type',
        'is_sent',
    ];

    protected $casts = [
        'remind_at' => 'datetime',
        'is_sent' => 'boolean',
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

    public function scopePending($query)
    {
        return $query->where('is_sent', false);
    }

    public function scopeSent($query)
    {
        return $query->where('is_sent', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeDue($query)
    {
        return $query->where('remind_at', '<=', now())
            ->where('is_sent', false);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('remind_at', '>', now());
    }

    public function send()
    {
        $this->is_sent = true;
        $this->save();

        // TODO: Implement actual notification sending
        // Send via email, push notification, or both based on type

        return $this;
    }

    public function isDue()
    {
        return !$this->is_sent && $this->remind_at <= now();
    }
}
