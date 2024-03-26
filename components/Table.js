import React from 'react';
import LoadTableBody from './TableBody';
import LoadTableManagement from './TableManagement'; // Make sure the import matches the component name

// const elements = [
//     { objectType: 'search', scope: 'all' },
//     { objectType: 'filter', scope: 'date' },
//     { objectType: 'sort', scope: ['name', 'date'] },
// ];

// const columns = [
//     { label: 'ID', filterable: false, searchable: false, sortable: false, hidden: true, field: 'id' },
//     { label: 'Date', filterable: true, searchable: true, sortable: true, field: 'zCreationTimestamp' },
//     { label: 'Employee', filterable: true, searchable: true, sortable: true, field: 'employeeName_a'  },
//     { label: 'Job', filterable: true, searchable: true, sortable: true, field: 'jobDescription_a'  },
//     { label: 'Hours Worked', filterable: false, searchable: false, sortable: true, field: 'totalHoursWorked_c'  }
// ];

export default function LoadTable({ data, elements, columns }) { 
    return (
        <>
            <div id="Table" className="w-full flex flex-col gap-4">
                <LoadTableManagement elements={elements}/>
                <LoadTableBody data={data} columns={columns}/>
            </div>
        </>
    );
}
