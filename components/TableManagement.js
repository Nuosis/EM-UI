import React, { useState } from 'react';
import { useTableContext } from './TableState'; 

export default function LoadTableManagement({ elements }) {
    const { searchTerm, setSearchTerm, filterTerm, setFilterTerm } = useTableContext();

    // console.log("Current searchTerm:", searchTerm);
    // console.log("Current filterTerm:", filterTerm);

    const renderElement = (element) => {
        switch (element.objectType) {
        case 'search':
            return (
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input px-4 py-2 border rounded-lg focus:outline-none w-full"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

            );
        case 'sort':
            return (<div className="inline-block relative">
                        <select
                        onChange={(e) => console.log('Sort by:', e.target.value)}
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline flex-1"
                        >
                        {element.scope.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
            );
        case 'filter':
            // Assuming a simple text input for filter, implementation might vary
            return (<div className="relative flex items-center">
                        <input
                        type="text"
                        placeholder={`Filter...`}
                        value={filterTerm}
                        onChange={(e) => setFilterTerm(e.target.value)}
                        className="form-input px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent flex-1"
                        />
                        {filterTerm && (
                            <button
                                onClick={() => setFilterTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
            );
        default:
            return null;
        }
    };

    return (
        <div className="flex flex-row-reverse items-center p-4 gap-4 bg-white">
            {elements.map((element, index) => (
                <div key={index} className="last:ml-auto"> {/* Adjust class as needed */}
                    {renderElement(element)}
                </div>
            ))}
        </div>
    );
}
