<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SpinReward extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'spin_rewards';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'description',
        'type',
        'value',
        'probability',
        'is_active',
    ];

    protected $casts = [
        'value' => 'json',
        'probability' => 'float',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function userSpinLogs(): HasMany
    {
        return $this->hasMany(UserSpinLog::class, 'reward_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function getTimesClaimed()
    {
        return $this->userSpinLogs()->count();
    }

    public function applyReward(User $user)
    {
        return match ($this->type) {
            'xp_boost' => $user->addXp($this->value['amount'] ?? 50),
            'theme' => $user->update(['settings' => array_merge($user->settings ?? [], ['theme' => $this->value['theme_id']])]),
            'item' => $user->update(['settings' => array_merge($user->settings ?? [], ['items' => [$this->value['item_id']]])]),
            'badge' => $user->addBadge($this->value['badge_id'] ?? null),
            default => false,
        };
    }

    public static function spinWheel()
    {
        $rewards = static::active()->get();
        $totalProbability = $rewards->sum('probability');

        $random = mt_rand() / mt_getrandmax() * $totalProbability;
        $cumulative = 0;

        foreach ($rewards as $reward) {
            $cumulative += $reward->probability;
            if ($random <= $cumulative) {
                return $reward;
            }
        }

        return $rewards->last();
    }
}
