<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $cashier = User::where('role', 'kasir')->first();

        if (!$cashier) {
            return;
        }

        $products = Product::where('is_active', true)
            ->get()
            ->keyBy('product_code');

        $transactions = [
            [
                'transaction_id' => 'TRX-20261104-0001',
                'items' => [
                    ['code' => 'KPI-002', 'qty' => 2],
                    ['code' => 'SNK-001', 'qty' => 1],
                ],
                'payment_method' => 'qris',
                'time' => '2026-11-04 09:15:00',
            ],
            [
                'transaction_id' => 'TRX-20261104-0002',
                'items' => [
                    ['code' => 'MNM-001', 'qty' => 1],
                    ['code' => 'DST-001', 'qty' => 2],
                ],
                'payment_method' => 'tunai',
                'time' => '2026-11-04 10:30:00',
            ],
            [
                'transaction_id' => 'TRX-20261104-0003',
                'items' => [
                    ['code' => 'MKN-001', 'qty' => 2],
                    ['code' => 'MNM-002', 'qty' => 2],
                ],
                'payment_method' => 'transfer',
                'time' => '2026-11-04 11:45:00',
            ],
            [
                'transaction_id' => 'TRX-20261104-0004',
                'items' => [
                    ['code' => 'KPI-001', 'qty' => 3],
                    ['code' => 'SNK-002', 'qty' => 2],
                ],
                'payment_method' => 'qris',
                'time' => '2026-11-04 13:20:00',
            ],
            [
                'transaction_id' => 'TRX-20261104-0005',
                'items' => [
                    ['code' => 'DST-002', 'qty' => 1],
                    ['code' => 'KPI-003', 'qty' => 1],
                ],
                'payment_method' => 'tunai',
                'time' => '2026-11-04 14:10:00',
            ],
        ];

        foreach ($transactions as $transaction) {
            $items = [];
            $total = 0;

            foreach ($transaction['items'] as $item) {
                $product = $products->get($item['code']);

                if (!$product) {
                    continue;
                }

                $qty = $item['qty'];
                $subtotal = $product->selling_price * $qty;

                $items[] = [
                    'product_id' => $product->getKey(),
                    'product_name' => $product->name,
                    'category' => $product->category,
                    'qty' => $qty,
                    'price_at_sale' => $product->selling_price,
                    'cost_at_sale' => $product->cost_price,
                ];

                $total += $subtotal;
            }

            if (empty($items)) {
                continue;
            }

            Order::firstOrCreate(
                ['transaction_id' => $transaction['transaction_id']],
                [
                    'cashier_id' => $cashier->getKey(),
                    'items' => $items,
                    'total' => $total,
                    'payment_method' => $transaction['payment_method'],
                    'transaction_time' => Carbon::parse($transaction['time']),
                ]
            );
        }
    }
}
