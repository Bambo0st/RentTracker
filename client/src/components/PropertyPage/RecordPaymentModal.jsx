import React from 'react';
import Modal from 'react-modal';
import { useState } from 'react';
Modal.setAppElement('#root');  // Ensure you have a root element in your HTML

const RecordPaymentModal = ({ isOpen, onRequestClose, paymentId, paymentInfo, onConfirm }) => {
    const handleConfirm = () => {
        onConfirm(paymentId);
    };

    const formattedMonth = new Date(paymentInfo.dueDate).toLocaleString(undefined, { month: 'long' });

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Record Payment"
            className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75"
            overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
        >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-12 w-12 flex items-center justify-center border-2 border-gray-400 rounded-full">
                        <span className="text-gray-400 text-2xl font-bold">?</span>
                    </div>
                </div>
                <h2 className="text-lg font-bold mb-4 text-center">Record Payment</h2>
                <p className="text-sm text-gray-700 mb-4 text-center">
                    Are you sure you want to record the payment for <span className="font-bold">{formattedMonth}</span>?
                </p>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleConfirm}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onRequestClose}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        No
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RecordPaymentModal;
