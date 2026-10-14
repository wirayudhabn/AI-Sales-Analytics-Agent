<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $collection = 'orders';

    // Disable timestamps bawaan (created_at/updated_at) karena menggunakan transaction_time & synced_at
    public $timestamps = false;

    protected $fillable = [
        'transaction_id',
        'items',
        'total',
        'transaction_time',
        'synced_at',
    ];

    protected $casts = [
        'items' => 'array',
        'total' => 'float',
        'transaction_time' => 'datetime',
        'synced_at' => 'datetime',
    ];
}
