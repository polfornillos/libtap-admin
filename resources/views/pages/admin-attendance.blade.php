@extends('layouts.admin-base')

@section('content')
<div class="main-container w-100">
    <div class="table-wrapper pb-5">
        <div class="header-container mb-3 w-100 d-flex justify-content-between align-items-center">
            <h3><strong>ATTENDANCE</strong></h3>
            <button id="exportButton" class="btn btn-primary px-3"><i class="fa-solid fa-file-export me-1"></i> Export</button>
        </div>
        <div class="table-container rounded">
            <input type="text" id="searchInput" class="form-control mb-3" placeholder="Search..." />

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
