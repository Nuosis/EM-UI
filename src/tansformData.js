
export function sumEmployeeHoursData(inputData) {
    // Initialize a Map to hold the grouped data
    const groupedMap = new Map();

    // Iterate over the input data
    inputData.forEach(data => {
        const idDay = data.fieldData.id
        const dayDate = data.fieldData.dateWorked
        const employeeId = data.fieldData.id_employee
        const employeeName = data.portalData.employeeDay_EMPLOYEE?.[0]?.["employeeDay_EMPLOYEE::nameDisplay_a"] || "Unknown Employee";
        const employeeDepartment = data.portalData.employeeDay_TIMEHOURS?.[0]?.["employeeDay_TIMEHOURS::department"] || "";
        const isLoggedInFlag = data.portalData.employeeDay_EMPLOYEEHOURS.some(hours => hours["employeeDay_EMPLOYEEHOURS::flag_open_a"] === 1);
        const isLoggedIn = isLoggedInFlag ? "IN" : "OUT";
        const isApproved = data.fieldData.approvedFLAG
        //console.log("dayDate",dayDate)

        // Calculate totalHours from EMPLOYEEHOURS, assuming 'hours' are in seconds
        const totalHours = data.portalData.employeeDay_EMPLOYEEHOURS.reduce((acc, cur) => {
            return acc + (cur["employeeDay_EMPLOYEEHOURS::hours"] / 3600); // Convert seconds to hours
        }, 0);

        // Calculate total hoursV2_Original from TIMEHOURS
        const timeAssigned = data.portalData.employeeDay_TIMEHOURS.reduce((acc, cur) => {
            return acc + cur["employeeDay_TIMEHOURS::hoursV2_Original"]; // Assuming hoursV2_Original is a number
        }, 0);

        // If the group exists, update it
        if (groupedMap.has(idDay)) {
            const existingEntry = groupedMap.get(idDay);
            existingEntry.timeAssigned += timeAssigned; // Accumulate timeAssigned for the employee
        } else {
            // If the group doesn't exist in the map, add it
            groupedMap.set(idDay, {
                id: idDay,
                date: dayDate,
                approved: isApproved,
                employeeName: employeeName,
                employeeId,
                isLoggedIn: isLoggedIn,
                totalHours: totalHours,
                department: employeeDepartment,
                timeAssigned: timeAssigned, // Set initial timeAssigned for the employee
            });
        }
    });

    // Convert the map values to an array and sort it by employeeName
    const sortedArray = Array.from(groupedMap.values()).sort((a, b) => {
        const nameA = a.employeeName || "";
        const nameB = b.employeeName || "";
        return nameA.localeCompare(nameB);
    });

    return sortedArray;
}

export function transformedHrs(hrs) {
    return hrs.map(item => ({
        id: item.fieldData.id,
        date: item.fieldData.date,
        department: item.fieldData.department,
        activity: item.fieldData.type,
        employeeName: item.fieldData.employeName_c,
        jobNum: item.portalData.timeHours_TIMEASSIGN[0]["timeHours_TIMEASSIGN::jobNum_a"],
        hours: item.fieldData.hoursV2_Original
    })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by date
}

export function performanceJobs(json) {
    return json.map(item => ({
        id: item.fieldData.id,
        date: item.fieldData.date,
        department: item.fieldData.department,
        activity: item.fieldData.type,
        employeeName: item.fieldData.employeName_c,
        jobNum: item.portalData.timeHours_TIMEASSIGN[0]["timeHours_TIMEASSIGN::jobNum_a"],
        hours: item.fieldData.hoursV2_Original
    })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by date
}
