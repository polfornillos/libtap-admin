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
    var table = $("#logsTable").DataTable({
        order: [[0, "desc"]],
        paging: false,
        info: false,
        lengthChange: false,
        searching: false,
        columnDefs: [{ orderable: true, targets: [0, 1, 2, 3] }],
    });

    $("#searchInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#logsTable tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Load initial data
    loadLogsData();

    // Function to load logs data
    function loadLogsData() {
        $.ajax({
            url: window.routeAdminGetAllLogs, // Use the global variable
            method: "GET",
            success: function (data) {
                // Clear the table
                table.clear();
                data.forEach(function (log) {
                    // Add each row to the table
                    table.row.add([
                        log.timestamp,
                        log.action,
                        log.description,
                        log.error,
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
                    text: "Failed to load logs data.",
                });
            },
        });
    }

    // Listen for broadcasted events (if needed)
    window.Echo.channel("logs-channel").listen("LogRecorded", (e) => {
        // Reload data on new log entry
        loadLogsData();
    });

    // Periodically refresh the data
    // setInterval(loadLogsData, 5000); // Refresh every 5 seconds
});
