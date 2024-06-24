<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Log;
use App\Services\GoogleSheetService;
use Illuminate\Support\Facades\Log as LaravelLog;
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
    
    public function logs()
    {
        return view('pages/admin-logs');
    }

    public function getCheckIns()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
    
        // Fetch check-ins for today
        $todayAttendances = Attendance::with(['student', 'faculty'])
            ->where('timestamp', '>=', $today)
            ->get()
            ->map(function ($attendance) {
                $timestamp = Carbon::parse($attendance->timestamp);
                return [
                    'name' => $attendance->student ? $attendance->student->f_name . ' ' . $attendance->student->l_name : ($attendance->faculty ? $attendance->faculty->f_name . ' ' . $attendance->faculty->l_name : 'Guest'),
                    'email' => $attendance->student ? $attendance->student->email : ($attendance->faculty ? $attendance->faculty->email : 'N/A'),
                    'program' => $attendance->program,
                    'timestamp' => $timestamp->format('Y-m-d H:i:s'),
                    'user_type' => $attendance->role,
                    'today' => true,
                    'thisMonth' => false // Placeholder; will not be used in the frontend
                ];
            });
    
        // Count check-ins for this month
        $monthAttendancesCount = Attendance::where('timestamp', '>=', $thisMonth)->count();
    
        return response()->json([
            'todayAttendances' => $todayAttendances,
            'monthAttendancesCount' => $monthAttendancesCount
        ]);
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
                    'school_id' => $attendance->school_id,
                    'program' => $attendance->program
                ];
            });

        return response()->json($attendances);
    }

    public function getAllLogs()
    {
        $logs = Log::orderBy('timestamp', 'desc')->get()
            ->map(function ($log) {
                $timestamp = Carbon::parse($log->timestamp);
                return [
                    'timestamp' => $timestamp->format('Y-m-d H:i:s'),
                    'action' => $log->action,
                    'description' => $log->description,
                    'error' => $log->error ? 'Yes' : 'No',
                ];
            });

        return response()->json($logs);
    }

    public function exportAttendance(Request $request, GoogleSheetService $googleSheetService)
    {
        $startMonth = $request->input('startMonth');
        $endMonth = $request->input('endMonth');
        $year = $request->input('year');
    
        // Define course mappings
        $courseMappings = [
            'BSEMCGD' => 'Bachelor of Entertainment and Multimedia Computing - Game Development',
            'BSCSSE' => 'Bachelor of Computer Science',
            'BSCSCC' => 'Bachelor of Computer Science',
            'BSCSDS' => 'Bachelor of Computer Science',
            'BSITWD' => 'Bachelor of Science in Information Technology',
            'BSBAMM' => 'Bachelor of Science in Business Administration',
            'BSBAEM' => 'Bachelor of Science in Business Administration',
            'BSREM' => 'Bachelor of Science in Real Estate Management',
            'ABPSY' => 'Bachelor of Arts in Psychology',
            'BSA' => 'Bachelor of Science in Accountancy',
            'BAFDT' => 'Bachelor of Fashion Design and Technology',
            'ABMAD' => 'Bachelor of Arts in Multimedia Arts and Design',
            'BSAN' => 'Bachelor of Science in Animation',
            'ABMPSD' => 'Bachelor of Arts in Music Production and Sound Design',
            'ABFVE' => 'Bachelor of Arts in Film and Visual Effects',
            // Senior High School courses grouped together
            'SHS-SE' => 'Senior High School',
            'SHS-MMA' => 'Senior High School',
            'SHS-ABM' => 'Senior High School',
            'SHS-AP' => 'Senior High School',
            'SHS-A' => 'Senior High School',
            'SHS-FD' => 'Senior High School',
            'SHS-HUMMS' => 'Senior High School',
            'SHS-RB' => 'Senior High School',
        ];
    
        // Fetch attendance data with filters
        $attendances = Attendance::with(['student', 'faculty'])
            ->when($year, function ($query) use ($year) {
                return $query->whereYear('timestamp', $year);
            })
            ->when($startMonth, function ($query) use ($startMonth, $endMonth) {
                if ($endMonth) {
                    return $query->whereMonth('timestamp', '>=', $startMonth)
                        ->whereMonth('timestamp', '<=', $endMonth);
                } else {
                    return $query->whereMonth('timestamp', '>=', $startMonth);
                }
            })
            ->get()
            ->map(function ($attendance) use ($courseMappings) {
                $timestamp = Carbon::parse($attendance->timestamp);
                $program = $attendance->program;
    
                // Map the program to its full name if it exists in the courseMappings array
                if (isset($courseMappings[$program])) {
                    $program = $courseMappings[$program];
                } elseif ($attendance->faculty) {
                    $program = 'Faculty';
                } elseif ($attendance->role === 'non-teaching') {
                    $program = 'Non-Teaching';
                }
    
                return [
                    $timestamp->format('m/d/Y H:i:s'),
                    $attendance->student ? $attendance->student->email : ($attendance->faculty ? $attendance->faculty->email : 'N/A'),
                    $attendance->student ? 'Student' : ($attendance->faculty ? 'Faculty' : 'Non-Teaching'),
                    $attendance->school_id,
                    $program
                ];
            });
    
        // Prepare data for Google Sheets
        $data = $attendances->toArray();
    
        // Spreadsheet ID (ensure this ID is correct)
        $spreadsheetId = '1U-VKuS7FNScqv4f2jnrWeIFvAXoBzqSbuJNDnewAZ-w';
    
        // Read existing data
        $existingData = $googleSheetService->readData($spreadsheetId, 'Attendance!A2:E');
        LaravelLog::info('Existing Data: ', $existingData);
    
        // Filter out any empty arrays
        $existingData = array_filter($existingData, function ($row) {
            return !empty(array_filter($row));
        });
    
        // Combine and sort existing and new data
        $combinedData = array_merge($existingData, $data);
    
        // Remove duplicates
        $combinedData = array_map("unserialize", array_unique(array_map("serialize", $combinedData)));
    
        usort($combinedData, function ($a, $b) {
            $dateA = Carbon::createFromFormat('m/d/Y H:i:s', $a[0]);
            $dateB = Carbon::createFromFormat('m/d/Y H:i:s', $b[0]);
            return $dateA->lt($dateB) ? -1 : 1;
        });
    
        // Clear the existing data
        $googleSheetService->clearData($spreadsheetId, 'Attendance!A2:E');
    
        // Prepend headers
        array_unshift($combinedData, ['Timestamp', 'Email Address', 'Library User', 'Student/Employee Number', 'Program']);
    
        // Write combined data back to the sheet
        $googleSheetService->exportData($spreadsheetId, $combinedData);
    
        return response()->json(['status' => 'success']);
    }    
}