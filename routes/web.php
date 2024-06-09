<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

// Admin routes
Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
Route::get('/admin-get-check-ins', [AdminController::class, 'getCheckIns'])->name('admin.getCheckIns');