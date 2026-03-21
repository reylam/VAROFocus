<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSpinLog extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'user_spin_logs';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'reward_id',
        'obtained_at',
    ];

    protected $casts = [
        'obtained_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reward(): BelongsTo
    {
        return $this->belongsTo(SpinReward::class, 'reward_id');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByReward($query, $rewardId)
    {
        return $query->where('reward_id', $rewardId);
    }

    public function scopeToday($query)
    {
        return $query->where('obtained_at', '>=', now()->startOfDay());
    }

    public function scopeThisWeek($query)
    {
        return $query->where('obtained_at', '>=', now()->startOfWeek());
    }

    public function scopeThisMonth($query)
    {
        return $query->where('obtained_at', '>=', now()->startOfMonth());
    }

    public function scopeOrderByLatest($query)
    {
        return $query->orderBy('obtained_at', 'desc');
    }
}
