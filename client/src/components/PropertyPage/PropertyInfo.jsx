// PropertyInfo.jsx

import React from 'react';

const PropertyInfo = ({ property }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4 mb-4">
            {property && (
                <>
                    <img
                        src={`https://cityaccommodations.co.uk/wp-content/themes/homely/images/property-img-default.gif`}
                        alt="Property"
                        className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{property.name}</h2>
                        <p className="text-lg text-gray-600">{property.address}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default PropertyInfo;
