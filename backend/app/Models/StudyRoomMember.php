<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyRoomMember extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'study_room_members';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'room_id',
        'user_id',
        'role',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(StudyRoom::class, 'room_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeOwners($query)
    {
        return $query->where('role', 'owner');
    }

    public function scopeModerators($query)
    {
        return $query->where('role', 'moderator');
    }

    public function scopeMembers($query)
    {
        return $query->where('role', 'member');
    }

    public function promoteToModerator()
    {
        $this->role = 'moderator';
        $this->save();
        return $this;
    }

    public function demoteToMember()
    {
        $this->role = 'member';
        $this->save();
        return $this;
    }
}
