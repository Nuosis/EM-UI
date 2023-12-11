import React, { useState } from "react";
import LoadJobsTable from "../components/JobsTable";

export const Tracker = ({jobs}) => {
  console.log('init Tracker')
  return (
    <>
      <div id="jobsTable" className="container w-full columns-2 flex flex-col">
        <LoadJobsTable data = {jobs}/>
      </div>
    </>
  );
};
