import Tenant from "../models/tenant.model.js";
import errorHandler from "../middleware/errorHandler.js";
import Property from "../models/property.model.js";

export const getTenantById = async (req, res, next) => {
    try {
        console.log("inside getTenantById")
        const { propertyId, tenantId } = req.params;
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) return next(errorHandler(404, "Tenant not found"))
        res.status(200).json(tenant);
    } catch (err) {
        return next(errorHandler(500, err.message))
    }
}