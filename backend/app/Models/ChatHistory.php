<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ChatHistory extends Model
{
    protected $collection = 'chat_histories';

    // Menggunakan kolom createdAt khusus sesuai schema
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'session_id',
        'question',
        'answer',
        'function_call',
        'createdAt',
    ];

    protected $casts = [
        'function_call' => 'array',
        'createdAt' => 'datetime',
    ];

    /**
     * Relasi ke User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}
