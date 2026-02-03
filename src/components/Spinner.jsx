import React from 'react';

const Spinner = ({ height, width }) => {
    return <div className={`w-${width || 16} h-${height || 16} border-4 border-[#908471] border-t-[#CAD3AC] rounded-full animate-spin`}></div>;
};

export default Spinner;
