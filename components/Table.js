import React from 'react';
import '../src/style.css';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Table({jobs}) {
    console.log(jobs)
    return (
        <div className="table-container">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="title-header">Jobs</h1>
                    <p className="description-text">
                        All active Jobs
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th scope="col" className="table-header">
                                        {/* Empty header for '>' icon, will set onClick later */}
                                    </th>
                                    <th scope="col" className="table-header">
                                        {/* Empty header for image column */}
                                    </th>
                                    <th scope="col" className="table-header">WO Type</th>
                                    <th scope="col" className="table-header">Job Number</th>
                                    <th scope="col" className="table-header">Customer</th>
                                    <th scope="col" className="table-header">Part Name</th>
                                    <th scope="col" className="table-header">Tool Number</th>
                                    <th scope="col" className="table-header">Mold Description</th>
                                    <th scope="col" className="table-header">Kickoff Date</th>
                                    <th scope="col" className="table-header">Timing</th>
                                    <th scope="col" className="table-header">Commitment Date</th>
                                    <th scope="col" className="table-header">Remaining Days</th>
                                    <th scope="col" className="table-header">% Complete</th>
                                    <th scope="col" className="table-header">Status</th>
                                    <th scope="col" className="table-header">Notes</th>
                                    <th scope="col" className="table-header">Program Manager</th>
                                    <th scope="col" className="table-header">Mold Maker</th>
                                    <th scope="col" className="table-header">CAD Designer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, jobIdx) => {
                                
                                console.log('Logging job:', job);
                                
                                return (
                                    
                                    <tr key={job.fieldData['id']}>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {/* Here, add your '>' icon or button */}
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            <img src={job["jobs_IMG__Images::Image"]} alt="Job" />
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Workorder Type'] != null ? job.fieldData['Workorder Type']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['JobNumText'] != null ? job.fieldData['JobNumText']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['CustomerName'] != null ? job.fieldData['CustomerName']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Part Name'] != null ? job.fieldData['Part Name']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['ToolNumber'] != null ? job.fieldData['ToolNumber']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['mold_description_a'] != null ? job.fieldData['mold_description_a']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Tool_Kickoff Date'] != null ? new Date(job.fieldData['Tool_Kickoff Date']).toLocaleDateString():''}
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Tool_Timming'] != null ? new Intl.NumberFormat().format(job.fieldData['Tool_Timming']):''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Tool_CommitmentDate'] != null ? new Date(job.fieldData['Tool_CommitmentDate']).toLocaleDateString():''}
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Tool_DaysRemaining'] != null ? job.fieldData['Tool_DaysRemaining']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Percentage Complete'] != null ? `${(job.fieldData['Percentage Complete'] * 100).toFixed(2)}%` : ''}
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['status'] != null ? job.fieldData['status']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Description'] != null ? job.fieldData['Description']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Program Manager'] != null ? job.fieldData['Program Manager']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Moldmaker'] != null ? job.fieldData['Moldmaker']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['CAD Designer'] != null ? job.fieldData['CAD Designer']:''} 
                                        </td>
                                        
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}  