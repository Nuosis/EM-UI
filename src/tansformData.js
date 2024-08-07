import FMGofer from 'fm-gofer';

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

export function sumEmployeeHoursData(inputData) {
    const groupedMap = new Map();

    inputData.forEach(data => {
        const idDay = data.fieldData.id;
        const dayDate = data.fieldData.dateWorked;
        const employeeId = data.fieldData.id_employee;
        const employeeName = data.portalData.employeeDay_EMPLOYEE?.[0]?.["employeeDay_EMPLOYEE::nameDisplay_a"] || "Unknown Employee";
        const employeeDepartment = data.portalData.employeeDay_TIMEASSIGN?.[0]?.["employeeDay_TIMEASSIGN::department_a"] || "";
        const isLoggedInFlag = data.portalData.employeeDay_EMPLOYEEHOURS.some(hours => hours["employeeDay_EMPLOYEEHOURS::flag_open_a"] === 1);
        const isLoggedIn = isLoggedInFlag ? "IN" : "OUT";
        let isApproved = data.fieldData.approvedFLAG === "1" || data.fieldData.approvedFLAG === true;
        const totalHours = data.portalData.employeeDay_EMPLOYEEHOURS.reduce((acc, cur) => {
            const hours = parseFloat(cur["employeeDay_EMPLOYEEHOURS::hours"]);
            return acc + (!isNaN(hours) ? hours / 3600 : 0);
        }, 0);
        
        // Composite key combining employeeId and dayDate
        const employeeDateKey = `${employeeId}_${dayDate}`;

        if (groupedMap.has(employeeDateKey)) {
            const existingEntry = groupedMap.get(employeeDateKey);
            existingEntry.totalHours += totalHours;
        } else {
            let timeAssigned = data.portalData.employeeDay_TIMEHOURS.reduce((acc, cur) => {
                const hours = parseFloat(cur["employeeDay_TIMEHOURS::hoursV2_Original"]);
                return acc + (!isNaN(hours) ? Math.round(hours * 100) : 0); // Scale to integer before adding
            }, 0) / 100;

            // console.log(employeeName,timeAssigned)

            groupedMap.set(employeeDateKey, {
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
    // console.log({sortedArray})

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

        const originalTimeAssigned = aggregatedData[employeeKey].timeAssigned;
        let newTimeAssigned = isNaN(data.timeAssigned) ? 0 : parseFloat(data.timeAssigned.toFixed(2));
        newTimeAssigned = Math.round(newTimeAssigned * 100)/100
        aggregatedData[employeeKey].timeAssigned += newTimeAssigned;
    
        // Logging the calculation details
        // console.log(`Updating timeAssigned for ${data.employeeName} (ID: ${data.employeeId}):`);
        // console.log(`Original timeAssigned: ${originalTimeAssigned}, New addition: ${newTimeAssigned}, Updated timeAssigned: ${aggregatedData[employeeKey].timeAssigned}`);

        aggregatedData[employeeKey].totalHours += isNaN(data.totalHours) ? 0 : data.totalHours;
        // aggregatedData[employeeKey].timeAssigned += isNaN(data.timeAssigned) ? 0 : parseFloat(data.timeAssigned.toFixed(2));
        if (data.isLoggedIn === "IN") {
            aggregatedData[employeeKey].isLoggedIn = "IN";
        }
        if (!data.approved) {
            aggregatedData[employeeKey].approved = false;
        }
    });
    console.log({aggregatedData})
    Object.keys(aggregatedData).forEach(key => {
        aggregatedData[key].timeAssigned = parseFloat(aggregatedData[key].timeAssigned.toFixed(2));
    });

    return Object.values(aggregatedData);
}

export function transformedHrs(hrs) {
  return hrs.map(item => ({
      id: item.fieldData?.id || 'undefinedID', // Fallback to 'DefaultID' if undefined
      date: item.fieldData?.date || new Date().toISOString(), // Fallback to current date if undefined
      department: item.fieldData?.department || '*', // Fallback to 'Default Department' if undefined
      activity: item.fieldData?.type || '*', // Fallback to 'Default Activity' if undefined
      employeeName: item.fieldData?.employeName_c || 'Unknown Employee', // Fallback to 'Unknown Employee' if undefined
      jobNum: item.portalData?.timeHours_TIMEASSIGN?.[0]?.["timeHours_TIMEASSIGN::jobNum_a"] || '*', // Fallback to 'Default Job Number' if undefined
      hours: item.fieldData?.hoursV2_Original || 0 // Fallback to 0 if undefined
  })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by date
}

export async function performanceJobs(json) {
    console.log('init performanceJobs in TransformData',{json})
    if (!Array.isArray(json)) {
        console.error('Invalid input in performanceJobs: Expected an array');
        return; // or throw an error
    }
    const jobObject = await Promise.all(json.map(async (item) => {
        //Initialize the obj for the current item
        console.log('itemMap',{item})
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
            projectName: item.fieldData["Project Name"],
            jobLead: item.fieldData.Moldmaker,
            cadDesign: item.fieldData["Cad Designer"],
            labour: {},
            labourTotals: {},
            other: {},
            profit: {}
        };
        obj.labourTotals.costActual = isNaN(obj.labourTotals.costActual) ? 0 : obj.labourTotals.costActual;
        obj.labourTotals.costBurden = isNaN(obj.labourTotals.costBurden) ? 0 : obj.labourTotals.costBurden;
        obj.labourTotals.costBudget = isNaN(obj.labourTotals.costBudget) ? 0 : obj.labourTotals.costBudget;
        
        //console.log(obj)

        // Process quote data
        const quoteBody = item.portalData.jobs_QUOTE;
        // Sum up the laborTotal_c values from each quote record
        const totalPrice = quoteBody.reduce((acc, curr) => {
            const laborCost = parseFloat(curr["jobs_QUOTE::grandTotalCND_c"]);
            return acc + (isNaN(laborCost) ? 0 : laborCost);
        }, 0);
        const quoteParams = JSON.stringify({quoteBody, path: "getQuoteValues"});
        const quoteHeading = await getFMData(quoteParams)
        // console.log(quoteHeading)
        const quoteHeadingData = safeJSONParse(quoteHeading);
        console.log(quoteHeadingData)

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
        quoteObject.total = totalPrice
        // console.log("quoteObject",quoteObject)

        /**
         * MANAGE LABOUR OBJECT
         */
        // Use .filter() to exclude 'Materials' and 'Outsource' from the keys
        const labourHeadings = Object.keys(quoteObject).filter(heading => heading !== 'Materials' && heading !== 'Outsource');


        let quoteBudgetCost = 0;
        let quoteBudgetHours = 0;
        let quoteActualCost = 0;
        let quoteBurdenCost = 0;
        let quoteActualHours = 0;
        labourHeadings.forEach(heading => {
            let actualHours = 0;
            let actualCost = 0;
            let burdenCost = 0;
            let costToDate = 0;
            let burdenToDate = 0;
            let hoursToDate = 0;
            //handle cost
            let headingCost = parseFloat(quoteObject[heading].cost);
            if (isNaN(headingCost)) {
                headingCost = 0; // Fallback to 0 or any other default value
            }
            actualCost = item.portalData.jobs_TIMEHOURS.reduce((total, record) => {
                const cost = parseFloat(record["jobs_TIMEHOURS::actualV2"])
                return record['jobs_TIMEHOURS::department'] === heading && !isNaN(cost) ? total + cost : total;
            }, 0);
            burdenCost = item.portalData.jobs_TIMEHOURS.reduce((total, record) => {
                const cost = parseFloat(record["jobs_TIMEHOURS::burdenV2"])
                return record['jobs_TIMEHOURS::department'] === heading && !isNaN(cost) ? total + cost : total;
            }, 0);

            costToDate += actualCost;
            burdenToDate += burdenCost;
            quoteBudgetCost += headingCost;
            quoteActualCost += actualCost;
            quoteBurdenCost += burdenCost;

            //handle hours
            let headingHours = parseFloat(quoteObject[heading].hours);
            if (isNaN(headingHours)) {
                headingHours = 0; // Fallback to 0 or any other default value
            }
            actualHours = item.portalData.jobs_TIMEHOURS.reduce((total, record) => {
                const cost = parseFloat(record["jobs_TIMEHOURS::hoursV2_Original"])
                return record['jobs_TIMEHOURS::department'] === heading && !isNaN(cost) ? total + cost : total;
            }, 0);

            hoursToDate += actualHours;
            quoteBudgetHours += headingHours;
            quoteActualHours += actualHours;


            //console.log("quoteData: ",{headingHours,hoursToDate,actualHours,headingCost,costToDate,actualCost,})


            // Initialize heading object and its budget property if it does not exist
            if (!obj.labour[heading]) obj.labour[heading] = {};

            // Assign the calculated totals to the heading in the obj
            obj.labour[heading] = {
                budgetCoL: headingCost,
                actualCoL: costToDate,
                burdenCoL: burdenToDate,
                budgetHours: headingHours,
                actualHours: hoursToDate,
                diffHours: headingHours - hoursToDate,
                diffActual: headingCost - costToDate,
                diffBurden: headingCost - burdenToDate
            }
            obj.labourTotals.costActual += costToDate
            obj.labourTotals.costBurden += burdenToDate
            obj.labourTotals.costBudget += headingCost
        });
        // console.log("objectAfterLabour",obj)

        /**
         * MANAGE MATERIALS OBJECT
         */


        let actualMaterialCost = 0;
        let headingMaterialCost = parseFloat(quoteObject.Materials.cost);
        if (isNaN(headingMaterialCost)) {
            headingMaterialCost = 0; // Fallback to 0 or any other default value
        }
        console.log('portalData',item.portalData)
        console.log('PO_LINES',item.portalData.jobs_POLINES)
        actualMaterialCost = item.portalData.jobs_POLINES.reduce((total, record) => {
            const cost = parseFloat(record["jobs_POLINES::total_cad"])
            return record['jobs_POLINES::flag_POtype'] === 1 && !isNaN(cost) ? total + cost : total;
        }, 0);

        quoteBudgetCost += headingMaterialCost;
        quoteActualCost += actualMaterialCost;

        // Assign the calculated totals to the heading in the obj
        if (!obj.other.Materials) obj.other.Materials = {};
        obj.other.Materials = {
            budget: headingMaterialCost,
            actual: actualMaterialCost,
            diff: headingMaterialCost - actualMaterialCost
        };
        
        //console.log("objectAfterMaterial",obj);

        /**
         * MANAGE OUTSOURCE OBJECT
         */


        let actualOutsourceCost = 0;
        let headingOutsourceCost = parseFloat(quoteObject.Outsource.cost);
        if (isNaN(headingOutsourceCost)) {
            headingOutsourceCost = 0; // Fallback to 0 or any other default value
        }
        actualOutsourceCost = item.portalData.jobs_POLINES.reduce((total, record) => {
            const cost = parseFloat(record["jobs_POLINES::total_cad"])
            return record['jobs_POLINES::flag_POtype'] === 2 && !isNaN(cost) ? total + cost : total;
        }, 0);

        // Assign the calculated totals to the heading in the obj
        if (!obj.other.Outsource) obj.other.Outsource = {};
        obj.other.Outsource = {
            budget: headingOutsourceCost,
            actual: actualOutsourceCost,
            diff: headingOutsourceCost - actualOutsourceCost
        };
        //console.log("objectAfterOutsource",obj);

        // Assign profit calculations to the obj
        if (!obj.profit.Profit) obj.profit.Profit = {};
        obj.profit.Profit = {
            totalPrice,
            totalLabourCost: obj.labourTotals.costActual,
            totalLabourCostBurden: obj.labourTotals.costBurden,
            totalMaterialCost: obj.other.Materials.actual,
            totalOutsourceCost: obj.other.Outsource.actual,
            totalCosts: obj.labourTotals.costActual+obj.other.Materials.actual+obj.other.Outsource.actual,
            totalCostsBurden: obj.labourTotals.costBurden+obj.other.Materials.actual+obj.other.Outsource.actual,
            quoteActualHours,
            quoteBudgetHours,
            diffHours: quoteBudgetHours - quoteActualHours,
            diffCost: totalPrice - (obj.labourTotals.costActual + obj.other.Materials.actual + obj.other.Outsource.actual),
            diffCostBurden: totalPrice - obj.labourTotals.costBurden - obj.other.Materials.actual - obj.other.Outsource.actual,
        };
        obj.profit.Profit.percentProfit = obj.profit.Profit.diffCost/obj.profit.Profit.totalPrice || 0;
        obj.profit.Profit.percentProfitBurden = obj.profit.Profit.diffCostBurden/obj.profit.Profit.totalPrice || 0;
        delete obj.labour.total;
        //console.log("objectAfterProfit",obj)

        return obj; // Return the fully constructed obj for the current item
    })).catch(error => console.error("Promise.all error:", error));

    //console.log("jobTransformed",jobObject)

    return {jobObject};
}

