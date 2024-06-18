import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }],
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);
export default Property;