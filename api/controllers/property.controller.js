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

        const newTenant = new Tenant({ name, contact, room, rentAmount, dateOfJoining, dueDate, property: propertyId, currentDues: 0, paymentStatus: "up-to-date" })

        const savedTenant = await addFirstDues(newTenant)
        property.tenants.push(savedTenant._id);
        await property.save();

        res.status(201).json(savedTenant)
    } catch (err) {
        next(errorHandler(500, err.message));
    }
}

const addFirstDues = async (tenant) => {
    let joiningDate = new Date(tenant.dateOfJoining);
    if (joiningDate.getDate() !== 1) {
        // Calculate initial due amount until end of first month
        console.log("here i come")
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
        tenant.currentDues = initialDueAmount
        console.log(tenant)
    }
    return tenant.save()
}
