<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskTemplate extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'task_templates';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'title',
        'description',
        'default_category_id',
        'default_estimated_minutes',
        'difficulty',
        'is_system',
        'created_by',
    ];

    protected $casts = [
        'is_system' => 'boolean',
        'default_estimated_minutes' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'default_category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    public function scopeByDifficulty($query, $difficulty)
    {
        return $query->where('difficulty', $difficulty);
    }

    public function createTaskFromTemplate(User $user, ?Category $category = null)
    {
        return Task::create([
            'user_id' => $user->id,
            'category_id' => $category?->id ?? $this->default_category_id,
            'title' => $this->title,
            'description' => $this->description,
            'difficulty' => $this->difficulty,
            'estimated_minutes' => $this->default_estimated_minutes,
            'xp_reward' => $this->getXpRewardByDifficulty(),
            'hp' => $this->getHpByDifficulty(),
        ]);
    }

    private function getXpRewardByDifficulty()
    {
        return match ($this->difficulty) {
            'easy' => 25,
            'medium' => 50,
            'hard' => 100,
            'boss' => 250,
            default => 50,
        };
    }

    private function getHpByDifficulty()
    {
        return match ($this->difficulty) {
            'easy' => 50,
            'medium' => 100,
            'hard' => 200,
            'boss' => 500,
            default => 100,
        };
    }
}
