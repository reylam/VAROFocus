<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomSession extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'room_sessions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'room_id',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(StudyRoom::class, 'room_id');
    }

    public function scopeActive($query)
    {
        return $query->whereNull('ended_at');
    }

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('ended_at');
    }

    public function end()
    {
        $this->ended_at = now();
        $this->save();
        return $this;
    }

    public function getDuration()
    {
        $end = $this->ended_at ?? now();
        return $end->diffInMinutes($this->started_at);
    }

    public function isActive()
    {
        return is_null($this->ended_at);
    }
}
