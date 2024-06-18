import Tenant from "../models/tenant.model.js";
import errorHandler from "../middleware/errorHandler.js";
import Property from "../models/property.model.js";

export const getTenantById = async (req, res, next) => {
    try {
        const { propertyId, tenantId } = req.params;
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) return next(errorHandler(404, "Tenant not found"))
        res.status(200).json(tenant);
    } catch (err) {
        return next(errorHandler(500, err.message))
    }
}

export const removeTenantById = async (req, res, next) => {
    try {
        const { propertyId, tenantId } = req.params;
        const tenant = await Tenant.findOneAndDelete({
            _id: tenantId,
            property: propertyId
        })
        if (!tenant) return next(errorHandler(404, "Tenant Not Found"));
        res.status(200).json({ message: "Tenant Deleted Successfuly" });
    } catch (err) {
        return next(errorHandler(500, err.message))
    }
}