function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Library Tools")
        .addItem("Generate All Reports", "generateAllReports")
        .addItem("Generate Reports for This Year", "generateReportsForThisYear")
        .addItem(
            "Generate Reports for Previous Years",
            "generateReportsForPreviousYears"
        )
        .addItem("Generate Report for This Month", "generateReportForThisMonth")
        .addItem(
            "Generate Reports for Selected Months",
            "generateReportsForSelectedMonths"
        )
        .addItem(
            "Delete Reports for Selected Months",
            "deleteReportsForSelectedMonths"
        )
        .addToUi();

    Utilities.sleep(500); // Wait for 500 milliseconds
    //generateInitialReports(); // Uncomment to generate initial reports on open
}

// Function to generate reports for all years
function generateAllReports() {
    try {
        var sheet =
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Attendance");
        var data = sheet.getDataRange().getValues();
        var years = data.slice(1).map((row) => new Date(row[0]).getFullYear());
        var uniqueYears = [...new Set(years)];

        uniqueYears.forEach((year) => {
            createMonthlyLibraryAttendanceReports(year, year);
        });
        addZerosToReports();
        Logger.log("All reports generated successfully.");
    } catch (error) {
        Logger.log("Error generating all reports: " + error.message);
    }
}

// Function to generate initial reports for the current year
function generateInitialReports() {
    var currentYear = new Date().getFullYear();
    createMonthlyLibraryAttendanceReports(currentYear);
    addZerosToReports();
}

// Function to generate reports for the current year
function generateReportsForThisYear() {
    var currentYear = new Date().getFullYear();

    var sheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Attendance");
    var data = sheet.getDataRange().getValues();
    var found = false;

    for (var i = 1; i < data.length; i++) {
        var date = new Date(data[i][0]);
        if (date.getFullYear() === currentYear) {
            found = true;
            break;
        }
    }

    if (found) {
        createMonthlyLibraryAttendanceReports(currentYear);
        addZerosToReports();
    } else {
        SpreadsheetApp.getUi().alert(
            "No data found for the year " + currentYear + "."
        );
    }
}

// Function to generate reports for a specified previous year
function generateReportsForPreviousYears() {
    var ui = SpreadsheetApp.getUi();
    var response = ui.prompt(
        "Enter the year you want to generate reports for (e.g., 2023)",
        ui.ButtonSet.OK_CANCEL
    );

    if (response.getSelectedButton() == ui.Button.OK) {
        var year = parseInt(response.getResponseText());

        if (!isNaN(year)) {
            var sheet =
                SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
                    "Attendance"
                );
            var data = sheet.getDataRange().getValues();
            var years = data
                .slice(1)
                .map((row) => new Date(row[0]).getFullYear());

            if (years.includes(year)) {
                createMonthlyLibraryAttendanceReports(year, year);
                addZerosToReports();
            } else {
                ui.alert("No data found for the year " + year + ".");
            }
        } else {
            ui.alert("Invalid year entered. Please try again.");
        }
    }
}

// Function to generate a report for the current month
function generateReportForThisMonth() {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    var currentYear = currentDate.getFullYear();

    var sheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Attendance");
    var data = sheet.getDataRange().getValues();
    var found = false;

    for (var i = 1; i < data.length; i++) {
        var date = new Date(data[i][0]);
        if (
            date.getFullYear() === currentYear &&
            date.getMonth() + 1 === currentMonth
        ) {
            found = true;
            break;
        }
    }

    if (found) {
        createMonthlyLibraryAttendanceReports(
            currentYear,
            currentYear,
            currentMonth,
            currentMonth
        );
        addZerosToReports();
    } else {
        SpreadsheetApp.getUi().alert(
            "No data found for " + currentMonth + "/" + currentYear + "."
        );
    }
}

