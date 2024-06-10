<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

// Admin routes
Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
Route::get('/admin-get-check-ins', [AdminController::class, 'getCheckIns'])->name('admin.getCheckIns');
Route::get('/admin-get-all-attendance', [AdminController::class, 'getAllAttendance'])->name('admin.getAllAttendance');
Route::get('/attendance', [AdminController::class, 'attendance'])->name('admin.attendance');