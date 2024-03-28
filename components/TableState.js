import React, { createContext, useContext, useState } from 'react';

const TableContext = createContext();

export function useTableContext() {
    return useContext(TableContext);
}

export const TableProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');
    const [sort, setSort] = useState({ column: null, direction: 'asc' });

    // Directly log within the setters if needed
    const handleSetSearchTerm = (value) => {
        console.log("Updating searchTerm:", value); // Log the new searchTerm
        setSearchTerm(value);
    };

    const handleSetFilterTerm = (value) => {
        console.log("Updating filterTerm:", value); // Log the new filterTerm
        setFilterTerm(value);
    };

    // Add a method to update the sort state
    const handleSetSort = (columnName) => {
        console.log("Updating sortCondition:", columnName); 
        setSort(currentSort => {
            // If the current sort column is the same as the new, toggle the direction, else set to 'asc'
            const direction = currentSort.column === columnName ? (currentSort.direction === 'asc' ? 'desc' : 'asc') : 'asc';
            return { column: columnName, direction };
        });
    };
    
    // Function to reset all filters and searches
    const resetTableFilters = () => {
        console.log("Resetting filters and searches"); // Optionally log the reset action
        setSearchTerm('');
        setFilterTerm('');
        // Reset sort criteria as well if implemented
    };

    return (
        <TableContext.Provider value={{
            searchTerm, 
            setSearchTerm: handleSetSearchTerm, 
            filterTerm, 
            setFilterTerm: handleSetFilterTerm, 
            sort,
            setSort: handleSetSort,
            resetTableFilters
        }}>
            {children}
        </TableContext.Provider>
    );
};
