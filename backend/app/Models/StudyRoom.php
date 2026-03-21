<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StudyRoom extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'study_rooms';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'owner_id',
        'description',
        'is_private',
        'max_members',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'max_members' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'study_room_members')
            ->withPivot('role', 'joined_at');
    }

    public function roomMembers(): HasMany
    {
        return $this->hasMany(StudyRoomMember::class, 'room_id');
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(RoomSession::class, 'room_id');
    }

    public function scopePublic($query)
    {
        return $query->where('is_private', false);
    }

    public function scopePrivate($query)
    {
        return $query->where('is_private', true);
    }

    public function scopeByOwner($query, $userId)
    {
        return $query->where('owner_id', $userId);
    }

    public function scopeActive($query)
    {
        return $query->has('sessions');
    }

    public function addMember(User $user, $role = 'member')
    {
        if (
            $this->members()->where('user_id', $user->id)->doesntExist() &&
            $this->members()->count() < $this->max_members
        ) {
            $this->members()->attach($user->id, ['role' => $role, 'joined_at' => now()]);
            return true;
        }
        return false;
    }

    public function removeMember(User $user)
    {
        if ($this->owner_id !== $user->id) {
            $this->members()->detach($user->id);
            return true;
        }
        return false;
    }

    public function isMember(User $user)
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    public function isOwner(User $user)
    {
        return $this->owner_id === $user->id;
    }

    public function getMemberCount()
    {
        return $this->members()->count();
    }

    public function isFull()
    {
        return $this->getMemberCount() >= $this->max_members;
    }

    public function startSession()
    {
        return $this->sessions()->create([
            'started_at' => now(),
        ]);
    }

    public function getActiveSession()
    {
        return $this->sessions()->whereNull('ended_at')->first();
    }
}
