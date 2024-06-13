<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

// Admin routes
Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
Route::get('/attendance', [AdminController::class, 'attendance'])->name('admin.attendance');
Route::get('/logs', [AdminController::class, 'logs'])->name('admin.logs');


Route::get('/admin-get-check-ins', [AdminController::class, 'getCheckIns'])->name('admin.getCheckIns');
Route::get('/admin-get-all-attendance', [AdminController::class, 'getAllAttendance'])->name('admin.getAllAttendance');
Route::get('/admin-get-all-logs', [AdminController::class, 'getAllLogs'])->name('admin.getAllLogs');

Route::get('/export-attendance', [AdminController::class, 'exportAttendance'])->name('admin.exportAttendance');