<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'transaction_id',
        'cashier_id',
        'items',
        'total',
        'payment_method',
        'transaction_time',
    ];

    protected $casts = [
        'items' => 'array',
        'total' => 'float',
        'transaction_time' => 'datetime',
    ];

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;
}
