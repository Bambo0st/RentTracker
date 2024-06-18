import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String },
    room: { type: String, required: true, unique: true },
    property: { type: mongoose.Schema.Types.ObjectId, required: true },
    rentAmount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    currentBalance: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['up-to-date', 'overdue'], default: 'up-to-date' }


}, { timestamps: true })

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant