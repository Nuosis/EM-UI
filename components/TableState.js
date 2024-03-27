import React, { createContext, useContext, useState } from 'react';

const TableContext = createContext();

export function useTableContext() {
    return useContext(TableContext);
}

export const TableProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState(null); // Placeholder for sort implementation

    // Directly log within the setters if needed
    const handleSetSearchTerm = (value) => {
        console.log("Updating searchTerm:", value); // Log the new searchTerm
        setSearchTerm(value);
    };

    const handleSetFilterTerm = (value) => {
        console.log("Updating filterTerm:", value); // Log the new filterTerm
        setFilterTerm(value);
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
            sortCriteria, 
            setSortCriteria, 
            resetTableFilters
        }}>
            {children}
        </TableContext.Provider>
    );
};
