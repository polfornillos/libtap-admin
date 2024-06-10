import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Configure Laravel Echo
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,
});

$(document).ready(function () {
    // Initialize DataTable and keep a reference to it
    var table = $("#attendanceTable").DataTable({
        order: [[0, "desc"]],
        paging: false,
        info: false,
        lengthChange: false,
        searching: false,
        columnDefs: [{ orderable: true, targets: [0, 1, 2, 3, 4] }],
    });

    $("#searchInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#attendanceTable tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Load initial data
    loadAttendanceData();

    // Function to load attendance data
    function loadAttendanceData() {
        $.ajax({
            url: window.routeAdminGetAllAttendance, // Use the global variable
            method: "GET",
            success: function (data) {
                console.log("Data received:", data); // Log the data received
                // Clear the table
                table.clear();
                data.forEach(function (attendance) {
                    // Add each row to the table
                    table.row.add([
                        attendance.timestamp,
                        attendance.email,
                        attendance.library_user,
                        attendance.id_number,
                        attendance.program,
                    ]);
                });
                // Redraw the table to display the new data
                table.draw();
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load attendance data.",
                });
            },
        });
    }

    // Listen for broadcasted events
    window.Echo.channel("attendance-channel").listen(
        "AttendanceRecorded",
        (e) => {
            console.log("Event received:", e);
            // Reload data on new attendance
            loadAttendanceData();
        }
    );

    // Periodically refresh the data
    setInterval(loadAttendanceData, 5000); // Refresh every 5 seconds
});
