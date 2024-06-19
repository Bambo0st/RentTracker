import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    dueAmount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentDate: {
        type: Date,
        default: null
    },
    description: {
        type: String,
        default: ''
    },
    paid_status: {
        type: Boolean,
        default: false
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment