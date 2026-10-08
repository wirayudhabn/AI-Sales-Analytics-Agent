<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-mongo', function () {
    try {
        DB::connection('mongodb')->getPdo();
        return "Status: Terkoneksi ke MongoDB!";
    } catch (\Exception $e) {
        return "Gagal terkoneksi: " . $e->getMessage();
    }
});
