import React, { useState } from 'react';

const AddTenantForm = ({ onAddTenant, error }) => {
    const [newTenant, setNewTenant] = useState({
        name: '',
        contact: '',
        room: '',
        rentAmount: '',
        dateOfJoining: '',
        currentDues: 0,
        // dueDate: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTenant((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTenant(newTenant);
        setNewTenant({
            name: '',
            contact: '',
            room: '',
            rentAmount: '',
            currentDues: 0,
            dateOfJoining: '',
            // dueDate: ''
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 mb-6">
            <form onSubmit={handleSubmit}>
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
                {/* <div className="mb-4">
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
                </div> */}
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
    );
};


export default AddTenantForm;
