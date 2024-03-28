import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useTableContext } from './TableState';
import { icons } from '../src/icons'; 

export default function LoadTableBody({ data, columns }) {
    const { searchTerm, filterTerm, sort, setSort } = useTableContext();
    //const initializedSort = useRef(false); // Tracks if initial sort state is set
    //console.log("dataProvided:", data);
    //console.log("Current searchTerm:", searchTerm);
    //console.log("Current filterTerm:", filterTerm);

    useLayoutEffect(() => {
        if (!sort.column) {
            const sortedColumn = columns.find(col => col.sorted === true);
            if (sortedColumn) {
                setSort({ column: sortedColumn.field, direction: 'asc' }); // Assuming initial sort direction is ascending
            }
        }
        // This should ideally only run once on initial mount
    }, [columns, setSort, sort.column]);

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

    // Implement sorting
    const sortedData = React.useMemo(() => {
        if (!sort.column || !data) return filteredData; // Ensure data is ready and a sort column is set
        // console.log("Applying sort:", sort);
        return [...filteredData].sort((a, b) => {
            // Ensure to check for null or undefined values in your sort logic
            const valueA = a[sort.column];
            const valueB = b[sort.column];
            if (valueA < valueB) return sort.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sort]); 

    const handleCellClick = (callbackPath, record) => {
        const scriptParameter = JSON.stringify({
            path: callbackPath,
            record
        });
        FileMaker.PerformScript("MyPage * JScallbacks", scriptParameter);
    };

    return (
    <div className="max-h-screen overflow-y-auto"> {/* Adjust the max height as needed */}
        <table className="w-full text-left table-auto">
            <thead className="bg-neutral-800 text-neutral-400 sticky top-0">
                <tr>
                    {columns.map((column, index) => 
                        !column.hidden && (
                            <th key={index} onClick={() => column.sortable && setSort(column.field)} 
                                className={`p-2 cursor-pointer ${index !== columns.length - 1 ? 'border-r border-neutral-600' : ''} sticky top-0`}>
                                {column.label}
                                {sort.column === column.field && (sort.direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                        )
                    )}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((item, rowIndex) => {
                    const key = indexColumn ? item[indexColumn.field] : rowIndex;
                    const isEvenRow = rowIndex % 2 === 0;
                    return (
                    <tr key={key} style={{ backgroundColor: isEvenRow ? 'white' : 'transparent' }}>
                        {columns.map((column, colIndex) => {
                            // console.log("Rendering column:", column.label);
                            if (column.hidden) {
                                return null;
                            }

                            let cellContent = item[column.field];

                            if (column.type === 'button' && column.icon) {
                                // Use the SVG from your icons file
                                const IconComponent = icons[column.icon];
                                const scriptParameter = JSON.stringify({
                                    path: column.callBackPath, // Adjust as needed
                                    record: item
                                });
                                return (
                                    <td key={colIndex} className="p-2">
                                        <button onClick={() => FileMaker.PerformScript("MyPage * JScallbacks", scriptParameter)}>
                                            {IconComponent}
                                        </button>
                                    </td>
                                );
                            } else if(column.type === 'component' && column.compairColumn) {
                                const ComponentToRender = item[column.compairColumn] ? column.ifTrue : column.ifFalse;
                                console.log("ComponentToRender:", ComponentToRender.name);
                                const scriptParameter = JSON.stringify({
                                    path: column.callBackPath, // Adjust as needed
                                    record: item
                                });
                                return (
                                    <td key={colIndex} className="p-2">
                                        <ComponentToRender onClick={() => FileMaker.PerformScript("MyPage * JScallbacks", scriptParameter)} />
                                    </td>
                                );
                            } else if(column.type === 'component' && column.component) {
                                    // Use the specified component
                                    const Component = column.component;
                                    const scriptParameter = JSON.stringify({
                                        path: column.callBackPath, // Adjust as needed
                                        record: item
                                    });
                                    return (
                                        <td key={colIndex} className="p-2">
                                            <Component onClick={() => FileMaker.PerformScript("MyPage * JScallbacks", scriptParameter)} />
                                        </td>
                                    );
                            } else {
                                // Render cell normally for 'text' type columns
                                const value = item[column.field];
                                const cellContent = column.clickable ? (
                                    <div
                                        onClick={() => handleCellClick(column.callbackPath, item)}
                                        style={{ cursor: 'pointer' }}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        {value}
                                    </div>
                                ) : (
                                    value
                                );
                                return <td key={colIndex} className="p-2">{cellContent}</td>;
                            }
                        })}
                    </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
    );
}

