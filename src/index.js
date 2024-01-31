import LoadJobsTable from "../components/JobsTable";
import React from "react";
import { createRoot } from "react-dom/client";

//import jobsData from './data/jobs.json';

/*
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Tracker jobs = {jobs}/>);
*/
window.loadTracker = (json) => {
    console.log('init loadTracker')
    const data = JSON.parse(json); //in FM I am passing in only the data array
    const jobs = data.jobs
    const hostIP = data.hostIP
    console.log(`hostIP: ${hostIP}`)
    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(
        <div id="jobsTable" className="container w-full columns-2 flex flex-col">
            <LoadJobsTable data = {jobs} hostIP= {hostIP}/>
        </div>);
}
console.log('init 1.02.02') 
//loadTracker(jobsData.response.data)