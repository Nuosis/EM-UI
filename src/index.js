import React from "react";
import { createRoot } from "react-dom/client";
import jobsData from './data/jobs.json';
import timeAssignData from './data/timeAssign.json';
import employeeHoursData from './data/employeeHours.json';
import LoadTable from "../components/Table";
import LoadJobsTable from "../components/JobsTable";
import { root } from "postcss";
import { ApprovedButton, ApproveButton } from '../src/icons'; 

console.log('E&M UI 2.0.0') 
let globalRoot = null; // This will hold the root instance

function manageRoot(containerId, element) {
    const container = document.getElementById(containerId);
    // If a root instance already exists, we'll use it to render the new element
    if (globalRoot) {
        globalRoot.render(element);
    } else {
        // If no root exists, create it and save the reference globally
        globalRoot = createRoot(container);
        globalRoot.render(element);
    }
}

function sumEmployeeHoursData(inputData) {
    // Initialize a Map to hold the grouped data
    const groupedMap = new Map();

    // Iterate over the input data
    inputData.forEach(data => {
        const idDay = data.fieldData.id
        const dayDate = data.fieldData.dateWorked
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

function transformedHrs(hrs) {
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

    

window.loadJobTracker = (json) => {
    console.log('init loadJobTracker')
    clearLoadingAnimation()
    const data = JSON.parse(json); //in FM I am passing in only the data array
    const jobs = data.jobs
    manageRoot("root", 
        <div id="jobsTable" className="container w-full columns-2 flex flex-col">
            <LoadJobsTable data={jobs}/>
        </div>
    );
}

window.loadTimeManagement = (json) => {
    console.log('init loadTimeManagement')
    clearLoadingAnimation()
    const data = JSON.parse(json); //in FM I am passing in only the data array
    const hrs = transformedHrs(data.timeAssignData)
    const hrsElements = [
        { objectType: 'search', scope: 'all' },
        { objectType: 'filter', scope: 'date' },
        // { objectType: 'sort', scope: ['name', 'date'] },
    ];
    const hrsColumns = [
        { label: 'ID', type: 'text', index: true, filterable: false, searchable: false, sortable: false, hidden: true, field: 'id' },
        { label: 'Date', type: 'text', index: false, filterable: true, searchable: true, sortable: true, sorted: true, field: 'date' },
        { label: 'Employee', type: 'text', index: false, filterable: true, searchable: true, sortable: true, field: 'employeeName', clickable: true, callbackPath: 'timeManagement.hrs.employee' },
        { label: 'Department', type: 'text', index: false, filterable: true, searchable: true, sortable: true, field: 'department'  },
        { label: 'Activity', type: 'text', index: false, filterable: true, searchable: true, sortable: true, field: 'activity'  },
        { label: 'Job', type: 'text', index: false, filterable: true, searchable: true, sortable: true, field: 'jobNum'  },
        { label: 'Hours Worked', type: 'text', index: false, filterable: false, searchable: false, sortable: true, field: 'hours'  },
        { label: '', type: 'button', icon: 'delete24', callBackPath: "timeManagement.delete"  }
    ];

    const sum = sumEmployeeHoursData(data.employeeHoursData);
    //console.log(`sumObject`,sum)
    const sumElements = [
        { objectType: 'search', scope: 'all' },
        //{ objectType: 'filter', scope: 'date' },
        // { objectType: 'sort', scope: ['name', 'date'] },
    ];
    const sumColumns = [
        { label: 'ID', index: true, filterable: false, searchable: false, sortable: false, hidden: true, field: 'id' },
        { label: 'Approved', index: true, filterable: false, searchable: false, sortable: false, hidden: true, field: 'approved' },
        { label: 'Employee', index: false, filterable: true, searchable: true, sortable: true, sorted: true, field: 'employeeName'  },
        { label: 'Department', index: false, filterable: true, searchable: true, sortable: true, field: 'department'  },
        { label: 'Date', index: false, filterable: true, searchable: true, sortable: true, field: 'date'  },
        { label: 'Allocated', index: false, filterable: false, searchable: false, sortable: true, field: 'timeAssigned', clickable: true, callbackPath: 'timeManagement.sum.allocated' },
        { label: 'IN/OUT', index: false, filterable: true, searchable: true, sortable: true, field: 'isLoggedIn'  },
        { label: 'Hours', index: false, filterable: false, searchable: false, sortable: true, field: 'totalHours', clickable: true, callbackPath: 'timeManagement.sum.hours'   },
        { label: '', type: 'component', compairColumn: 'Approved', ifTrue: ApprovedButton, ifFalse: ApproveButton, callBackPath: "timeManagement.approve"  }
    ];

    manageRoot("root", 
        <>
            <div id="Tables" className="w-full flex flex-row gap-4">
                <div className="w-3/5 bg-gray-100" >
                    <LoadTable data={hrs} elements={hrsElements} columns={hrsColumns} />
                </div>
                <div className="w-2/5 bg-gray-100" >
                    <LoadTable data={sum} elements={sumElements} columns={sumColumns} />
                </div>
            </div>
        </>
    );
}

window.showLoadingAnimation = () => {
    const feedbackContainer = document.getElementById("feedback");
    // Ensure the container uses the Flexbox setup for centering
    feedbackContainer.classList.add("feedback-container"); // Add the class to the container
    
    // Clear existing content
    feedbackContainer.innerHTML = '';

    // Create and add the spinner
    const spinnerDiv = document.createElement('div');
    spinnerDiv.className = 'spinner'; // Use the spinner class
    feedbackContainer.appendChild(spinnerDiv);
}

window.clearLoadingAnimation = () => {
    const feedbackContainer = document.getElementById("feedback");
    // Remove existing content
    feedbackContainer.innerHTML = '';
}

//showLoadingAnimation()
//clearLoadingAnimation()
//loadJobTracker(JSON.stringify(jobsData))
loadTimeManagement(JSON.stringify({timeAssignData,employeeHoursData}))
