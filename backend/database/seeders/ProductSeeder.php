<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'sku' => 'SKU-KOPI-001',
            'name' => 'Kopi Susu Gula Aren',
            'selling_price' => 18000,
            'cost_price' => 10000,
            'categories' => ['Beverages', 'Coffee'],
            'stock' => 50,
            'min_stock' => 10,
            'source' => 'manual',
            'is_active' => true,
        ]);

        Product::create([
            'sku' => 'SKU-ROTI-002',
            'name' => 'Roti Bakar Cokelat Keju',
            'selling_price' => 22000,
            'cost_price' => 12000,
            'categories' => ['Snacks', 'Food'],
            'stock' => 30,
            'min_stock' => 5,
            'source' => 'manual',
            'is_active' => true,
        ]);

        Product::create([
            'sku' => 'SKU-MATCH-003',
            'name' => 'Matcha Latte Ice',
            'selling_price' => 25000,
            'cost_price' => 14000,
            'categories' => ['Beverages', 'Non-Coffee'],
            'stock' => 8, // Stok di bawah min_stock untuk testing alert AI
            'min_stock' => 10,
            'source' => 'synced',
            'is_active' => true,
        ]);
    }
}
