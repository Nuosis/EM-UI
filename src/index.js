import {Tracker} from "./TrackerApp";
import React from "react";
import { createRoot } from "react-dom/client";

import jobsData from './data/jobs.json';

/*
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Tracker jobs = {jobs}/>);
*/
window.loadTracker = () => {
    const jobs = jobsData.response.data
    console.log(jobs)
    //const data = JSON.parse(jobs) 
    console.log('init loadTracker')    // Log the data type of jobs
    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(<Tracker jobs={jobs} />);
}

loadTracker()