// Function to generate reports for a specified range of months within a year
function generateReportsForSelectedMonths() {
    var ui = SpreadsheetApp.getUi();

    // Prompt the user to enter the start month, end month, and year
    var startMonthResponse = ui.prompt(
        "Enter the start month (e.g., 1 for January):",
        ui.ButtonSet.OK_CANCEL
    );
    if (startMonthResponse.getSelectedButton() != ui.Button.OK) return;
    var startMonth = parseInt(startMonthResponse.getResponseText());

    var endMonthResponse = ui.prompt(
        "Enter the end month (e.g., 8 for August):",
        ui.ButtonSet.OK_CANCEL
    );
    if (endMonthResponse.getSelectedButton() != ui.Button.OK) return;
    var endMonth = parseInt(endMonthResponse.getResponseText());

    var yearResponse = ui.prompt(
        "Enter the year (e.g., 2023):",
        ui.ButtonSet.OK_CANCEL
    );
    if (yearResponse.getSelectedButton() != ui.Button.OK) return;
    var year = parseInt(yearResponse.getResponseText());

    // Validate the inputs
    if (
        isNaN(startMonth) ||
        isNaN(endMonth) ||
        isNaN(year) ||
        startMonth < 1 ||
        startMonth > 12 ||
        endMonth < 1 ||
        endMonth > 12 ||
        startMonth > endMonth
    ) {
        ui.alert("Invalid input. Please enter valid month numbers and year.");
        return;
    }

    var sheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Attendance");
    var data = sheet.getDataRange().getValues();
    var found = false;

    for (var i = 1; i < data.length; i++) {
        var date = new Date(data[i][0]);
        if (
            date.getFullYear() === year &&
            date.getMonth() + 1 >= startMonth &&
            date.getMonth() + 1 <= endMonth
        ) {
            found = true;
            break;
        }
    }

    if (found) {
        createMonthlyLibraryAttendanceReports(year, year, startMonth, endMonth);
        addZerosToReports();
    } else {
        ui.alert("No data found for the specified range.");
    }
}

