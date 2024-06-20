import React, { useState, useEffect } from 'react';
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

    const recordedPayment = async (paymentId) => {
        try {
            const res = await fetch(`/api/payment/${paymentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                setPaymentRecords(prevRecords =>
                    prevRecords.map(record =>
                        record._id === paymentId ? { ...record, paid_status: true } : record
                    )
                );
            } else {
                console.error('Failed to update payment status');
            }
        } catch (err) {
            console.error('Error updating payment status:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Tenant Name</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Contact</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Room</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Rent Amount</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Date of Joining</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Current Dues</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Payment Status</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.length > 0 ? (
                        tenants.map((tenant, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b border-gray-200 font-bold">{tenant.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{tenant.contact}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{tenant.room}</td>
                                <td className="py-2 px-4 border-b border-gray-200 font-bold">₹ {tenant.rentAmount}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{tenant.dateOfJoining ? formatDate(tenant.dateOfJoining) : '-'}</td>
                                <td className={`py-2 px-4 border-b border-gray-200 font-bold ${tenant.currentDues > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    ₹ {tenant.currentDues}
                                </td>
                                <td className={`py-2 px-4 border-b border-gray-200 font-bold ${tenant.paymentStatus === 'up-to-date' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {tenant.paymentStatus}
                                </td>
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
