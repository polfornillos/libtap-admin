@extends('layouts.admin-base')

@section('content')
<div class="main-container w-100">
    <div class="top-container d-flex" style="gap: 20px">
        <div class="widget-container rounded d-flex justify-content-between align-items-center p-4">
            <div class="column">
                <h6 class="text-white"><strong>Total Check-Ins</strong></h6>
                <h3 class="text-white"><strong>TODAY</strong></h3>
            </div>
            <div class="column">
                <h1 class="text-white"><strong id="totalToday">0</strong></h1>
            </div>
        </div>
        <div class="widget-container rounded d-flex justify-content-between align-items-center p-4">
            <div class="column">
                <h6 class="text-white"><strong>Total Check-Ins</strong></h6>
                <h3 class="text-white"><strong>THIS MONTH</strong></h3>
            </div>
            <div class="column">
                <h1 class="text-white"><strong id="totalMonth">0</strong></h1>
            </div>
        </div>
    </div>
    <div class="mid-container mt-5 pb-5">
        <h3><strong>CHECK-INS TODAY</strong></h3>
        <div class="table-container rounded">
            <input type="text" id="searchInput" class="form-control mb-3" placeholder="Search..." />
            <table id="checkInTable" class="table w-100 rounded">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>User Type</th>
                        <th>Program</th>
                        <th>Check-in</th>
                    </tr>
                </thead>
                <tbody id="checkInTableBody">
                    <!-- Data will be populated here by JavaScript -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    window.routeAdminGetCheckIns = @json(route('admin.getCheckIns'));
</script>

@vite(['resources/js/admin-dashboard.js'])
@endsection
