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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->string('product_sku');
            $table->enum('type', ['initial', 'sale', 'restock']);
            $table->integer('qty');
            $table->timestamp('createdAt');

            // Compound Index untuk tracking stok per produk berdasarkan waktu
            $table->index(['product_sku', 'createdAt']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
