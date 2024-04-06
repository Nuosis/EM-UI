import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useTableContext } from './TableState';
import { icons } from '../src/icons'; 
import { ApprovedButton, ApproveButton, ButtonWithText } from '../src/icons'; 

export default function LoadTableBody({ data, columns }) {
    const { searchTerm, filterTerm, sort, setSort } = useTableContext();
    //const initializedSort = useRef(false); // Tracks if initial sort state is set
    //console.log("dataProvided:", data);
    //console.log("Current searchTerm:", searchTerm);
    //console.log("Current filterTerm:", filterTerm);
    console.log("initTableBody");
    console.log("data ",data);
    console.log("columns ",columns);

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
        const searchableValues = columns
            .filter(column => column.searchable)
            .flatMap(column => { // Use flatMap to handle nested structures
                if (column.type === 'array') {
                    // If it's an array, return a new array of strings from each value
                    return column.values.map(arrayValue => {
                        const nestedItemValue = item[arrayValue.field];
                        return nestedItemValue ? nestedItemValue.toString().toLowerCase() : '';
                    });
                } else {
                    // For non-array types, just return the single string value
                    const itemValue = item[column.field];
                    return itemValue ? itemValue.toString().toLowerCase() : '';
                }
            })
            .join(' ');
    
        // Check if any of the searchable values includes the searchTerm
        return searchableValues.includes(searchTerm.toLowerCase());
    });
    ;
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

    const componentMap = {
        ApprovedButton: ApprovedButton,
        ApproveButton: ApproveButton,
        ButtonWithText: ButtonWithText,
    };

    const handleCellClick = (callbackPath, record) => {
        const scriptParameter = JSON.stringify({
            path: callbackPath,
            record
        });
        FileMaker.PerformScript("MyPage * JScallbacks", scriptParameter);
    };

    const handleSubTableCellClick = (callBackPath, record, subKey) => {
        const scriptParameter = JSON.stringify({
            path: callBackPath,
            record,
            subKey
        });
        // Assuming you have a way to call a script or navigate to a chart, for example:
        FileMaker.PerformScript("MyPage * JScallbacks", scriptParameter);
    }

    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) || '';
    }
    function getDynamicValueByPath(item, valuePathTemplate, subKey) {
        // Extract the object name from the path (e.g., 'labour' from 'labour.[key].budgetHours')
        const objNameMatch = valuePathTemplate.match(/(\w+)\.\[key\]/);
        if (!objNameMatch) return null;
    
        const objName = objNameMatch[1]; // This is 'labour'
        // Replace the placeholder '[key]' with the actual subKey and '[objName]' with the actual object name
        const pathWithObjNameAndKey = valuePathTemplate.replace('[objName]', objName).replace('[key]', subKey);
        // Now get the value by the new path
        return getValueByPath(item, pathWithObjNameAndKey) || 0;
    }
    

    function formatCurrency(value) {
        // If the value is null, undefined, or not a number, default it to 0
        const number = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        // Format the number as currency
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
    

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
                                        <button onClick={() => FileMaker.PerformScript("js * callbacks", scriptParameter)}>
                                            {IconComponent}
                                        </button>
                                    </td>
                                );
                            } else if(column.type === 'component' && column.compairColumn) {
                                const ComponentToRender = item[column.compairColumn] ? componentMap[column.ifTrue] : componentMap[column.ifFalse];
                                console.log("ComponentToRender:", ComponentToRender.name);
                                const scriptParameter = JSON.stringify({
                                    path: column.callBackPath, // Adjust as needed
                                    record: item
                                });
                                return (
                                    <td key={colIndex} className="p-2">
                                        <ComponentToRender onClick={() => FileMaker.PerformScript("js * callbacks", scriptParameter)} />
                                    </td>
                                );
                            } else if(column.type === 'component' && column.componentName === 'ButtonWithText') {
                                // Use the specified component
                                const Component = componentMap[column.componentName];
                                if (!Component) {
                                    console.error("Component not found for name:", column.componentName);
                                    return null; // or some fallback UI
                                }
                                const textProp = column.text;
                                //console.log("TextToRender:", textProp);
                                const scriptParameter = JSON.stringify({
                                    path: column.callBackPath, // Adjust as needed
                                    record: item
                                });
                                return (
                                    <td key={colIndex} className="p-2">
                                        <Component text={textProp} onClick={() => FileMaker.PerformScript("js * callbacks", scriptParameter)} />
                                    </td>
                                );
                            } else if(column.type === 'component' && column.component) {
                                // Use the specified component
                                const Component = componentMap[column.componentName];
                                const scriptParameter = JSON.stringify({
                                    path: column.callBackPath, // Adjust as needed
                                    record: item
                                });
                                return (
                                    <td key={colIndex} className="p-2">
                                        <Component onClick={() => FileMaker.PerformScript("js * callbacks", scriptParameter)} />
                                    </td>
                                );
                            } else if (column.type === 'array') {
                                return (
                                    <td key={colIndex} className="p-2">
                                        {column.values.map((value, valueIndex) => {
                                            // Get the value based on the path
                                            let cellValue = getValueByPath(item, value.field);
                            
                                            // Check for contentType and format accordingly
                                            if (column.contentType === 'currency') {
                                                cellValue = formatCurrency(cellValue);
                                            }
                                            // Add else if blocks here for other contentTypes if necessary
                            
                                            return (
                                                <div key={valueIndex} className="sub-row">
                                                    {value.label && <strong>{value.label}:</strong>} {cellValue}
                                                </div>
                                            );
                                        })}
                                    </td>
                                );
                            } else if(column.type === 'subTableHeaders') {
                                return (
                                    <td key={colIndex} className="p-2">
                                        {column.values.map((value, valueIndex) => (
                                            <div
                                                key={valueIndex}
                                                className="sub-row"
                                                style={{ color: value === '_' ? 'transparent' : 'inherit' }}
                                            >
                                                <strong>{value}</strong>
                                            </div>
                                        ))}
                                    </td>
                                );
                            } else if (column.type === 'subTableBody') {
                                // First, determine the object name (e.g., 'labour' or 'material') from the first entry in the values array
                                const objNameMatch = column.values[0].match(/^(\w+)\.\[key\]/);
                                if (!objNameMatch) {
                                    console.error('Invalid column value format:', column.values[0]);
                                    return null; // or some fallback UI
                                }
                                const objName = objNameMatch[1];
                            
                                // Now map over the keys of the specified object in the item
                                return Object.keys(item[objName]).map((subKey, subIndex) => {
                                    return (
                                        <React.Fragment key={subIndex}>
                                            <td className="p-2">
                                                <div
                                                    className={`sub-table-header ${column.clickable ? 'clickable' : ''}`}
                                                    onClick={() => column.clickable ? handleSubTableCellClick(column.callBackPath, item, subKey) : null}
                                                    style={{ cursor: 'pointer' }}
                                                >{subKey}</div>
                                                {column.values.map((valueTemplate, valueIndex) => {
                                                    let cellValue = getDynamicValueByPath(item, valueTemplate, subKey);
                                                    let isNegative = typeof cellValue === 'number' && cellValue < 0;
                                                    
                                                    // Check for contentType and format accordingly
                                                    if (column.contentType === 'currency') {
                                                        cellValue = formatCurrency(cellValue);
                                                    }
                            
                                                    return (
                                                        <div
                                                            key={valueIndex}
                                                            className="sub-table-cell"
                                                            style={{ backgroundColor: isNegative ? '#ffcccc' : 'transparent' }}
                                                        >
                                                            {cellValue}
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                        </React.Fragment>
                                    );
                                });
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

