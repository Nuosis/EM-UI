import FMGofer from 'fm-gofer';

export function sumEmployeeHoursData(inputData) {
    const groupedMap = new Map();

    inputData.forEach(data => {
        const idDay = data.fieldData.id;
        const dayDate = data.fieldData.dateWorked;
        const employeeId = data.fieldData.id_employee;
        const employeeName = data.portalData.employeeDay_EMPLOYEE?.[0]?.["employeeDay_EMPLOYEE::nameDisplay_a"] || "Unknown Employee";
        const employeeDepartment = data.portalData.employeeDay_TIMEHOURS?.[0]?.["employeeDay_TIMEHOURS::department"] || "";
        const isLoggedInFlag = data.portalData.employeeDay_EMPLOYEEHOURS.some(hours => hours["employeeDay_EMPLOYEEHOURS::flag_open_a"] === 1);
        const isLoggedIn = isLoggedInFlag ? "IN" : "OUT";
        let isApproved = data.fieldData.approvedFLAG === "1" || data.fieldData.approvedFLAG === true; // Assuming approvedFLAG can be boolean or string
        const totalHours = data.portalData.employeeDay_EMPLOYEEHOURS.reduce((acc, cur) => acc + (cur["employeeDay_EMPLOYEEHOURS::hours"] / 3600), 0);
        const timeAssigned = data.portalData.employeeDay_TIMEHOURS.reduce((acc, cur) => acc + cur["employeeDay_TIMEHOURS::hoursV2_Original"], 0);

        if (groupedMap.has(idDay)) {
            const existingEntry = groupedMap.get(idDay);
            existingEntry.timeAssigned += timeAssigned;
        } else {
            groupedMap.set(idDay, {
                id: idDay,
                date: dayDate,
                approved: isApproved,
                employeeName,
                employeeId,
                isLoggedIn,
                totalHours,
                department: employeeDepartment,
                timeAssigned,
            });
        }
    });

    const sortedArray = Array.from(groupedMap.values()).sort((a, b) => a.employeeName.localeCompare(b.employeeName));

    const aggregatedData = {};

    sortedArray.forEach((data) => {
        const employeeKey = data.employeeId;
        if (!aggregatedData[employeeKey]) {
            aggregatedData[employeeKey] = {
                employeeName: data.employeeName,
                employeeId: data.employeeId,
                isLoggedIn: data.isLoggedIn,
                approved: data.approved,
                totalHours: 0,
                timeAssigned: 0,
                department: data.department,
            };
        }

        aggregatedData[employeeKey].totalHours += data.totalHours;
        aggregatedData[employeeKey].timeAssigned += data.timeAssigned;
        if (data.isLoggedIn === "IN") {
            aggregatedData[employeeKey].isLoggedIn = "IN";
        }
        if (!data.approved) {
            aggregatedData[employeeKey].approved = false;
        }
    });

    const finalArray = Object.values(aggregatedData).map(({ date, ...rest }) => rest);

    return finalArray;
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

async function getFMData(params) {
    try {
        return await FMGofer.PerformScript("js * GOferCallbacks", params);
    } catch (error) {
        console.error('Failed to fetch commodity data:', error);
        return null;
    }
}

function safeJSONParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        // console.error("Failed to parse JSON:", str, e);
        return null; // or return {}, [], false based on what you expect
    }
}


