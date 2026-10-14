<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $collection = 'products';

    protected $fillable = [
        'sku',
        'name',
        'selling_price',
        'cost_price',
        'categories',
        'stock',
        'min_stock',
        'source',
        'is_active',
    ];

    protected $casts = [
        'selling_price' => 'float',
        'cost_price' => 'float',
        'categories' => 'array',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke StockMovement berdasarkan SKU
     */
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class, 'product_sku', 'sku');
    }
}