// Function to delete reports for a specified range of months within a year
function deleteReportsForSelectedMonths() {
    var ui = SpreadsheetApp.getUi();

    // Prompt the user to enter the start month, end month, and year
    var startMonthResponse = ui.prompt(
        "Enter the start month (e.g., 1 for January):",
        ui.ButtonSet.OK_CANCEL
    );
    if (startMonthResponse.getSelectedButton() != ui.Button.OK) return;
    var startMonth = parseInt(startMonthResponse.getResponseText());

    var endMonthResponse = ui.prompt(
        "Enter the end month (e.g., 8 for August):",
        ui.ButtonSet.OK_CANCEL
    );
    if (endMonthResponse.getSelectedButton() != ui.Button.OK) return;
    var endMonth = parseInt(endMonthResponse.getResponseText());

    var yearResponse = ui.prompt(
        "Enter the year (e.g., 2023):",
        ui.ButtonSet.OK_CANCEL
    );
    if (yearResponse.getSelectedButton() != ui.Button.OK) return;
    var year = parseInt(yearResponse.getResponseText());

    // Validate the inputs
    if (
        isNaN(startMonth) ||
        isNaN(endMonth) ||
        isNaN(year) ||
        startMonth < 1 ||
        startMonth > 12 ||
        endMonth < 1 ||
        endMonth > 12 ||
        startMonth > endMonth
    ) {
        ui.alert("Invalid input. Please enter valid month numbers and year.");
        return;
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Attendance");
    if (!sheet) {
        ui.alert("Attendance sheet not found.");
        return;
    }

    var data = sheet.getDataRange().getValues();
    var rowsToDelete = [];

    // Find rows that match the specified months and year
    for (var i = 1; i < data.length; i++) {
        var date = new Date(data[i][0]);
        var month = date.getMonth() + 1;
        var rowYear = date.getFullYear();

        if (rowYear === year && month >= startMonth && month <= endMonth) {
            rowsToDelete.push(i + 1); // Save the row index to delete later (1-based index)
        }
    }

    // Delete rows from the bottom to avoid messing up the indices
    if (rowsToDelete.length > 0) {
        for (var j = rowsToDelete.length - 1; j >= 0; j--) {
            sheet.deleteRow(rowsToDelete[j]);
        }
        ui.alert("Deleted reports for the specified months.");
    } else {
        ui.alert("No reports found for the specified range.");
    }
}

// Function to create monthly library attendance reports
function createMonthlyLibraryAttendanceReports(
    startYear,
    endYear,
    startMonth,
    endMonth
) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Attendance");
    var data = sheet.getDataRange().getValues();

    // Determine the year and month range
    var currentYear = new Date().getFullYear();
    startYear =
        startYear ||
        new Date(
            Math.min.apply(
                null,
                data.slice(1).map((row) => new Date(row[0]).getFullYear())
            )
        ).getFullYear();
    endYear = endYear || currentYear;
    startMonth = startMonth || 1;
    endMonth = endMonth || 12;

    var allPrograms = [
        "Bachelor of Arts in Psychology",
        "Bachelor of Science in Accountancy",
        "Bachelor of Science in Animation",
        "Bachelor of Computer Science",
        "Bachelor of Fashion Design and Technology",
        "Bachelor of Arts in Film and Visual Effects",
        "Bachelor of Science in Business Administration",
        "Bachelor of Arts in Multimedia Arts and Design",
        "Bachelor of Arts in Music Production and Sound Design",
        "Bachelor of Entertainment and Multimedia Computing - Game Development",
        "Bachelor of Science in Information Technology",
        "Bachelor of Science in Real Estate Management",
        "Main User Group ( Faculty | Non-Teaching )",
        "Senior High School",
    ];

    var monthData = {};
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (row.length < 5) continue;
        var date = new Date(row[0]);
        if (isNaN(date)) continue;

        var month =
            date.toLocaleString("en-us", { month: "long" }) +
            " " +
            date.getFullYear();
        var year = date.getFullYear();
        var monthIndex = date.getMonth() + 1;

        if (
            year >= startYear &&
            year <= endYear &&
            monthIndex >= startMonth &&
            monthIndex <= endMonth
        ) {
            if (!monthData[month]) {
                monthData[month] = {};
                for (var program of allPrograms) {
                    monthData[month][program] = Array(31).fill(null);
                }
            }

            var program = row[4];
            if (program === "Faculty" || program === "Non-Teaching") {
                program = "Main User Group ( Faculty | Non-Teaching )";
            }

            var day = date.getDate() - 1;
            if (!monthData[month][program]) {
                monthData[month][program] = Array(31).fill(null);
            }
            if (monthData[month][program][day] === null) {
                monthData[month][program][day] = 0;
            }
            monthData[month][program][day]++;
        }
    }

    for (var month in monthData) {
        var reportSheet = ss.getSheetByName(month);
        if (reportSheet) {
            ss.deleteSheet(reportSheet);
        }
        reportSheet = ss.insertSheet(month);

        var headers = ["USER GROUP"];
        var dayColumns = [];
        var dateColumns = [];
        var monthParts = month.split(" ");
        var monthIndex = new Date(
            Date.parse(monthParts[0] + " 1, " + monthParts[1])
        ).getMonth();
        var maxDays = new Date(monthParts[1], monthIndex + 1, 0).getDate();

        for (var day = 1; day <= maxDays; day++) {
            var date = new Date(monthParts[1], monthIndex, day);
            var dayName = date.toLocaleString("en-us", { weekday: "long" });
            dayColumns.push(dayName);
            dateColumns.push(day);
        }
        headers = headers.concat(dayColumns, ["Total Per\nProgram"]);

        var titleRange = reportSheet.getRange("A1");
        titleRange.setValue(
            "LIBRARY DEPARTMENT\nLIBRARY ATTENDANCE REPORT SY 2023-2024\nSTUDENTS, FACULTY AND NON-TEACHING\n\n" +
                month.toUpperCase() +
                " (SY 2023-2024)"
        );
        titleRange
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

        reportSheet.getRange(3, 1, 1, headers.length).setValues([headers]);
        reportSheet
            .getRange(4, 2, 1, dateColumns.length)
            .setValues([dateColumns]);

        reportSheet
            .getRange(3, 1, 1, headers.length)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");
        reportSheet
            .getRange(4, 2, 1, dateColumns.length)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

        var programTotals = {};
        var dayTotals = Array(maxDays).fill(0);
        var hasDataForDay = Array(maxDays).fill(false);

        var row = 5;
        for (var program of allPrograms) {
            var programData = monthData[month][program];
            var rowData = [program];
            var programTotal = 0;

            for (var day = 0; day < maxDays; day++) {
                if (programData[day] !== null) {
                    rowData.push(programData[day]);
                    programTotal += programData[day];
                    dayTotals[day] += programData[day];
                    hasDataForDay[day] = true;
                } else {
                    rowData.push(null); // Leave it blank initially
                }
            }

            rowData.push(programTotal);
            programTotals[program] = programTotal;

            reportSheet
                .getRange(row, 1, 1, headers.length)
                .setValues([rowData]);
            row++;
        }

        // Add zeros if there is at least one entry for that day
        for (var day = 0; day < maxDays; day++) {
            if (hasDataForDay[day]) {
                for (var r = 5; r < row; r++) {
                    var cell = reportSheet.getRange(r, day + 2);
                    if (cell.getValue() === null) {
                        cell.setValue(0); // Add zero
                    }
                }
            }
        }

        // Add totals per day
        var totalsRow = ["Total Per Day"];
        for (var day = 0; day < maxDays; day++) {
            totalsRow.push(dayTotals[day]);
        }
        totalsRow.push(""); // Leave the last cell empty for now
        reportSheet.getRange(row, 1, 1, headers.length).setValues([totalsRow]);

        // Add the overall total below the totals per day row
        var overallTotal = Object.values(programTotals).reduce(
            (a, b) => a + b,
            0
        );
        row++;
        var overallTotalRow = ["Total for All Programs"];
        for (var i = 1; i < headers.length - 1; i++) {
            overallTotalRow.push(""); // Leave the intermediate cells empty
        }
        overallTotalRow.push(overallTotal);
        reportSheet
            .getRange(row, 1, 1, headers.length)
            .setValues([overallTotalRow]);

        // Highlight the "Total Per Program" column and "Total Per Day" row
        reportSheet
            .getRange(4, headers.length, row - 4, 1)
            .setBackground("#B4C7E7"); // Light Cornflower Blue 2 for "Total Per Program"
        reportSheet
            .getRange(row - 1, 1, 1, headers.length)
            .setBackground("#B4C7E7"); // Light Cornflower Blue 2 for "Total Per Day"

        // Highlight only the cell containing the overall total number
        reportSheet.getRange(row, headers.length).setBackground("#4F81BD"); // Darker Cornflower Blue 1 for the overall total cell

        // Format the report sheet
        reportSheet.getRange(3, 1, 1, headers.length).setFontWeight("bold");
        reportSheet.getRange(3, 2, 1, dayColumns.length).setTextRotation(90); // Rotate day headers
        reportSheet.autoResizeColumns(1, 1);
        for (var col = 2; col <= dateColumns.length + 1; col++) {
            reportSheet.setColumnWidth(col, 27); // Set column width for date columns
        }
    }
}

// Function to add zeros to reports where there is no data
function addZerosToReports() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();

    for (var i = 0; i < sheets.length; i++) {
        var sheet = sheets[i];
        var sheetName = sheet.getName();
        if (sheetName === "Form Responses 1") continue;

        var data = sheet.getDataRange().getValues();
        var maxDays = data[3].length - 2; // Deduce max days from the header length
        var lastDataRow = sheet.getLastRow() - 2; // Exclude the last two rows with totals

        for (var day = 0; day < maxDays; day++) {
            var hasDataForDay = false;

            for (var row = 4; row < lastDataRow; row++) {
                if (data[row][day + 1] !== null && data[row][day + 1] !== "") {
                    hasDataForDay = true;
                    break;
                }
            }

            if (hasDataForDay) {
                for (var row = 4; row < lastDataRow; row++) {
                    if (
                        data[row][day + 1] === null ||
                        data[row][day + 1] === ""
                    ) {
                        sheet.getRange(row + 1, day + 2).setValue(0); // Add zero
                    }
                }
            }
        }
    }
}
