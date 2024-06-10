<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        return view('pages/admin-dashboard');
    }

    public function attendance()
    {
        return view('pages/admin-attendance');
    }
    
    public function getCheckIns()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        $attendances = Attendance::with(['student', 'faculty'])
            ->where('timestamp', '>=', $today)
            ->get()
            ->map(function ($attendance) use ($today, $thisMonth) {
                $timestamp = Carbon::parse($attendance->timestamp);
                return [
                    'name' => $attendance->student ? $attendance->student->f_name . ' ' . $attendance->student->l_name : ($attendance->faculty ? $attendance->faculty->f_name . ' ' . $attendance->faculty->l_name : 'Guest'),
                    'email' => $attendance->student ? $attendance->student->email : ($attendance->faculty ? $attendance->faculty->email : 'N/A'),
                    'program' => $attendance->program,
                    'check_in' => $timestamp->format('Y-m-d H:i:s'),
                    'user_type' => $attendance->role, // Include user type
                    'today' => $timestamp->gte($today),
                    'thisMonth' => $timestamp->gte($thisMonth)
                ];
            });

        return response()->json($attendances);
    }

    public function getAllAttendance()
    {
        $attendances = Attendance::with(['student', 'faculty'])
            ->get()
            ->map(function ($attendance) {
                $timestamp = Carbon::parse($attendance->timestamp);
                return [
                    'timestamp' => $timestamp->format('Y-m-d H:i:s'),
                    'email' => $attendance->student ? $attendance->student->email : ($attendance->faculty ? $attendance->faculty->email : 'N/A'),
                    'library_user' => $attendance->student ? 'Student' : ($attendance->faculty ? 'Faculty' : 'Guest'),
                    'id_number' => $attendance->id_number,
                    'program' => $attendance->program
                ];
            });

        return response()->json($attendances);
    }
}