import React from 'react';

export default function LoadTableHeader({ headings }) { 
    return (
        <div className="flex flex-row bg-neutral-800 px-4">
            {headings.map((heading, index) => (
                <div key={index}
                className={`header-item p-2 ${index !== headings.length - 1 ? 'border-r border-neutral-600' : ''} text-neutral-400`}> 
                {heading.label}
                </div>
            ))}
        </div>
    );
}
