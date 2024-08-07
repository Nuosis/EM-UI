import React from "react";
import { createRoot } from "react-dom/client";
import LoadTable from "../components/Table";
import {sumEmployeeHoursData,transformedHrs,performanceJobs} from './tansformData'


    /**
     * TABLE.JS
     * 
     * ELEMENTS (Array)
     * 
     * OPTIONAL: By including this you will display inputs the user can use to modify what data is desplayed without distroying the data
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
     *      componentName: string, (for use with component) designates the name of the component to use in icon.js
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

    //     const sumColumns = [
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

/**
 * 
 * TRACKERS 
 * 
 */

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
    const propData = JSON.parse(json);
    // console.log(`passedJobData`,data.data)
    const jobElements = propData.elements
    const jobColumns = propData.columns
    const data = propData.data

    manageRoot("root", 
        <>
            <div id="Tables" className="w-full flex flex-row gap-4">
                <div className="w-5/5 bg-gray-100" >
                    <LoadTable data={data} elements={jobElements} columns={jobColumns} />
                </div>
            </div>
        </>
    );
}

window.callFileMakerScript = (script, params) => {
        FileMaker.PerformScript(script, params);
}

window.loadTimeManagement = (json) => {
    console.log('init loadTimeManagement')
    const data = JSON.parse(json);
    const spinner = data.loading
    if(spinner){
      manageRoot("root", 
        <div id="loading" className="flex mt-20 justify-center items-center h-full">
            <div className="spinner"></div> {/* Make sure to define CSS for this spinner */}
        </div>
      );
    } else {
    console.log(`passedTimeAssignData`,data.timeAssignData)
    const hrs = transformedHrs(data.timeAssignData);
    console.log(`sumOfTimeAssign`,hrs)
    const hrsElements = data.timeAssignElements
    const hrsColumns = data.timeAssignColumns
    
    const sum = sumEmployeeHoursData(data.employeeHoursData);
    console.log(`passedEmployeeHoursData`,data.employeeHoursData)
    console.log(`sumOfEmployeeHours`,sum)
    const sumElements = data.employeeHoursElements
    const sumColumns = data.employeeHoursColumns  
    
    // instantiate root
    const container = document.getElementById("root");
    const root = createRoot(container);
  
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
    )}
}

//load job performance by passing data object from dapi call. Uses FMGofer.
window.transformAndLoadJobPerformance = async (json) => {
    console.log('init jobPerformance')
    const data = JSON.parse(json);
    // console.log(`passedData`,data)
    const jobsElements = data.elements
    //console.log(`passedElements`,jobsElements)
    const jobsColumns = data.columns
    //console.log(`passedColumns`,jobsColumns)
    const jobs = await performanceJobs(data.data).catch(e => console.error("Error in performanceJobs:", e));
    const jobsData = jobs.jobObject;

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

//load job performance by passing transformed data object from dapi call using transformJobPerformance prior to call
window.loadJobPerformance = async (json) => {
    console.log('init jobPerformance')
    const data = JSON.parse(json);
    console.log({data})
    const jobsElements = data.elements
    const jobsColumns = data.columns
    const jobsData = data.data;

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
/**
 * 
 * FUNCTIONS
 * 
 */
window.toggleLoadingAnimation = (spinner, setSpinner) => {
  setSpinner(!spinner)
}

window.sumJobActivity = (json) => {
    // provides array ob objects where keys are total hours, total, burden and total actuals for each department of a provided job.
    // assumes all from the same job
    // expects data consistent with timeHours.json (dataAPI call to dapiTimeHours for a given job)
    data = JSON.parse(json)
    console.log("sumJob Data",{data})
    const result = {};
        data.forEach(item => {
            const { department, type, hoursV2_Original, burdenV2, actualV2 } = item.fieldData;
            
            // If the department doesn't exist, initialize it
            if (!result[department]) {
                result[department] = {};
            }
            
            // If the type within the department doesn't exist, initialize it
            if (!result[department][type]) {
                result[department][type] = { totalHoursV2Original: 0, totalBurdenV2: 0, totalActualV2: 0 };
            }
            
            // Accumulate the values for hoursV2_Original, burdenV2, and actualV2 for each type within the department
            result[department][type].totalHoursV2Original += hoursV2_Original;
            result[department][type].totalBurdenV2 += burdenV2;
            result[department][type].totalActualV2 += actualV2;
        });
        const scriptParameter = JSON.stringify({
            path: "chart.render.labour",
            result,
        });
        // Assuming you have a way to call a script or navigate to a chart, for example:
        FileMaker.PerformScript("js * callbacks", scriptParameter);
        return result;
}

window.sumPOLINES = (json) => {
    // provides array ob of objects where key is total for each vendor of a provided job. 
    // Assumes data prefiltered if desired (Does not filter for POLINE type.)
    // assumes all from the same job
    // expects data consistent with dataAPI call to dapiPOLINES for a given job
    // [
        // 	{
        // 		"fieldData" : 
        // 		{
        // 			"JOBS::JobNum" : 4446,
        // 			"flag_POtype" : 1,
        // 			"id_job" : "446F288C-BA35-9D46-8E4B-0FB092FB6C9D",
        // 			"id_vendor" : "",
        // 			"total_cad" : 213.6,
        // 			"vendorName_a" : "MORTON"
        // 		},
        // 		"modId" : "9",
        // 		"portalData" : {},
        // 		"recordId" : "26259"
        // 	},
    data = JSON.parse(json)
    console.log('sumPOLINES',{data})
    const result = {};
    data.forEach(item => {
        const { vendorName_a, total_cad} = item.fieldData;
        const jobNum = item.fieldData["JOBS::JobNum"]
        const vendor = item.fieldData["jobs_POLINES_PO::vendorName_a"] || "Undefined"
        
        // If the department doesn't exist, initialize it
        if (!result[jobNum]) {
            result[jobNum] = {};
        }
        
        // If the type within the department doesn't exist, initialize it
        if (!result[jobNum][vendor]) {
            result[jobNum][vendor] = { total: 0};
        }
        
        // Accumulate the values for hoursV2_Original, burdenV2, and actualV2 for each type within the department
        result[jobNum][vendor].total += total_cad;
    });
    const scriptParameter = JSON.stringify({
        path: "chart.render.costResource",
        result,
    });
    // Assuming you have a way to call a script or navigate to a chart, for example:
    FileMaker.PerformScript("js * callbacks", scriptParameter);
    return result;
}

window.transformJobPerformance = async (json) => {
    console.log('init transformJobPerformance')
    const data = JSON.parse(json);
    console.log('data: ',data)
    const resultsPath = data.setResultsTo;
    const jobs = await performanceJobs(data.data).catch(e => console.error("Error in performanceJobs:", e));
    const jobsData = jobs.jobObject;
    console.log({jobsData})
    const scriptParameter = JSON.stringify({
        path: "storeData",
        resultsPath,
        jobsData
    });
    FileMaker.PerformScript("jobPerformance * transformData * jsCallBack", scriptParameter);
}

//showLoadingAnimation()
//clearLoadingAnimation()
//loadJobTracker(JSON.stringify(jobsData))
// transformAndLoadJobPerformance(JSON.stringify({data: jobsObject,columns: jobObjectColumns,elements: jobObjectElements}))
console.log('E&M UI 2.0.16') 