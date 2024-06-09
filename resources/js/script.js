// // Initialization of Check in Table
// $(document).ready(function () {
//     $("#checkInTable").DataTable({
//         order: [[3, "desc"]],
//         paging: false,
//         info: false,
//         lengthChange: false,
//         searching: false,
//         columnDefs: [{ orderable: true, targets: [0, 1, 2, 3] }],
//     });

//     $("#searchInput").on("keyup", function () {
//         var value = $(this).val().toLowerCase();
//         $("#checkInTable tbody tr").filter(function () {
//             $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
//         });
//     });
// });

// // Initialization of Attendance Table
// $(document).ready(function () {
//     $("#attendanceTable").DataTable({
//         order: [[0, "desc"]],
//         paging: false,
//         info: false,
//         lengthChange: false,
//         searching: false,
//         columnDefs: [{ orderable: true, targets: [0, 1, 2, 3, 4] }],
//     });

//     $("#searchInput").on("keyup", function () {
//         var value = $(this).val().toLowerCase();
//         $("#attendanceTable tbody tr").filter(function () {
//             $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
//         });
//     });
// });
