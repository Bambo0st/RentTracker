import React from 'react';
import Modal from 'react-modal';
import { useState } from 'react';
Modal.setAppElement('#root');  // Ensure you have a root element in your HTML

const RecordPaymentModal = ({ isOpen, onRequestClose, paymentId, onConfirm }) => {
    const handleConfirm = () => {
        onConfirm(paymentId);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Record Payment"
            className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75"
            overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
        >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold mb-4 text-center">Record Payment</h2>
                {/* <p className="text-sm text-gray-700 mb-4 text-center">Are you sure you want to record the payment for {paymentInfo.dueDate.getMonth()}?</p> */}
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
