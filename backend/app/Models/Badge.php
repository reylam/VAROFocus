<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Badge extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'badges';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'rarity',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_badges')
            ->withPivot('obtained_at');
    }

    public function achievements(): BelongsToMany
    {
        return $this->belongsToMany(Achievement::class);
    }

    public function scopeByRarity($query, $rarity)
    {
        return $query->where('rarity', $rarity);
    }

    public function scopeLegendary($query)
    {
        return $query->where('rarity', 'legendary');
    }

    public function scopeEpic($query)
    {
        return $query->where('rarity', 'epic');
    }

    public function scopeRare($query)
    {
        return $query->where('rarity', 'rare');
    }

    public function scopeCommon($query)
    {
        return $query->where('rarity', 'common');
    }
}
