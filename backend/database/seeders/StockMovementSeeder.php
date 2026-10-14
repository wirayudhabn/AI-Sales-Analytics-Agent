<?php

namespace Database\Seeders;

use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class StockMovementSeeder extends Seeder
{
    public function run(): void
    {
        StockMovement::create([
            'product_sku' => 'SKU-KOPI-001',
            'type' => 'initial',
            'qty' => 52,
            'createdAt' => now()->subDays(3),
        ]);

        StockMovement::create([
            'product_sku' => 'SKU-ROTI-002',
            'type' => 'initial',
            'qty' => 31,
            'createdAt' => now()->subDays(3),
        ]);

        StockMovement::create([
            'product_sku' => 'SKU-KOPI-001',
            'type' => 'sale',
            'qty' => 2,
            'createdAt' => now()->subHours(2),
        ]);

        StockMovement::create([
            'product_sku' => 'SKU-ROTI-002',
            'type' => 'sale',
            'qty' => 1,
            'createdAt' => now()->subHours(2),
        ]);

        StockMovement::create([
            'product_sku' => 'SKU-MATCH-003',
            'type' => 'restock',
            'qty' => 10,
            'createdAt' => now()->subDays(1),
        ]);
    }
}