export async function performanceJobs(json) {
    console.log('init transformJobPerformance')
    const jobObject = await Promise.all(json.map(async (item) => {
        // Initialize the obj for the current item
        let obj = {
            id: item.fieldData.id,
            customerName: item.portalData.jobs_CUSTOMER[0]["jobs_CUSTOMER::CustomerName"], 
            jobNum: item.fieldData.JobNumText,
            commodity: item.fieldData.commodity,
            partName: item.fieldData["Part Name"],
            woType: item.fieldData["Workorder Type"],
            jobStatus: item.fieldData.status,
            kickDate: item.fieldData.Tool_KickoffDate,
            commitDate: item.fieldData.Tool_ComitmentDate,
            approvalDate: item.fieldData['Approval Date'],
            proMan: item.fieldData["Program Manager"],
            jobLead: item.fieldData.Moldmaker,
            cadDesign: item.fieldData["Cad Designer"],
            labour: {},
            materials: {},
            outsource: {},
            profit: {}
        };

        // Process quote data
        const quoteBody = item.portalData.jobs_QUOTE;
        const quoteParams = JSON.stringify({quoteBody, path: "getQuoteValues"});
        const quoteHeading = await getFMData(quoteParams)
        const quoteHeadingData = safeJSONParse(quoteHeading);

        if (!quoteHeadingData) {
            console.error('No data returned for quoteHeadingData');
            // Handle error or return a partial obj
            return obj;
        }

        // Construct quoteObject from quoteHeadingData
        const quoteObject = quoteHeadingData.reduce((acc, curr) => {
            for (const [headingKey, headingValue] of Object.entries(curr)) {
                // Initialize the heading key object if it does not exist
                if (!acc[headingKey]) acc[headingKey] = {};
        
                for (const [key, value] of Object.entries(headingValue)) {
                    // Convert string to number
                    let numericValue = parseFloat(value);
                    if (isNaN(numericValue)) {
                        numericValue = 0;
                    }
                    
                    // Check if the key exists under the heading; if so, sum up the values, otherwise, initialize it
                    if (acc[headingKey][key]) {
                        acc[headingKey][key] += numericValue;
                    } else {
                        acc[headingKey][key] = numericValue;
                    }
                }
            }
            return acc;
        }, {});        
        console.log("quoteObject",quoteObject)

        /**
         * MANAGE LABOUR OBJECT
         */
        // Use .filter() to exclude 'Materials' and 'Outsource' from the keys
        const labourHeadings = Object.keys(quoteObject).filter(heading => heading !== 'Materials' && heading !== 'Outsource');


        let quoteBudgetCost = 0;
        let quoteBudgetHours = 0;
        let quoteActualCost = 0;
        let quoteActualHours = 0;
        labourHeadings.forEach(heading => {
            let actualHours = 0;
            let actualCost = 0;
            let costToDate = 0;
            let hoursToDate = 0;
            //handle cost
            let headingCost = parseFloat(quoteObject[heading].cost);
            if (isNaN(headingCost)) {
                headingCost = 0; // Fallback to 0 or any other default value
            }
            actualCost = item.portalData.jobs_TIMEHOURS.reduce((total, record) => {
                return record['jobs_TIMEHOURS::department'] === heading ? total + record["jobs_TIMEHOURS::actualV2"] : total;
            }, 0);

            costToDate += actualCost;
            quoteBudgetCost += headingCost;
            quoteActualCost += actualCost;

            //handle hours
            let headingHours = parseFloat(quoteObject[heading].hours);
            if (isNaN(headingHours)) {
                headingHours = 0; // Fallback to 0 or any other default value
            }
            actualHours = item.portalData.jobs_TIMEHOURS.reduce((total, record) => {
                return record['jobs_TIMEHOURS::department'] === heading ? total + record["jobs_TIMEHOURS::hoursV2_Original"] : total;
            }, 0);

            hoursToDate += actualHours;
            quoteBudgetHours += headingHours;
            quoteActualHours += actualHours;


            console.log("quoteData: ",{headingHours,hoursToDate,actualHours,headingCost,costToDate,actualCost,})


            // Initialize heading object and its budget property if it does not exist
            if (!obj.labour[heading]) obj.labour[heading] = {};

            // Assign the calculated totals to the heading in the obj
            obj.labour[heading] = {
                budgetCoL: headingCost,
                actualCoL: costToDate,
                budgetHours: headingHours,
                actualHours: hoursToDate,
                diffHours: headingHours - hoursToDate,
                diffCost: headingCost - costToDate
            };
            console.log("objectAfterHeading",obj)
        });

        // Assign profit calculations to the obj
        obj.profit = {
            quoteBudgetHours,
            quoteBudgetCost,
            quoteActualCost,
            quoteActualHours,
            diffHours: quoteBudgetHours - quoteActualHours,
            diffCost: quoteBudgetCost - quoteActualCost
        };
        console.log("objectAfterProfit",obj)

        return obj; // Return the fully constructed obj for the current item
    })).catch(error => console.error("Promise.all error:", error));

    console.log("jobTransformed",jobObject)

    return {jobObject};
}

