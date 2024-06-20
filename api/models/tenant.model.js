import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String },
    room: { type: String, required: true },
    property: { type: mongoose.Schema.Types.ObjectId, required: true },
    rentAmount: { type: Number, required: true },
    dateOfJoining: { type: Date, required: true },
    // dueDate: { type: Date, required: true },
    currentDues: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['Up-to-date', 'Due'], default: 'Up-to-date' },
    paymentRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]


}, { timestamps: true })

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant