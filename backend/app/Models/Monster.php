<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Monster extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'monsters';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'task_id',
        'type',
        'max_hp',
        'current_hp',
        'image_url',
    ];

    protected $casts = [
        'max_hp' => 'integer',
        'current_hp' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function attacks(): HasMany
    {
        return $this->hasMany(MonsterAttack::class);
    }

    public function takeDamage($damage)
    {
        $this->current_hp = max(0, $this->current_hp - $damage);
        $this->save();

        if ($this->isDead()) {
            $this->task->complete();
        }

        return $this;
    }

    public function isDead()
    {
        return $this->current_hp <= 0;
    }

    public function getHpPercentage()
    {
        return $this->max_hp > 0 ? ($this->current_hp / $this->max_hp) * 100 : 0;
    }

    public function getTotalDamageTaken()
    {
        return $this->attacks()->sum('damage');
    }

    public function getAttackCount()
    {
        return $this->attacks()->count();
    }

    public function heal($amount = null)
    {
        $amount = $amount ?? $this->max_hp;
        $this->current_hp = min($this->current_hp + $amount, $this->max_hp);
        $this->save();
        return $this;
    }
}
