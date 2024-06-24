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
        filterAttendance();
    });

    // Function to load years for dropdown
    function loadYearDropdown(data) {
        let years = new Set();
        data.forEach(function (attendance) {
            let year = new Date(attendance.timestamp).getFullYear();
            years.add(year);
        });

        $("#year").empty().append(new Option("Year", ""));
        years.forEach(function (year) {
            $("#year").append(new Option(year, year));
        });
    }

    // Load initial data and populate dropdowns
    loadAttendanceData();

    function loadAttendanceData() {
        $.ajax({
            url: window.routeAdminGetAllAttendance,
            method: "GET",
            success: function (data) {
                // Clear the table
                table.clear();
                data.forEach(function (attendance) {
                    // Add each row to the table
                    table.row.add([
                        attendance.timestamp,
                        attendance.email,
                        attendance.library_user,
                        attendance.school_id,
                        attendance.program,
                    ]);
                });
                // Redraw the table to display the new data
                table.draw();

                // Populate year dropdown
                loadYearDropdown(data);

                // Store the data for filtering
                window.attendanceData = data;
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

    function filterAttendance() {
        let startMonth = $("#startMonth").val();
        let endMonth = $("#endMonth").val();
        let year = $("#year").val();
        let searchValue = $("#searchInput").val().toLowerCase();

        let filteredData = window.attendanceData.filter(function (attendance) {
            let date = new Date(attendance.timestamp);
            let attendanceYear = date.getFullYear();
            let attendanceMonth = String(date.getMonth() + 1).padStart(2, "0");
            let attendanceText = JSON.stringify(attendance).toLowerCase();

            let isMonthInRange = true;
            if (startMonth && endMonth) {
                isMonthInRange =
                    attendanceMonth >= startMonth &&
                    attendanceMonth <= endMonth;
            } else if (startMonth) {
                isMonthInRange = attendanceMonth >= startMonth;
            }

            return (
                (!year || attendanceYear == year) &&
                isMonthInRange &&
                (!searchValue || attendanceText.includes(searchValue))
            );
        });

        table.clear();
        filteredData.forEach(function (attendance) {
            table.row.add([
                attendance.timestamp,
                attendance.email,
                attendance.library_user,
                attendance.school_id,
                attendance.program,
            ]);
        });
        table.draw();
    }

    // Event listeners for dropdowns
    $("#startMonth").change(function () {
        let startMonth = $("#startMonth").val();
        let endMonth = $("#endMonth").val();
        if (startMonth) {
            $("#endMonth").prop("disabled", false);

            // Enable only the valid options for end month
            $("#endMonth option").each(function () {
                if ($(this).val() < startMonth) {
                    $(this).prop("disabled", true);
                } else {
                    $(this).prop("disabled", false);
                }
            });

            // Clear end month if it is before the new start month
            if (endMonth && endMonth < startMonth) {
                $("#endMonth").val("");
            }
        } else {
            $("#endMonth").prop("disabled", true).val("");
        }
        filterAttendance();
    });

    $("#endMonth, #year").change(function () {
        filterAttendance();
    });

    // Reset button functionality
    $("#resetButton").click(function () {
        $("#startMonth").val("");
        $("#endMonth").val("").prop("disabled", true);
        $("#year").val("");
        $("#searchInput").val("");
        filterAttendance();
    });

    // Listen for broadcasted events
    window.Echo.channel("attendance-channel").listen(
        "AttendanceRecorded",
        (e) => {
            // Reload data on new attendance
            loadAttendanceData();
        }
    );

    // Periodically refresh the data
    // setInterval(loadAttendanceData, 5000); // Refresh every 5 seconds

    // Month mapping
    const monthNames = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        10: "October",
        11: "November",
        12: "December",
    };

    // Handle export button click
    $("#exportButton").click(function () {
        let startMonth = $("#startMonth").val();
        let endMonth = $("#endMonth").val();
        let year = $("#year").val();

        let message = "Are you sure you want to export all attendance data?";
        if (year || startMonth || endMonth) {
            let range = "";
            if (startMonth && endMonth) {
                range = `from ${monthNames[startMonth]} to ${monthNames[endMonth]} `;
            } else if (startMonth) {
                range = `from ${monthNames[startMonth]} `;
            }
            message = `Are you sure you want to export attendance ${range}${
                year ? "for " + year : ""
            }?`;
        }

        Swal.fire({
            title: "Confirm Export",
            text: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, export it!",
            cancelButtonText: "No, cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: window.routeAdminExportAttendance,
                    method: "GET",
                    data: {
                        startMonth: startMonth,
                        endMonth: endMonth,
                        year: year,
                    },
                    success: function (response) {
                        if (response.status === "success") {
                            Swal.fire({
                                title: "Success!",
                                text: "Attendance data has been successfully exported to Google Sheets.",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            title: "Error!",
                            text: "There was an error exporting the data. Please try again.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    },
                });
            }
        });
    });
});
