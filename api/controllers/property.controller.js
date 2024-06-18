import Property from "../models/property.model.js";
import errorHandler from '../middleware/errorHandler.js'
import User from "../models/user.model.js";
import Tenant from "../models/tenant.model.js";

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
        const { name, contact, room, rentAmount, dueDate } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) return next(errorHandler(404, "Property Doesn't Exist"))

        const isTenant = await Tenant.findOne({ room, property: propertyId })
        if (isTenant) return next(errorHandler(400, "Room is already occupied by another Tenant"))

        const newTenant = new Tenant({ name, contact, room, rentAmount, dueDate, property: propertyId, paymentStatus: "up-to-date" })
        const savedTenant = await newTenant.save();
        property.tenants.push(savedTenant._id);
        await property.save();
        res.status(201).json(savedTenant)
    } catch (err) {
        next(500, err.message);
    }
}

