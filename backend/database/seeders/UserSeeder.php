<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Utama',
            'email' => 'admin@pos.com',
            'password' => 'password123', // Otomatis di-hash oleh cast 'password' => 'hashed' pada model User
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Kasir Shift Pagi',
            'email' => 'kasir1@pos.com',
            'password' => 'password123',
            'role' => 'cashier',
        ]);
    }
}
