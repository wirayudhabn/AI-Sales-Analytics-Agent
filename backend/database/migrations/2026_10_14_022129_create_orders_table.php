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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id')->unique();
            $table->array('items'); // Memuat array dari object item (product_sku, qty, price_at_sale)
            $table->double('total');
            $table->timestamp('transaction_time');
            $table->timestamp('synced_at');

            // Indexing
            $table->index('transaction_time');
            $table->index('items.product_sku');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
