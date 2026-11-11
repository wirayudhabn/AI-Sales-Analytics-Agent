<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@pos.com'],
            [
                'name' => 'Administrator',
                'password' => 'password123',
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // Kasir
        User::updateOrCreate(
            ['email' => 'kasir@pos.com'],
            [
                'name' => 'Kasir Utama',
                'password' => 'password123',
                'role' => 'kasir',
                'is_active' => true,
            ]
        );
    }
}
