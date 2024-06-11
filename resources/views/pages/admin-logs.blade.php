@extends('layouts.admin-base')

@section('content')
<div class="main-container w-100">
    <div class="table-wrapper pb-5">
        <div class="header-container mb-3 w-100 d-flex justify-content-between align-items-center">
            <h3><strong>LOGS</strong></h3>
        </div>
        <div class="table-container rounded">
            <input type="text" id="searchInput" class="form-control mb-3" placeholder="Search..." />

            <table id="logsTable" class="table w-100 rounded">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>Description</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody id="logsTableBody">
                    <!-- Data will be populated here by JavaScript -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    window.routeAdminGetAllLogs = @json(route('admin.getAllLogs'));
</script>

@vite(['resources/js/admin-logs.js'])
@endsection
