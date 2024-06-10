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
    var table = $("#checkInTable").DataTable({
        order: [[4, "desc"]],
        paging: false,
        info: false,
        lengthChange: false,
        searching: false,
        columnDefs: [{ orderable: true, targets: [0, 1, 2, 3, 4] }], // Include the new column in ordering
    });

    $("#searchInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#checkInTable tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Load initial data
    loadCheckInData();

    // Function to load check-in data
    function loadCheckInData() {
        $.ajax({
            url: window.routeAdminGetCheckIns, // Use the global variable
            method: "GET",
            success: function (data) {
                console.log("Data received:", data); // Log the data received
                // Clear the table
                table.clear();
                var totalToday = 0;
                data.todayAttendances.forEach(function (checkIn) {
                    // Add each row to the table
                    table.row.add([
                        checkIn.name,
                        checkIn.email,
                        checkIn.user_type,
                        checkIn.program,
                        checkIn.check_in,
                    ]);
                    totalToday++;
                });
                // Redraw the table to display the new data
                table.draw();
                $("#totalToday").text(totalToday);
                $("#totalMonth").text(data.monthAttendancesCount);
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load check-in data.",
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
            loadCheckInData();
        }
    );

    // Periodically refresh the data
    // setInterval(loadCheckInData, 5000); // Refresh every 5 seconds
});
