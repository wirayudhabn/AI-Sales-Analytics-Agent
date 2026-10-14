<?php

namespace App\Models;

// Ganti import Authenticatable bawaan SQL dengan milik MongoDB
use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Relasi ke ChatHistory (Satu user punya banyak riwayat chat)
     */
    public function chatHistories()
    {
        return $this->hasMany(ChatHistory::class, 'user_id', '_id');
    }
}
