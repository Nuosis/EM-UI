import React from 'react';
import { useTableContext } from './TableState';

export default function LoadTableBody({ data, columns }) {
    const { searchTerm, filterTerm } = useTableContext();
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
                {data.map((item, rowIndex) => {
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

