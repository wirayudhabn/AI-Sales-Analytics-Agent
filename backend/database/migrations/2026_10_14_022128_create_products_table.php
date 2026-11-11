<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_code')->unique();
            $table->string('name');
            $table->enum('category', [
                'Kopi',
                'Minuman',
                'Makanan',
                'Snack',
                'Dessert'
            ]);
            $table->double('selling_price');
            $table->double('cost_price')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Index tambahan untuk performa filter/search
            $table->index('category');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
