<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeParticipant extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'challenge_participants';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'challenge_id',
        'user_id',
        'progress',
        'completed_at',
        'joined_at',
    ];

    protected $casts = [
        'progress' => 'integer',
        'completed_at' => 'datetime',
        'joined_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }

    public function scopeIncomplete($query)
    {
        return $query->whereNull('completed_at');
    }

    public function scopeByChallenge($query, $challengeId)
    {
        return $query->where('challenge_id', $challengeId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOrderByProgress($query)
    {
        return $query->orderBy('progress', 'desc');
    }

    public function getProgressPercentage()
    {
        return min(100, ($this->progress / $this->challenge->target_value) * 100);
    }

    public function isCompleted()
    {
        return $this->completed_at !== null;
    }

    public function getDaysElapsed()
    {
        return now()->diffInDays($this->joined_at);
    }
}
