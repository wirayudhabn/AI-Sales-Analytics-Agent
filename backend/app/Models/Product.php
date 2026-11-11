<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';

    protected $fillable = [
        'product_code',
        'name',
        'category',
        'selling_price',
        'cost_price',
        'is_active',
    ];

    protected $casts = [
        'selling_price' => 'float',
        'cost_price' => 'float',
        'is_active' => 'boolean',
    ];

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
}
