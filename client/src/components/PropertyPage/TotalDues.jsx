import React, { useEffect, useState } from 'react';

const TotalDues = ({ tenants }) => {
    const [totalDues, setTotalDues] = useState(0);
    const [totalCurrentMonthDues, setTotalCurrentMonthDues] = useState(0);

    useEffect(() => {
        const calculateDues = async () => {
            let total = 0;
            let currentMonthTotal = 0;
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            for (const tenant of tenants) {
                total += tenant.currentDues;

                const recentRecordId = tenant.paymentRecords[tenant.paymentRecords.length - 1];
                if (recentRecordId) {
                    try {
                        const res = await fetch(`/api/payment/record/${recentRecordId}`);
                        const recentRecord = await res.json();
                        if (!recentRecord.paid_status) {
                            const recordDate = new Date(recentRecord.dueDate);
                            if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
                                currentMonthTotal += recentRecord.dueAmount;
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to fetch payment record with ID ${recentRecordId}:`, error);
                    }
                }
            }

            setTotalDues(total);
            setTotalCurrentMonthDues(currentMonthTotal);
        };

        calculateDues();
    }, [tenants]);

    return (
        <div className="total-dues mt-6 p-4 bg-white shadow-lg rounded-lg text-center">
            <div className="text-2xl font-bold mb-2">
                <span>Total Dues: </span>
                <span className="text-blue-500">₹ {totalDues}</span>
            </div>
            <div className="text-2xl font-bold">
                <span>Total Dues of Current Month: </span>
                <span className="text-green-500">₹ {totalCurrentMonthDues}</span>
            </div>
        </div>
    );
};

export default TotalDues;
