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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginBottom: '2px' }}>
            <path d="M13.485 1.55a.7.7 0 0 1 .994.025l.07.08a.7.7 0 0 1-.025.993l-7.297 7.297a.7.7 0 0 1-.888.067l-.08-.067-4.297-4.297a.7.7 0 0 1 .888-1.05l.08.067 3.683 3.683 6.683-6.683z"/>
        </svg>
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
