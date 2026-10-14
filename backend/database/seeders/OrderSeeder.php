<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        Order::create([
            'transaction_id' => 'TRX-20261014-001',
            'items' => [
                [
                    'product_sku' => 'SKU-KOPI-001',
                    'qty' => 2,
                    'price_at_sale' => 18000,
                ],
                [
                    'product_sku' => 'SKU-ROTI-002',
                    'qty' => 1,
                    'price_at_sale' => 22000,
                ]
            ],
            'total' => 58000,
            'transaction_time' => now()->subHours(2),
            'synced_at' => now()->subHours(2),
        ]);

        Order::create([
            'transaction_id' => 'TRX-20261014-002',
            'items' => [
                [
                    'product_sku' => 'SKU-MATCH-003',
                    'qty' => 1,
                    'price_at_sale' => 25000,
                ]
            ],
            'total' => 25000,
            'transaction_time' => now()->subHour(),
            'synced_at' => now()->subHour(),
        ]);
    }
}
