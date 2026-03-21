<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaderboardEntry extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'leaderboard_entries';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'leaderboard_id',
        'user_id',
        'score',
        'rank',
    ];

    protected $casts = [
        'score' => 'integer',
        'rank' => 'integer',
        'updated_at' => 'datetime',
    ];

    public function leaderboard(): BelongsTo
    {
        return $this->belongsTo(Leaderboard::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByLeaderboard($query, $leaderboardId)
    {
        return $query->where('leaderboard_id', $leaderboardId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeTopRanked($query, $limit = 10)
    {
        return $query->orderBy('rank')->limit($limit);
    }

    public function addScore($points)
    {
        $this->score += $points;
        $this->save();
        $this->leaderboard->updateRanks();
        return $this;
    }

    public function subtractScore($points)
    {
        $this->score = max(0, $this->score - $points);
        $this->save();
        $this->leaderboard->updateRanks();
        return $this;
    }

    public function getRankBadge()
    {
        return match (true) {
            $this->rank <= 3 => ['🥇', '🥈', '🥉'][$this->rank - 1] ?? '🏅',
            $this->rank <= 10 => '🎖️',
            $this->rank <= 50 => '⭐',
            default => '',
        };
    }
}
