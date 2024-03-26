import React from 'react';
import LoadTableHeader from './TableHeader';

export default function LoadTableBody({ data, columns }) { 
    return (
        <>
            <LoadTableHeader headings={columns}/>
            data in table view
        </>
    );
}