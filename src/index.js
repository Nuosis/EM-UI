import React from "react";
import { createRoot } from "react-dom/client";
import jobsData from './data/jobs.json';
import timeAssignData from './data/timeAssign.json';
import employeeHoursData from './data/employeeHours.json';
import jobsObject from './data/jobsObject.json';
import LoadTable from "../components/Table";
import LoadJobsTable from "../components/JobsTable";
import { root } from "postcss";
import { ApprovedButton, ApproveButton } from '../src/icons'; 
import {sumEmployeeHoursData,transformedHrs,performanceJobs} from './tansformData'


    /**
     * TABLE.JS
     * 
     * ELEMENTS (Array)
     * 
     * OPTIONAL: By including this you will display inpouts the user can use to modify what data is desplayed without distroying the data
     * 
     * STRUCTURE:
     * objectType: string, values can be filter (omit) or search (find)
     */


    /**
     * COLUMNS (Array)
     * 
     * REQUIRED: defines the columns and the properties of that column
     * 
     * STRUCTURE: metaData
     * index: bool, use this column value as the index
     * hidden: bool, do not display this column
     * type: string, designates the type of column (text, button, component)
     *      buttonText: string, (for use with button)
     *      icon: string, (for use with button) the name of the icon to use from icons.js
     *      compairColumn: (for use with component) the field to evaluate against 
     *      ifTrue: (for use with component:compairColumn) The component to use when the compairColumn is true
     *      ifFalse: (for use with component:compairColumn) The component to use when the compairColumn is false (default)
     *      callbackPath: string, (for use with component) designates the path (subroutine) to use within the FileMaker Script
     * 
     * STRUCTURE: properties
     * filterable: bool
     * sortable: bool
     * searchable: bool
     * clickable: bool
     *      callbackPath: string, (Used with clickable) designates the path (subroutine) to use within the FileMaker Script
     * 
     * STRUCTURE: data
     * lable: string, the heading to display (can be "")
     * field: string, the field to reference in the tablebody object to set as the display value
     */

        // const sumColumns = [
    //     { label: 'ID', index: true, filterable: false, searchable: false, sortable: false, hidden: true, field: 'id' },
    //     { label: 'Approved', index: true, filterable: false, searchable: false, sortable: false, hidden: true, field: 'approved' },
    //     { label: 'Employee', index: false, filterable: true, searchable: true, sortable: true, sorted: true, field: 'employeeName'  },
    //     { label: 'Department', index: false, filterable: true, searchable: true, sortable: true, field: 'department'  },
    //     { label: 'Date', index: false, filterable: true, searchable: true, sortable: true, field: 'date'  },
    //     { label: 'Allocated', index: false, filterable: false, searchable: false, sortable: true, field: 'timeAssigned', clickable: true, callbackPath: 'timeManagement.sum.allocated' },
    //     { label: 'IN/OUT', index: false, filterable: true, searchable: true, sortable: true, field: 'isLoggedIn'  },
    //     { label: 'Hours', index: false, filterable: false, searchable: false, sortable: true, field: 'totalHours', clickable: true, callbackPath: 'timeManagement.sum.hours'   },
    //     { label: '', type: 'component', compairColumn: 'Approved', ifTrue: "ApprovedButton", ifFalse: "ApproveButton", callBackPath: "timeManagement.approve"  }
    // ];


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
    const data = JSON.parse(json);
    // console.log(`passedData`,data)
    const hrs = transformedHrs(data.timeAssignData);
    const hrsElements = data.timeAssignElements
    const hrsColumns = data.timeAssignColumns
    
    const sum = sumEmployeeHoursData(data.employeeHoursData);
    const sumElements = data.employeeHoursElements
    const sumColumns = data.employeeHoursColumns
    // console.log(`sumColumns`,sumColumns)

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

window.loadJobPerformance = (json) => {
    console.log('init jobPerformance')
    const data = JSON.parse(json);
    // console.log(`passedData`,data)
    const jobsData = performanceJobs(data.jobsData);
    const jobsElements = data.jobsElements
    const jobsColumns = data.jobsColumns
    // console.log(`jobsColumns`, jobsColumns)

    manageRoot("root", 
        <>
            <div id="Tables" className="w-full flex flex-row gap-4">
                <div className="w-5/5 bg-gray-100" >
                    <LoadTable data={jobsData} elements={jobsElements} columns={jobsColumns} />
                </div>
            </div>
        </>
    );
}

window.showLoadingAnimation = () => {
    const formContainer = document.getElementById("root");
    // Remove existing content
    formContainer.innerHTML = '';

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
    feedbackContainer.innerHTML = '';
}

//showLoadingAnimation()
//clearLoadingAnimation()
//loadJobTracker(JSON.stringify(jobsData))
//loadTimeManagement(JSON.stringify({timeAssignData,employeeHoursData}))
