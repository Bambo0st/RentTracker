import Tenant from '../models/tenant.model.js';
import Payment from '../models/payment.model.js';
import errorHandler from '../middleware/errorHandler.js';


export const getRecordsByTenantId = async (req, res) => {
    const { tenantId } = req.params;

    try {
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const today = new Date();
        let joiningDate = new Date(tenant.dateOfJoining);

        if (tenant.paymentRecords.length === 0) {
            // Generate payment records for the first time
            let nextDueDate = new Date(joiningDate);

            if (joiningDate.getDate() !== 1) {
                // Calculate initial due amount until end of first month
                const nextMonthOfJoiningDate = new Date(joiningDate);
                nextMonthOfJoiningDate.setMonth(nextMonthOfJoiningDate.getMonth() + 1);
                nextMonthOfJoiningDate.setDate(1);

                const daysInInitialPeriod = (nextMonthOfJoiningDate - joiningDate) / (1000 * 60 * 60 * 24);
                const dailyRent = tenant.rentAmount / 30; // Assuming 30 days in a month for simplicity
                const initialDueAmount = Math.round(dailyRent * daysInInitialPeriod);

                const initialPaymentRecord = new Payment({
                    tenantId: tenant._id,
                    dueAmount: initialDueAmount,
                    dueDate: joiningDate
                });

                await initialPaymentRecord.save();
                tenant.paymentRecords.push(initialPaymentRecord._id);
            } else {
                // If joining date is the 1st, calculate initial due amount for the whole month
                const daysInInitialPeriod = new Date(joiningDate.getFullYear(), joiningDate.getMonth() + 1, 0).getDate();
                const dailyRent = tenant.rentAmount / 30;
                const initialDueAmount = Math.round(dailyRent * daysInInitialPeriod);

                const initialPaymentRecord = new Payment({
                    tenantId: tenant._id,
                    dueAmount: initialDueAmount,
                    dueDate: joiningDate
                });

                await initialPaymentRecord.save();
                tenant.paymentRecords.push(initialPaymentRecord._id);
            }
        } else {
            // Generate records for subsequent months until today
            const lastPaymentRecord = await Payment.findById(tenant.paymentRecords[tenant.paymentRecords.length - 1]);
            let nextDueDate = new Date(lastPaymentRecord.dueDate);
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            nextDueDate.setDate(1);

            while (nextDueDate <= today) {
                const paymentRecord = new Payment({
                    tenantId: tenant._id,
                    dueAmount: tenant.rentAmount,
                    dueDate: nextDueDate
                });

                await paymentRecord.save();
                tenant.paymentRecords.push(paymentRecord._id);

                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                nextDueDate.setDate(1);
            }
        }

        await tenant.save();
        var result = []
        for (var i = 0; i < tenant.paymentRecords.length; i++) {
            var paymentRecord = await Payment.findById(tenant.paymentRecords[i]);
            if (paymentRecord) result.push(paymentRecord)
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching or generating payment records:", error);
        res.status(500).json({ error: error.message });
    }
};

export const recordPayment = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ error: 'Payment record not found' });
        }

        if (payment.paid_status) {
            return res.status(400).json({ error: 'This payment has already been recorded as paid.' });
        }

        payment.paymentDate = new Date();
        payment.paid_status = true;
        await payment.save();

        const tenant = await Tenant.findById(payment.tenantId);
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const unpaidPayments = await Payment.find({ tenantId: tenant._id, paid_status: false });
        tenant.currentDues = unpaidPayments.reduce((total, record) => total + record.dueAmount, 0);

        tenant.paymentStatus = tenant.currentDues > 0 ? 'due' : 'up-to-date';

        await tenant.save();

        res.status(200).json({ message: 'Payment recorded successfully', payment });
    } catch (error) {
        console.error("Error recording payment:", error);
        res.status(500).json({ error: error.message });
    }
};


export const getDues = (req,res) =>{
    
}
