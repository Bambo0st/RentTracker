import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Owner() {
    const { currentUser } = useSelector((state) => state.user);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`/api/property/owner/${currentUser._id}`);
                const data = await response.json();
                setProperties(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && currentUser._id) {
            fetchProperties();
        }
    }, [currentUser]);

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Loading...</div></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><div className="text-red-600 text-xl font-semibold">Error: {error}</div></div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Your Properties</h2>
            {properties.length === 0 ? (
                <p className="text-center text-lg">No properties found.</p>
            ) : (
                <ul className="space-y-4">
                    {properties.map(property => (
                        <li key={property._id} className="p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <Link to={`/property/${property._id}`}>
                                <div className="font-semibold text-xl">{property.name}</div>
                                <div className="text-gray-600">{property.address}</div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
