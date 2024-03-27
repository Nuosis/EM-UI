import React from 'react';
import LoadTableBody from './TableBody';
import LoadTableManagement from './TableManagement';
import { TableProvider } from './TableState';

export default function LoadTable({ data, elements, columns }) { 
    // console.log('Data in LoadTable:', data);
    return (
        <TableProvider>
            <div id="Table" className="w-full flex flex-col">
                <LoadTableManagement elements={elements}/>
                <LoadTableBody data={data} columns={columns}/>
            </div>
        </TableProvider>
    );
}
