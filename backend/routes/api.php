<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test-api', function (Request $request) {
    return "API success";
});

Route::post('v1/auth/login', [AuthController::class, 'login']);
