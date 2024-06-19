import React, { useState } from 'react';
import PaymentModal from './PaymentModal.jsx';

const TenantsTable = ({ tenants, onDeleteTenant }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [paymentRecords, setPaymentRecords] = useState([]);
    const [selectedTenantId, setSelectedTenantId] = useState(null);

    const openModal = async (tenantId) => {
        setSelectedTenantId(tenantId);
        try {
            const response = await fetch(`/api/payment/${tenantId}`);
            const data = await response.json();
            console.log(data)
            setPaymentRecords(data);
        } catch (error) {
            console.error("Error fetching payment records:", error);
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setPaymentRecords([]);
    };

    const recordedPayment = (paymentId) => {
        console.log("in tenant recorded payment")

    }
    return (
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200">Tenant Name</th>
                        <th className="py-2 px-4 border-b border-gray-200">Contact</th>
                        <th className="py-2 px-4 border-b border-gray-200">Room</th>
                        <th className="py-2 px-4 border-b border-gray-200">Rent Amount</th>
                        <th className="py-2 px-4 border-b border-gray-200">Date of Joining</th>
                        <th className="py-2 px-4 border-b border-gray-200">Current Dues</th>
                        <th className="py-2 px-4 border-b border-gray-200">Payment Status</th>
                        <th className="py-2 px-4 border-b border-gray-200">Actions</th>
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
                                <td className="py-2 px-4 border-b border-gray-200">{tenant.currentDues}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{tenant.paymentStatus}</td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => onDeleteTenant(tenant._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                                        onClick={() => openModal(tenant._id)}
                                    >
                                        Record Transaction
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="py-2 px-4 text-center">No tenants found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <PaymentModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                paymentRecords={paymentRecords}
                onRecordPayment={recordedPayment}
            />
        </div>
    );
};

export default TenantsTable;
