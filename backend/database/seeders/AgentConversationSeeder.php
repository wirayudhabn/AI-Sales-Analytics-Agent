<?php

namespace Database\Seeders;

use App\Models\AgentConversation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AgentConversationSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            return;
        }

        AgentConversation::updateOrCreate(
            [
                'session_id' => 'SESSION-DEMO-001',
            ],
            [
                'user_id' => $admin->getKey(),

                'messages' => [
                    [
                        'sender' => 'user',
                        'text' => 'Berapa total penjualan hari ini?',
                        'function_call' => [
                            'name' => null,
                            'arguments' => null,
                        ],
                        'timestamp' => Carbon::parse('2026-11-04 15:00:00'),
                    ],
                    [
                        'sender' => 'agent',
                        'text' => 'Saya akan menghitung total penjualan hari ini.',
                        'function_call' => [
                            'name' => 'get_sales_summary',
                            'arguments' => [
                                'period' => 'today',
                            ],
                        ],
                        'timestamp' => Carbon::parse('2026-11-04 15:00:05'),
                    ],
                    [
                        'sender' => 'agent',
                        'text' => 'Total penjualan hari ini adalah Rp300.000 dari 5 transaksi.',
                        'function_call' => [
                            'name' => null,
                            'arguments' => null,
                        ],
                        'timestamp' => Carbon::parse('2026-11-04 15:00:08'),
                    ],
                    [
                        'sender' => 'user',
                        'text' => 'Produk apa yang paling banyak terjual?',
                        'function_call' => [
                            'name' => null,
                            'arguments' => null,
                        ],
                        'timestamp' => Carbon::parse('2026-11-04 15:01:00'),
                    ],
                    [
                        'sender' => 'agent',
                        'text' => 'Saya akan menganalisis produk terlaris.',
                        'function_call' => [
                            'name' => 'get_best_selling_products',
                            'arguments' => [
                                'period' => 'today',
                                'limit' => 5,
                            ],
                        ],
                        'timestamp' => Carbon::parse('2026-11-04 15:01:05'),
                    ],
                    [
                        'sender' => 'agent',
                        'text' => 'Produk yang paling banyak terjual adalah Cafe Latte.',
                        'function_call' => [
                            'name' => null,
                            'arguments' => null,
                        ],
                        'timestamp' => Carbon::parse('2026-11-04 15:01:08'),
                    ],
                ],
            ]
        );
    }
}
