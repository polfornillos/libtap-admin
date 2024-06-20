@extends('layouts.admin-base')

@section('content')
<div class="main-container w-100">
    <div class="table-wrapper pb-5">
        <div class="header-container mb-3 w-100 d-flex justify-content-between align-items-center">
            <h3><strong>ATTENDANCE</strong></h3>
            <button id="exportButton" class="btn btn-primary px-3"><i class="fa-solid fa-file-export me-1"></i> Export</button>
        </div>
        <div class="table-container rounded">
            <div class="d-flex mb-3">
                <input type="text" id="searchInput" class="form-control me-2" placeholder="Search..." />
                <select id="startMonth" class="form-control me-2">
                    <option value="">Start Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select id="endMonth" class="form-control me-2" disabled>
                    <option value="">End Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select id="year" class="form-control me-2">
                    <option value="">Year</option>
                </select>
                <button id="resetButton" class="btn btn-secondary me-2">Reset</button>
            </div>
            <table id="attendanceTable" class="table w-100 rounded">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Email Address</th>
                        <th>Library user</th>
                        <th>Student/Employee Number</th>
                        <th>Program</th>
                    </tr>
                </thead>
                <tbody id="attendanceTableBody">
                    <!-- Data will be populated here by JavaScript -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    window.routeAdminGetAllAttendance = @json(route('admin.getAllAttendance'));
    window.routeAdminExportAttendance = @json(route('admin.exportAttendance'));
</script>

@vite(['resources/js/admin-attendance.js'])
@endsection
