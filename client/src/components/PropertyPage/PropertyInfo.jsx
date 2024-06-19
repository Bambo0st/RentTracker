// PropertyInfo.jsx

import React from 'react';

const PropertyInfo = ({ property }) => {
    return (
        <div>
            {property && (
                <>
                    <h2 className="text-2xl font-bold text-center mb-6">{property.name}</h2>
                    <p className="text-lg text-center mb-4">{property.address}</p>
                </>
            )}
        </div>
    );
};

export default PropertyInfo;
