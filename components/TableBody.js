import React from 'react';
import { useTableContext } from './TableState';

export default function LoadTableBody({ data, columns }) {
    const { searchTerm, filterTerm } = useTableContext();
    //console.log("dataProvided:", data);
    //console.log("Current searchTerm:", searchTerm);
    //console.log("Current filterTerm:", filterTerm);

    const indexColumn = columns.find(col => col.index);

    const searchData = data.filter(item => {
        // Combine all searchable column values into a single string for each row
        const searchableValues = columns
            .filter(column => column.searchable) // Ensure you have a 'searchable' property on columns that can be searched
            .map(column => item[column.field].toString().toLowerCase())
            .join(' ');

        // Return true if any searchableValue includes the searchTerm
        return searchableValues.includes(searchTerm.toLowerCase());
    });
    //console.log("dataAfterSearch:", searchData);

    // Then, conditionally apply the filter to omit matches if filterTerm is not empty
    const filteredData = searchData.filter(item => {
        if (!filterTerm) return true; // If filterTerm is null or empty, allow everything
        const filterableValues = columns
            .filter(column => column.filterable)
            .map(column => item[column.field]?.toString().toLowerCase() || "")
            .join(' ');
        return !filterableValues.includes(filterTerm.toLowerCase()); // Use '!' to omit matches
    });

    return (
    <div className="max-h-screen overflow-y-auto"> {/* Adjust the max height as needed */}
        <table className="w-full text-left table-auto">
            <thead className="bg-neutral-800 text-neutral-400 sticky top-0">
                <tr>
                    {columns.map((column, index) => 
                    !column.hidden && (
                        <th key={index} className={`p-2 ${index !== columns.length - 1 ? 'border-r border-neutral-600' : ''} sticky top-0`}>
                            {column.label}
                        </th>
                    )
                    )}
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item, rowIndex) => {
                    const key = indexColumn ? item[indexColumn.field] : rowIndex;
                    return (
                    <tr key={key}>
                        {columns.map((column, colIndex) => {
                        if (!column.hidden) {
                            const value = item[column.field];
                            return <td key={colIndex} className="p-2">{value}</td>;
                        }
                        return null;
                        })}
                    </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
    );
}

