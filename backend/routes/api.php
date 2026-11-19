<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test-api', function (Request $request) {
    return "API success";
});

Route::prefix('v1')->group(function () {
    // Public
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected (Bisa diakses role owner & cashier)
    Route::middleware('jwt.verify')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/products', [ProductController::class, 'index']);
    });
});
