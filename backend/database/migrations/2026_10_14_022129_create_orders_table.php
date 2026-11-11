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
            $table->string('cashier_id')->nullable();
            $table->array('items');
            $table->double('total');
            $table->enum('payment_method', [
                'tunai',
                'qris',
                'transfer'
            ]);
            $table->timestamp('transaction_time');
            $table->timestamp('createdAt')->useCurrent();

            // Indexing
            $table->index('cashier_id');
            $table->index('transaction_time');
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
