<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class StockMovement extends Model
{
    protected $collection = 'stock_movements';

    // Menggunakan kolom createdAt khusus sesuai schema
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;

    protected $fillable = [
        'product_sku',
        'type',
        'qty',
        'createdAt',
    ];

    protected $casts = [
        'qty' => 'integer',
        'createdAt' => 'datetime',
    ];

    /**
     * Relasi kembali ke Product berdasarkan SKU
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_sku', 'sku');
    }
}
