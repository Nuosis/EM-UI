// icons.js
import React from 'react';

export const icons = {
    delete24: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B0000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
    ),
    //approve: (
        // Add your "approve" SVG here
    //),
    // Define other icons as needed
};

export const ApproveButton = ({ onClick }) => (
    <button onClick={onClick} style={{
        backgroundColor: '#4CAF50', // Green background
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px', // Space between text and icon
    }}>
        Approve
    </button>
);

export const ApprovedButton = ({ onClick }) => (
    <button onClick={onClick} style={{
        backgroundColor: '#FFCA28', // Green background
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px', // Space between text and icon
    }}>
        Approved
    </button>
);
