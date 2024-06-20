import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai'; // Import delete icon from react-icons
import PropertyModal from '../components/OwnerPage/PropertyModal'; // Import the PropertyModal component

export default function Owner() {
    const { currentUser } = useSelector((state) => state.user);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredProperty, setHoveredProperty] = useState(null);
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

    const handleAddProperty = async (newProperty) => {
        try {
            const response = await fetch('/api/property', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newProperty, owner: currentUser._id }),
            });

            if (!response.ok) {
                throw new Error('Failed to add property');
            }

            const addedProperty = await response.json();
            setProperties([...properties, addedProperty]);
        } catch (err) {
            console.error(err);
            // Optionally, set an error state here to display an error message to the user
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        try {
            const response = await fetch(`/api/property/${propertyId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete property');
            }

            setProperties(properties.filter(property => property._id !== propertyId));
        } catch (err) {
            console.error(err);
            // Optionally, set an error state here to display an error message to the user
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold animate-pulse">Loading...</div></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><div className="text-red-600 text-xl font-semibold">Error: {error}</div></div>;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Your Properties</h2>
                    <p className="text-md text-gray-600">Manage your properties below.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Add Property
                </button>
            </div>
            {properties.length === 0 ? (
                <p className="text-center text-lg text-gray-600">No properties found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {properties.map(property => (
                        <div
                            key={property._id}
                            className="relative bg-white rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                            onMouseEnter={() => setHoveredProperty(property._id)}
                            onMouseLeave={() => setHoveredProperty(null)}
                        >
                            <Link to={`/property/${property._id}`} className="block h-full">
                                <img src={`https://cityaccommodations.co.uk/wp-content/themes/homely/images/property-img-default.gif`} alt="Property" className="w-full h-64 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white transition duration-300 ease-in-out" style={{ transform: hoveredProperty === property._id ? 'translateY(-100%)' : 'translateY(0)' }}>
                                    <h3 className="text-xl font-bold truncate">{property.name}</h3>
                                    <p className="text-sm mt-2">{property.address}</p>
                                </div>
                            </Link>
                            {hoveredProperty === property._id && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center bg-red-500 text-white">
                                    <button
                                        onClick={() => handleDeleteProperty(property._id)}
                                        className="text-white hover:text-red-400 focus:outline-none flex items-center"
                                        style={{ zIndex: 10 }} // Ensure delete button is in foreground
                                    >
                                        <AiOutlineDelete size={20} className="mr-1" /> {/* Delete icon */}
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <PropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddProperty} />
        </div>
    );
}
