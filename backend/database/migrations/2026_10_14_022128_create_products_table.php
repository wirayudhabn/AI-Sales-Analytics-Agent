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
            $table->string('sku')->unique();
            $table->string('name');
            $table->double('selling_price');
            $table->double('cost_price')->nullable();
            $table->array('categories');
            $table->integer('stock');
            $table->integer('min_stock');
            $table->enum('source', ['synced', 'manual']);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Index tambahan untuk performa filter/search
            $table->index('is_active');
            $table->index('categories');
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
