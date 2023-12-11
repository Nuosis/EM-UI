import Tracker from "./trackerApp";
import React from "react";
import { createRoot } from "react-dom/client";
// import jobsData from './data/jobs.json';
// const jobs = jobsData.response.data
/*
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Tracker jobs = {jobs}/>);
*/
window.loadTracker = (jobs) => {
    console.log('init loadTracker')    // Log the data type of jobs
    const container = document.getElementById("root");
    if (!container) return; // Ensure the container is available
    const root = createRoot(container);
    root.render(<Tracker jobs={jobs} />);
} 