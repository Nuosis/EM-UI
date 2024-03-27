import React, { createContext, useContext, useState } from 'react';

const TableContext = createContext();

export function useTableContext() {
    return useContext(TableContext);
}

export const TableProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState(null); // Placeholder for sort implementation

    // Function to reset all filters and searches
    const resetTableFilters = () => {
        setSearchTerm('');
        setFilterTerm('');
        // Reset sort criteria as well if implemented
    };

    return (
        <TableContext.Provider value={{ searchTerm, setSearchTerm, filterTerm, setFilterTerm, sortCriteria, setSortCriteria, resetTableFilters }}>
        {children}
        </TableContext.Provider>
    );
};
