import Property from "../models/property.model.js";
import errorHandler from '../middleware/errorHandler.js'
import User from "../models/user.model.js";
import Tenant from "../models/tenant.model.js";
import Payment from "../models/payment.model.js";

export const addProperty = async (req, res, next) => {
    const { name, address, owner } = req.body;
    try {
        const isOwner = await User.findById(owner);
        if (!isOwner) return next(errorHandler(404, "Owner Not Found"));
        const Prop = new Property({ name, address, owner });
        const property = await Prop.save();
        res.status(201).json(property);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message })
    }
}
export const deleteProperty = async (req, res, next) => {
    const { propertyId } = req.params

    try {
        const isProperty = await Property.findById(propertyId)
        if (!isProperty) return next(errorHandler(404, "Property Not Found"))
        await Property.findByIdAndDelete(propertyId);
        res.status(200).json({ success: true, message: "Property deleted successfully" })
    } catch (err) {
        return next(errorHandler(500, err.message));
    }
}

export const getPropertyById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const properties = await Property.findById(id)
        if (!properties) {
            return res.status(404).json({ msg: 'Property not found' });
        }
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message })
    }
}

export const getPropertyByOwnerId = async (req, res, next) => {
    const { ownerId } = req.params;
    try {
        const owner = await User.findById(ownerId);
        if (!owner) return next(errorHandler(404, "Owner Not Found"));
        const properties = await Property.find({ owner: ownerId })
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message })
    }
}

export const getTenants = async (req, res, next) => {
    const { propertyId } = req.params;
    try {
        const tenants = await Tenant.find({ property: propertyId });
        res.status(200).json(tenants);
    } catch (err) {
        res.status(500).json({
            msg: 'Server Error', error: err.message
        })
    }
}

export const addTenant = async (req, res, next) => {
    try {
        const { propertyId } = req.params;
        const { name, contact, room, rentAmount, dateOfJoining, dueDate } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) return next(errorHandler(404, "Property Doesn't Exist"))

        const isTenant = await Tenant.findOne({ room, property: propertyId })
        if (isTenant) return next(errorHandler(400, "Room is already occupied by another Tenant"))

        const newTenant = new Tenant({ name, contact, room, rentAmount, dateOfJoining, dueDate, property: propertyId, currentDues: 0, paymentStatus: "Up-to-date" })

        const savedTenant = await addFirstDues(newTenant)
        property.tenants.push(savedTenant._id);
        await property.save();

        res.status(201).json(savedTenant)
    } catch (err) {
        next(errorHandler(500, err.message));
    }
}


const addFirstDues = async (tenant) => {
    const today = new Date();
    const joiningDate = new Date(tenant.dateOfJoining);

    if (joiningDate.getDate() !== 1) {
        // Calculate initial due amount until end of first month
        const nextMonthOfJoiningDate = new Date(joiningDate);
        nextMonthOfJoiningDate.setMonth(nextMonthOfJoiningDate.getMonth() + 1);
        nextMonthOfJoiningDate.setDate(1);

        const daysInInitialPeriod = Math.floor((nextMonthOfJoiningDate - joiningDate) / (1000 * 60 * 60 * 24));
        const dailyRent = tenant.rentAmount / 30; // Assuming 30 days in a month for simplicity
        const initialDueAmount = Math.round(dailyRent * daysInInitialPeriod);

        const initialPaymentRecord = new Payment({
            tenantId: tenant._id,
            dueAmount: initialDueAmount,
            dueDate: joiningDate
        });

        await initialPaymentRecord.save();
        tenant.paymentRecords.push(initialPaymentRecord._id);
        tenant.currentDues += initialDueAmount;
    } else {
        // If joining date is the 1st, calculate initial due amount for the whole month
        const daysInInitialPeriod = new Date(joiningDate.getFullYear(), joiningDate.getMonth() + 1, 0).getDate();
        // const dailyRent = tenant.rentAmount / 30;
        // const initialDueAmount = Math.round(dailyRent * daysInInitialPeriod);

        const initialPaymentRecord = new Payment({
            tenantId: tenant._id,
            dueAmount: tenant.rentAmount,
            dueDate: joiningDate
        });

        await initialPaymentRecord.save();
        tenant.paymentRecords.push(initialPaymentRecord._id);
        tenant.currentDues += tenant.rentAmount;
    }

    // Generate records for subsequent months until today
    let nextDueDate = new Date(joiningDate);
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
        tenant.currentDues += tenant.rentAmount;

        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        nextDueDate.setDate(1);
    }
    if (tenant.currentDues > 0) tenant.paymentStatus = "Due"
    return await tenant.save();
}

