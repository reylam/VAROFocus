<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubTask extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sub_tasks';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'task_id',
        'title',
        'is_completed',
        'order_index',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'order_index' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function complete()
    {
        $this->is_completed = true;
        $this->save();
        return $this;
    }

    public function uncomplete()
    {
        $this->is_completed = false;
        $this->save();
        return $this;
    }

    public function toggle()
    {
        $this->is_completed = !$this->is_completed;
        $this->save();
        return $this;
    }
}
