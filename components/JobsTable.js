import React, { useState, useEffect, useMemo } from 'react';
// import '../src/style.css';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
};

export default function LoadJobsTable({data}) {  
    const jobs = data; 
    const [sortFields, setSortFields] = useState([]); // expected value example "[{field: 'Job Number', direction:'Asc'}]"
    const [sortedJobs, setSortedJobs] = useState([...jobs]);
    const columns = useMemo(() => [
        {field: '', label: '', sort: false, filter: false},
        {field: 'jobs_IMG_Images::Image', label: '', sort: false, filter: false},
        {field: 'Workorder Type', label: 'WO Type', sort: true, filter: true},
        {field: 'JobNumText', label: 'Job Number', sort: true, filter: true},
        {field: 'jobs_CUSTOMER::CustomerName', label: 'Customer', sort: true, filter: true},
        {field: 'Part Name', label: 'Part Name', sort: true, filter: true},
        {field: 'ToolNumber', label: 'Tool Number', sort: true, filter: true},
        {field: 'mold_Description_a', label: 'Mold Description', sort: false, filter: false},
        {field: 'Tool_KickoffDate', label: 'Kickoff Date', sort: true, filter: true},
        {field: 'Tool_Timming', label: 'Timing', sort: true, filter: false},
        {field: 'Tool_ComitmentDate', label: 'Commitment', sort: true, filter: true},
        {field: 'Tool_DaysRemaining', label: 'Days', sort: true, filter: false},
        {field: 'Percentage Complete', label: '% Complete', sort: true, filter: false},
        {field: 'status', label: 'Status', sort: true, filter: true},
        {field: 'Description', label: 'Notes', sort: false, filter: false},
        {field: 'Program Manager', label: 'Prog. Man', sort: true, filter: true},
        {field: 'MoldMaker', label: 'Mold Maker', sort: true, filter: true},
        {field: 'Cad Designer', label: 'CAD Designer', sort: true, filter: true},
    ], []);

    const [filters, setFilters] = useState(() => {
        const initialFilters = {};
        columns.forEach(column => {
            if (column.filter) {
                initialFilters[column.field] = [];
            }
        });
        return initialFilters;
    });

    // Function to initialize filter values
    const initializeFilterValues = () => {
        const initialFilterValues = {};
        columns.forEach(column => {
            if (column.filter) {
                initialFilterValues[column.field] = '';
            }
        });
        return initialFilterValues;
    };

    // Initialize selectedFilterValues state
    const [selectedFilterValues, setSelectedFilterValues] = useState(initializeFilterValues);

    // Function to add a new sort field
    const addSortField = (newField, newDirection) => {
        console.log('newField:', newField, 'newDir:',newDirection, 'sortFieldState:', sortFields)
        // Check if the field already exists in the sortFields array
        const existingFieldIndex = sortFields.findIndex(sortField => sortField.field === newField);
    
        if (existingFieldIndex !== -1) {
            // Update the direction of the existing field
            const updatedSortFields = [...sortFields];
            updatedSortFields[existingFieldIndex] = { ...updatedSortFields[existingFieldIndex], direction: newDirection };
            setSortFields(updatedSortFields);
        } else {
            // Add the new sort criteria to the array
            setSortFields([...sortFields, { field: newField, direction: newDirection }]);
        }
    };
    

    // Function to remove a sort field
    const clearSortField = (fieldToRemove) => {
        // Filter out the sort criteria that needs to be removed
        setSortFields([]);
    };

    
    // Helper function to get the value from the job object based on the field
    const getValueByField = (job, field) => {
        // This function would extract nested fields too if necessary
        return field.split('.').reduce((obj, key) => (obj && obj[key] != null) ? obj[key] : null, job);
    };
    
    // A generic compare function that handles strings, numbers, and dates
    const compareFunction = (a, b, fieldType, direction) => {
        const aValue = getValueByField(a, fieldType);
        const bValue = getValueByField(b, fieldType);
        
        // Handle if one or both values are null or undefined
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return direction === 'Asc' ? -1 : 1;
        if (bValue == null) return direction === 'Asc' ? 1 : -1;
        
        // Handle dates
        if (fieldType.toLowerCase().includes('date')) {
            const dateA = new Date(aValue);
            const dateB = new Date(bValue);
            return direction === 'Asc' ? dateA - dateB : dateB - dateA;
        }
        // Handle numbers
        else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return direction === 'Asc' ? aValue - bValue : bValue - aValue;
        }
        // Handle strings
        else if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === 'Asc' ? aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' }) : bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' });
        }
        // If types are mixed or other types, convert to strings to compare
        else {
            return direction === 'Asc' ? String(aValue).localeCompare(String(bValue), undefined, { numeric: true, sensitivity: 'base' }) : String(bValue).localeCompare(String(aValue), undefined, { numeric: true, sensitivity: 'base' });
        }
    };
    

    const handleFilterChange = (field, value) => {
        setSelectedFilterValues(prevValues => ({
            ...prevValues,
            [field]: value
        }));
    };

    const handleRowClick = (id) => {
        console.log('handleRowClicked');
        const scriptName = "MyPage * JScallbacks";
        const obj = {type:'jobsTracker.goToCustomer', ID: id};
        const scriptParameter = JSON.stringify(obj);
        console.log(scriptParameter);
        FileMaker.PerformScript(scriptName, scriptParameter);
    };
    

    // Function to clear all filters
    const clearFilters = () => {
        setSelectedFilterValues(initializeFilterValues());
    };

    

    useEffect(() => {
        //console.log('useEffect Initiated');
        //console.log('Initial jobs:', [...jobs]);
        //console.log('Selected Filter Values:', selectedFilterValues);
    
        let filteredData = [...jobs];
        
        // Apply filters
        Object.keys(selectedFilterValues).forEach(field => {
            const selectedValue = selectedFilterValues[field];
            //console.log(`Filtering on ${field} with value:`, selectedValue);
    
            if (selectedValue) {
                //console.log(`Before filtering ${field}:`, filteredData);
                filteredData = filteredData.filter(job => {
                    console.log(`Comparing ${job.fieldData[field]} with ${selectedValue}`);
                    return job.fieldData && job.fieldData[field] === selectedValue;
                });
                //console.log(`After filtering ${field}:`, filteredData);
            }
        });
    
        //console.log('Filtered data before sorting:', filteredData);
    
        // Apply sorting    
        const sortedData = filteredData.sort((a, b) => {
            let result = 0;
            for (let { field, direction } of sortFields) {
                result = compareFunction(a.fieldData, b.fieldData, field, direction);
                if (result !== 0) break;
            }
            return result;
        });
    
        //console.log('Sorted data:', sortedData);
        setSortedJobs(sortedData);
    }, [jobs, sortFields, selectedFilterValues]);
    
    
    useEffect(() => {
        const newFilters = {};
        columns.forEach(column => {
            if (column.filter) {
                // Use the getValueByField function to access the nested values
                const filterValues = jobs.map(job => getValueByField(job.fieldData, column.field));
                const uniqueFilterValues = [...new Set(filterValues)].filter(Boolean); // Filter out null and undefined values
                newFilters[column.field] = uniqueFilterValues;
            }
        });
        setFilters(newFilters); // Set the filters state with the new values
    }, [jobs]); // Depend on the jobs array, which contains the data    
    


    return (
        <>
        {/*--
        <div className="header">

            <div className="flex items-center justify-between p-4 w-full columns-2">

                <div className="title-container">
                    Job Tracker
                </div>

                <div className="nav-container">
                    <nav className="flex justify-center">
                        <a href="#" className="header-button header-button-left">Menu</a>
                        <a href="#" className="header-button">Jobs</a>
                        <a href="#" className="header-button">Service</a>
                        <a href="#" className="header-button">Quotes</a>
                        <a href="#" className="header-button">Customers</a>
                        <a href="#" className="header-button">Vendors</a>
                        <a href="#" className="header-button">Purchase Orders</a>
                        <a href="#" className="header-button header-button-right">Print</a>
                    </nav>
                </div>
            </div>
        </div>--*/}

        <div className="table-container">
            <div className="flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                {/* First row for column titles */}
                                <tr className = "table-header-row">
                                    {columns.map((column, index) => (
                                        <th scope="col" className="table-header" key={index}>
                                            {/* Render the clear sort button in the second column */}
                                            {index === 1 && (
                                            <button onClick={clearSortField} className="clear-sort-button">
                                                Clear Sort
                                            </button>
                                            )}
                                            {/* Sort icons (only if sort is true) */}
                                            {column.sort && (
                                                <div className="sorting-icons">
                                                    {/* Up arrow */}
                                                    <svg onClick={() => addSortField(column.field, 'Asc')}
                                                        className="sort-arrow"
                                                        width="12" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                        stroke={sortFields.some(sf => sf.field === column.field && sf.direction === 'Asc') ? "blue" : "currentColor"}
                                                        strokeWidth={sortFields.some(sf => sf.field === column.field && sf.direction === 'Asc') ? "3" : "1"}
                                                        strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 5v14M19 12l-7-7-7 7"/>
                                                    </svg>
                                                    {/* Down arrow */}
                                                    <svg onClick={() => addSortField(column.field, 'Desc')}
                                                        className="sort-arrow"
                                                        width="12" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                        stroke={sortFields.some(sf => sf.field === column.field && sf.direction === 'Desc') ? "blue" : "currentColor"}
                                                        strokeWidth={sortFields.some(sf => sf.field === column.field && sf.direction === 'Desc') ? "3" : "1"}
                                                        strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 19V5m7 7l-7 7-7-7"/>
                                                    </svg>
                                                </div>
                                            )}
                                            {/* Column label */}
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                                {/* Second row for filter inputs */}
                                <tr className="filter-row">
                                    {columns.map((column, index) => (
                                        <th key={index}>
                                            {column.filter && Array.isArray(filters[column.field]) && (
                                                <select
                                                    value={selectedFilterValues[column.field]}
                                                    onChange={(e) => handleFilterChange(column.field, e.target.value)}
                                                    className="filter-input"
                                                >
                                                    <option value=""></option>
                                                    {filters[column.field].map((value, i) => (
                                                        <option key={i} value={value}>
                                                            {value}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {index === 1 && (
                                                <button onClick={clearFilters} className="clear-filter-button">
                                                    Clear Filter
                                                </button>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedJobs.map((job, jobIdx) => {
                                
                                //console.log('Logging job:', job);
                                
                                return (
                                    
                                    <tr key={job.fieldData['id']}>
                                        <td 
                                            className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}
                                            style={{ maxWidth: '40px' }}
                                        >
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                onClick={() => handleRowClick(job.fieldData['id'])}>
                                                <path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")} style={{ minWidth: '120px' }}>
                                            {job.fieldData?.["jobs_IMG__Images::Image"] ? (
                                                <img src={job.fieldData["jobs_IMG__Images::Image"]} alt='Job Image' />
                                            ) : (
                                                <span>No Image</span> // Or render a default image
                                            )}
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData?.['Workorder Type'] ?? ''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['JobNumText'] != null ? job.fieldData['JobNumText']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['jobs_CUSTOMER::CustomerName'] != null ? job.fieldData['jobs_CUSTOMER::CustomerName']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Part Name'] != null ? job.fieldData['Part Name']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['ToolNumber'] != null ? job.fieldData['ToolNumber']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['mold_Description_a'] != null ? job.fieldData['mold_Description_a']:''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Tool_KickoffDate'] != null ? new Date(job.fieldData['Tool_KickoffDate']).toLocaleDateString():''}
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Tool_Timming'] != null ? new Intl.NumberFormat().format(job.fieldData['Tool_Timming']):''} 
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Tool_ComitmentDate'] != null ? new Date(job.fieldData['Tool_ComitmentDate']).toLocaleDateString():''}
                                        </td>
                                        <td className={classNames(
                                            jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '',
                                            "table-cell",
                                            job.fieldData['Tool_DaysRemaining'] <= 0 ? 'text-alert' : 
                                            job.fieldData['Tool_DaysRemaining'] <= 7 ? 'text-warn' : ''
                                        )}>
                                            {job.fieldData['Tool_DaysRemaining'] != null ? job.fieldData['Tool_DaysRemaining'] : ''}
                                        </td>
                                        <td className={classNames(jobIdx !== jobs.length - 1 ? 'border-b border-gray-200' : '', "table-cell")}>
                                            {job.fieldData['Percentage Complete'] != null ? `${(job.fieldData['Percentage Complete'] * 100).toFixed(0)}%` : ''}
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
                                            {job.fieldData['Cad Designer'] != null ? job.fieldData['Cad Designer']:''} 
                                        </td>
                                        
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}  