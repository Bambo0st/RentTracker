import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Property() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [property, setProperty] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [newTenant, setNewTenant] = useState({ name: '', contact: '', room: '', rentAmount: '', dateOfJoining: '', currentDues: 0, dueDate: '', });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/property/${id}`);
                if (!res.ok) throw new Error('Failed to fetch the property');
                const data = await res.json();
                setProperty(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchTenants = async () => {
            try {
                const res = await fetch(`/api/property/${id}/tenants`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch tenants for property with ID ${id}`);
                }
                const data = await res.json();
                setTenants(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
        fetchTenants();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTenant((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTenant = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/property/${id}/tenants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTenant)
            });
            if (res.ok) {
                const addedTenant = await res.json();
                setTenants([...tenants, addedTenant]); // Add new tenant to tenants array
                setNewTenant({ name: '', contact: '', room: '', rentAmount: '', currentDues: 0, dateOfJoining: '', dueDate: '' }); // Clear form fields
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Failed to add tenant'); // Set a default error message if message is not present
            }
        } catch (err) {
            setError('Failed to add tenant'); // Handle network or other errors
        }
    };

    const handleDeleteTenant = async (tenantId) => {
        try {
            const res = await fetch(`/api/property/${id}/tenants/${tenantId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Filter out the deleted tenant from the state
                setTenants(tenants.filter(tenant => tenant._id !== tenantId));
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Failed to delete tenant');
            }
        } catch (err) {
            setError('Failed to delete tenant');
        }
    };

    const handleRecordTransaction = async (tenantId) => {
        try {
            const res = await fetch(`/api/property/${id}/tenants/${tenantId}/record-transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transactionDetails: 'Details of the transaction' })
            });

            if (res.ok) {
                console.log('Transaction recorded successfully');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Failed to record transaction');
            }
        } catch (err) {
            setError('Failed to record transaction');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Loading...</div></div>;

    return (
        <div className="container mx-auto p-4">
            {property && (
                <>
                    <h2 className="text-2xl font-bold text-center mb-6">{property.name}</h2>
                    <p className="text-lg text-center mb-4">{property.address}</p>
                </>
            )}

            <h3 className="flex justify-center text-xl font-semibold mb-4">Add New Tenant</h3>
            <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 mb-6">
                <form onSubmit={handleAddTenant}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newTenant.name}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">Contact</label>
                        <input
                            type="text"
                            id="contact"
                            name="contact"
                            value={newTenant.contact}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room">Room</label>
                        <input
                            type="text"
                            id="room"
                            name="room"
                            value={newTenant.room}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rentAmount">Rent Amount</label>
                        <input
                            type="number"
                            id="rentAmount"
                            name="rentAmount"
                            value={newTenant.rentAmount}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfJoining">Date of Joining</label>
                        <input
                            type="date"
                            id="dateOfJoining"
                            name="dateOfJoining"
                            value={newTenant.dateOfJoining}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">Due Date</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={newTenant.dueDate}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Tenant
                        </button>
                    </div>
                </form>
                {error && <div className="text-red-600 text-xl font-semibold mt-4">Error: {error}</div>}
            </div>

            <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200">Tenant Name</th>
                            <th className="py-2 px-4 border-b border-gray-200">Contact</th>
                            <th className="py-2 px-4 border-b border-gray-200">Room</th>
                            <th className="py-2 px-4 border-b border-gray-200">Rent Amount</th>
                            <th className="py-2 px-4 border-b border-gray-200">Date of Joining</th>
                            <th className="py-2 px-4 border-b border-gray-200">Due Date</th>
                            <th className="py-2 px-4 border-b border-gray-200">Current Dues</th>
                            <th className="py-2 px-4 border-b border-gray-200">Payment Status</th>
                            <th className="py-2 px-4 border-b border-gray-200">Actions</th> {/* New column for actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.length > 0 ? (
                            tenants.map((tenant, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b border-gray-200">{tenant.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{tenant.contact}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{tenant.room}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{tenant.rentAmount}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{tenant.dateOfJoining ? new Date(tenant.dateOfJoining).toLocaleDateString() : '-'}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{tenant.dueDate ? new Date(tenant.dueDate).toLocaleDateString() : '-'}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{tenant.currentDues}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{tenant.paymentStatus}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteTenant(tenant._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={() => handleRecordTransaction(tenant._id)}
                                        >
                                            Record Transaction
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-2 px-4 text-center">No tenants found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Property;
