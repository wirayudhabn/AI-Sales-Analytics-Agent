<?php

namespace Database\Seeders;

use App\Models\ChatHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChatHistorySeeder extends Seeder
{
    public function run(): void
    {
        // Mengambil ObjectId user admin untuk dihubungkan ke relasi ChatHistory
        $admin = User::where('role', 'admin')->first();
        $adminId = $admin ? $admin->_id : null;

        ChatHistory::create([
            'user_id' => $adminId,
            'session_id' => 'SESS-20261014-ABC123',
            'question' => 'Produk apa yang stoknya di bawah batas minimum?',
            'answer' => 'Produk Matcha Latte Ice (SKU-MATCH-003) saat ini memiliki stok 8, yang mana di bawah batas minimum stok yaitu 10.',
            'function_call' => [
                'name' => 'check_low_stock_products',
                'arguments' => [
                    'threshold_status' => 'below_min'
                ]
            ],
            'createdAt' => now()->subMinutes(30),
        ]);

        ChatHistory::create([
            'user_id' => $adminId,
            'session_id' => 'SESS-20261014-ABC123',
            'question' => 'Berapa total penjualan hari ini?',
            'answer' => 'Total penjualan hari ini berdasarkan transaksi POS adalah Rp 83.000 dari 2 transaksi.',
            'function_call' => [
                'name' => 'get_sales_analytics',
                'arguments' => [
                    'period' => 'today'
                ]
            ],
            'createdAt' => now()->subMinutes(15),
        ]);

        ChatHistory::create([
            'user_id' => $adminId,
            'session_id' => 'SESS-20261014-DEF456',
            'question' => 'Halo, kamu bisa bantu apa saja?',
            'answer' => 'Halo! Saya AI Sales Analytics Agent. Saya bisa membantu Anda menganalisis data penjualan, mengecek stok produk, melihat produk terlaris, serta memantau riwayat transaksi POS Anda.',
            'function_call' => null,
            'createdAt' => now()->subMinutes(5),
        ]);
    }
}
