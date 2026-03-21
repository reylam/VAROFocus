<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Leaderboard extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'leaderboards';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'type',
        'category',
        'season_start',
        'season_end',
        'is_active',
    ];

    protected $casts = [
        'season_start' => 'datetime',
        'season_end' => 'datetime',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function entries(): HasMany
    {
        return $this->hasMany(LeaderboardEntry::class);
    }

    public function scopeGlobal($query)
    {
        return $query->where('type', 'global');
    }

    public function scopeWeekly($query)
    {
        return $query->where('type', 'weekly');
    }

    public function scopeMonthly($query)
    {
        return $query->where('type', 'monthly');
    }

    public function scopeDaily($query)
    {
        return $query->where('type', 'daily');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function getTopEntries($limit = 10)
    {
        return $this->entries()
            ->orderBy('rank')
            ->limit($limit)
            ->get();
    }

    public function getUserRank($userId)
    {
        return $this->entries()
            ->where('user_id', $userId)
            ->first()?->rank;
    }

    public function updateRanks()
    {
        $entries = $this->entries()
            ->orderBy('score', 'desc')
            ->get();

        foreach ($entries as $index => $entry) {
            $entry->update(['rank' => $index + 1]);
        }

        return $this;
    }

    public function isActive()
    {
        return $this->is_active && $this->season_end > now();
    }

    public function getCategoryName()
    {
        return match ($this->category) {
            'xp' => 'Experience Points',
            'tasks_completed' => 'Tasks Completed',
            'streak' => 'Streak',
            'pomodoros' => 'Pomodoros',
            default => $this->category,
        };
    }
}
