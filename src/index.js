import React from "react";
import { createRoot } from "react-dom/client";
import jobsData from './data/jobs.json';
import timeAssignData from './data/timeAssign.json';
import employeeHoursData from './data/employeeHours.json';
import LoadTable from "../components/Table";
import LoadJobsTable from "../components/JobsTable";
import { root } from "postcss";

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
    clearLoadingAnimation()
    const data = JSON.parse(json); //in FM I am passing in only the data array
    const hrs = data.timeAssignData
    const sum = data.employeeHoursData
    const elements = [
        { objectType: 'search', scope: 'all' },
        { objectType: 'filter', scope: 'date' },
        // { objectType: 'sort', scope: ['name', 'date'] },
    ];
    const hrsColumns = [
        { label: 'ID', filterable: false, searchable: false, sortable: false, hidden: true, field: 'id' },
        { label: 'Date', filterable: true, searchable: true, sortable: true, field: 'zCreationTimestamp' },
        { label: 'Employee', filterable: true, searchable: true, sortable: true, field: 'employeeName_a'  },
        { label: 'Job', filterable: true, searchable: true, sortable: true, field: 'jobDescription_a'  },
        { label: 'Hours Worked', filterable: false, searchable: false, sortable: true, field: 'totalHoursWorked_c'  }
    ];
    const sumColumns = [
        { label: 'ID', filterable: false, searchable: false, sortable: false, hidden: true, field: 'id' },
        { label: 'Employee', filterable: true, searchable: true, sortable: true, field: 'employeeName_a'  },
        { label: 'Allocated', filterable: true, searchable: true, sortable: true, field: 'jobDescription_a'  },
        { label: 'IN/OUT', filterable: true, searchable: true, sortable: true, field: 'jobDescription_a'  },
        { label: 'Hours Worked', filterable: false, searchable: false, sortable: true, field: 'totalHours_c'  }
    ];
    
    manageRoot("root", 
        <>
            <div id="Tables" className="w-full flex flex-row gap-4">
                <div className="flex w-full">
                    <div className="w-3/5 bg-red-900" >
                        <LoadTable data={hrs} elements={elements} columns={hrsColumns} />
                    </div>
                    <div className="w-2/5 bg-lime-800" >
                        <LoadTable data={sum} elements={elements} columns={sumColumns} />
                    </div>
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
