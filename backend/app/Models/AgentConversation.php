<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class AgentConversation extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'agent_conversations';

    protected $fillable = [
        'user_id',
        'session_id',
        'messages',
    ];

    protected $casts = [
        'messages' => 'array',
    ];

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
}
