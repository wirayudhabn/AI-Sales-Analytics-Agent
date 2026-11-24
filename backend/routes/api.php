<?php

use App\Http\Controllers\AgentController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test-api', function (Request $request) {
    return "API success";
});

Route::prefix('v1')->group(function () {
    // Public
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected (jwt.verify; pengecekan role 'admin' dilakukan di controller/middleware)
    Route::middleware('jwt.verify')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Analytics Endpoints (khusus role owner)
        Route::prefix('analytics')->group(function () {
            Route::get('/summary', [AnalyticsController::class, 'summary']);
            Route::get('/best-selling', [AnalyticsController::class, 'bestSelling']);
            Route::get('/low-margin', [AnalyticsController::class, 'lowMargin']);
            Route::get('/sales-by-category', [AnalyticsController::class, 'salesByCategory']);
            Route::get('/trend', [AnalyticsController::class, 'trend']);
            Route::get('/peak-hours', [AnalyticsController::class, 'peakHours']);
            Route::get('/compare', [AnalyticsController::class, 'compare']);
            Route::get('/anomalies', [AnalyticsController::class, 'anomalies']);
        });

        // AI Agent Endpoints (khusus role owner)
        Route::post('/agent/chat', [AgentController::class, 'chat']);
        Route::get('/agent/history', [AgentController::class, 'history']);
    });
});
