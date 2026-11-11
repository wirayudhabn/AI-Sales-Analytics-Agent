<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'product_code' => 'KPI-001',
                'name' => 'Espresso',
                'category' => 'Kopi',
                'selling_price' => 18000,
                'cost_price' => 8000,
                'is_active' => true,
            ],
            [
                'product_code' => 'KPI-002',
                'name' => 'Cafe Latte',
                'category' => 'Kopi',
                'selling_price' => 25000,
                'cost_price' => 12000,
                'is_active' => true,
            ],
            [
                'product_code' => 'KPI-003',
                'name' => 'Cappuccino',
                'category' => 'Kopi',
                'selling_price' => 23000,
                'cost_price' => 11000,
                'is_active' => true,
            ],
            [
                'product_code' => 'MNM-001',
                'name' => 'Matcha Latte',
                'category' => 'Minuman',
                'selling_price' => 28000,
                'cost_price' => 14000,
                'is_active' => true,
            ],
            [
                'product_code' => 'MNM-002',
                'name' => 'Lemon Tea',
                'category' => 'Minuman',
                'selling_price' => 15000,
                'cost_price' => 6000,
                'is_active' => true,
            ],
            [
                'product_code' => 'MKN-001',
                'name' => 'Chicken Rice',
                'category' => 'Makanan',
                'selling_price' => 30000,
                'cost_price' => 18000,
                'is_active' => true,
            ],
            [
                'product_code' => 'SNK-001',
                'name' => 'French Fries',
                'category' => 'Snack',
                'selling_price' => 18000,
                'cost_price' => 9000,
                'is_active' => true,
            ],
            [
                'product_code' => 'SNK-002',
                'name' => 'Chocolate Cookies',
                'category' => 'Snack',
                'selling_price' => 12000,
                'cost_price' => 5000,
                'is_active' => true,
            ],
            [
                'product_code' => 'DST-001',
                'name' => 'Chocolate Cake',
                'category' => 'Dessert',
                'selling_price' => 22000,
                'cost_price' => 10000,
                'is_active' => true,
            ],
            [
                'product_code' => 'DST-002',
                'name' => 'Cheesecake',
                'category' => 'Dessert',
                'selling_price' => 27000,
                'cost_price' => 13000,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['product_code' => $product['product_code']],
                $product
            );
        }
    }
}
