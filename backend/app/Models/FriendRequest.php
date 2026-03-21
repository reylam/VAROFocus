<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FriendRequest extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'friend_requests';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function accept()
    {
        $this->status = 'accepted';
        $this->save();

        // Create bidirectional friendship
        Friend::create([
            'user_id' => $this->sender_id,
            'friend_id' => $this->receiver_id,
            'status' => 'accepted',
        ]);

        Friend::create([
            'user_id' => $this->receiver_id,
            'friend_id' => $this->sender_id,
            'status' => 'accepted',
        ]);

        return $this;
    }

    public function reject()
    {
        $this->status = 'rejected';
        $this->save();
        return $this;
    }
}
