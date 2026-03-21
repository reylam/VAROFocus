<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyReward extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'daily_rewards';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'last_claimed_at',
        'streak',
    ];

    protected $casts = [
        'last_claimed_at' => 'datetime',
        'streak' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function claim()
    {
        $yesterday = now()->subDay()->startOfDay();

        if ($this->last_claimed_at && $this->last_claimed_at->startOfDay()->eq($yesterday)) {
            $this->streak += 1;
        } elseif (!$this->last_claimed_at || $this->last_claimed_at->startOfDay()->lt($yesterday)) {
            $this->streak = 1;
        }

        $this->last_claimed_at = now();
        $this->save();

        // Award XP based on streak
        $xp = 10 + ($this->streak * 5);
        $this->user->addXp($xp);

        return $this;
    }

    public function canClaim()
    {
        if (!$this->last_claimed_at) {
            return true;
        }

        return !$this->last_claimed_at->startOfDay()->eq(now()->startOfDay());
    }

    public function resetStreak()
    {
        $this->streak = 0;
        $this->save();
        return $this;
    }

    public function getStreakBonus()
    {
        return match (true) {
            $this->streak >= 100 => 5.0,
            $this->streak >= 50 => 3.0,
            $this->streak >= 30 => 2.0,
            $this->streak >= 14 => 1.5,
            $this->streak >= 7 => 1.2,
            default => 1.0,
        };
    }
}
