<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Challenge extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'challenges';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'creator_id',
        'title',
        'description',
        'challenge_type',
        'target_value',
        'start_date',
        'end_date',
        'reward_xp',
        'reward_badge_id',
        'is_active',
    ];

    protected $casts = [
        'target_value' => 'integer',
        'reward_xp' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function rewardBadge(): BelongsTo
    {
        return $this->belongsTo(Badge::class, 'reward_badge_id');
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'challenge_participants')
            ->withPivot('progress', 'completed_at', 'joined_at');
    }

    public function participantRecords(): HasMany
    {
        return $this->hasMany(ChallengeParticipant::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now());
    }

    public function scopeEnded($query)
    {
        return $query->where('end_date', '<', now());
    }

    public function scopeByType($query, $type)
    {
        return $query->where('challenge_type', $type);
    }

    public function scopeByCreator($query, $userId)
    {
        return $query->where('creator_id', $userId);
    }

    public function addParticipant(User $user)
    {
        if (!$this->participants()->where('user_id', $user->id)->exists()) {
            $this->participants()->attach($user->id, [
                'progress' => 0,
                'joined_at' => now(),
            ]);
            return true;
        }
        return false;
    }

    public function removeParticipant(User $user)
    {
        return $this->participants()->detach($user->id);
    }

    public function updateParticipantProgress($userId, $progress)
    {
        $participant = $this->participantRecords()
            ->where('user_id', $userId)
            ->first();

        if ($participant) {
            if ($progress >= $this->target_value && !$participant->completed_at) {
                $participant->update([
                    'progress' => $progress,
                    'completed_at' => now(),
                ]);

                // Award XP and badge
                $user = User::find($userId);
                $user->addXp($this->reward_xp);
                if ($this->rewardBadge()) {
                    $user->addBadge($this->reward_badge_id);
                }
            } else {
                $participant->update(['progress' => $progress]);
            }
        }

        return $participant;
    }

    public function getCompletedCount()
    {
        return $this->participantRecords()->whereNotNull('completed_at')->count();
    }

    public function isActive()
    {
        return $this->is_active && $this->start_date <= now() && $this->end_date >= now();
    }

    public function isPast()
    {
        return $this->end_date < now();
    }

    public function getTopParticipants($limit = 10)
    {
        return $this->participantRecords()
            ->orderBy('progress', 'desc')
            ->limit($limit)
            ->get();
    }
}
