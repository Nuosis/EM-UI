import { Tracker } from "./TrackerApp";
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
    const jobs = JSON.parse(json); //in FM I am passing in only the data array
    //const jobs = obj.response.data
    console.log('init loadTracker')    // Log the data type of jobs
    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(<Tracker jobs={jobs} />);
}
console.log('init 1.01') 
//loadTracker(jobsData.response.data)