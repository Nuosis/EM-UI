import React, { useState } from "react";
import Table from "../components/Table";
import jobsData from '../src/data/jobs.json';

const jobs = jobsData.response.data

const MyApp = () => {
  const [btn, setBtn] = useState("");
  return (
    <>
      <div id="jobsTable" className="container w-full columns-17 flex flex-row gap-2">
        <Table jobs = {jobs}/>
      </div>
    </>
  );
};

export default MyApp;
