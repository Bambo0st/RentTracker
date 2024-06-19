import React, { useState } from 'react';
import Modal from 'react-modal';
import RecordPaymentModal from './RecordPaymentModal'; // Import RecordPaymentModal

Modal.setAppElement('#root');  // Ensure you have a root element in your HTML

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
};

const PaymentModal = ({ isOpen, onRequestClose, paymentRecords, onRecordPayment }) => {
    const [recordModalOpen, setRecordModalOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);

    const openRecordModal = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setRecordModalOpen(true);
    };

    const closeRecordModal = () => {
        setRecordModalOpen(false);
        setSelectedPaymentId(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Payment Records"
            className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75"
            overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
        >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
                <h2 className="text-lg font-bold mb-4 text-center">Payment Records</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Due Date</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Due Amount</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Payment Date</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Paid Status</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentRecords.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">{formatDate(record.dueDate)}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">₹ {record.dueAmount}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">{record.paymentDate ? formatDate(record.paymentDate) : '-'}</td>
                                    <td className={`py-2 px-4 border-b border-gray-200 text-center ${record.paid_status ? 'text-green-500' : 'text-red-500'}`}>
                                        {record.paid_status ? 'Paid' : 'Unpaid'}
                                    </td>
                                    <td className="py-1 px-4 border-b border-gray-200 text-center">
                                        {!record.paid_status && (
                                            <button
                                                onClick={() => openRecordModal(record._id)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                            >
                                                Record Payment
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onRequestClose}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
            {/* Render RecordPaymentModal conditionally */}
            {recordModalOpen && (
                <RecordPaymentModal
                    isOpen={recordModalOpen}
                    onRequestClose={closeRecordModal}
                    paymentId={selectedPaymentId}
                    onConfirm={(paymentId) => {
                        // Handle recording payment logic here
                        onRecordPayment(paymentId)
                        closeRecordModal();
                    }}
                />
            )}
        </Modal>
    );
};

export default PaymentModal;
