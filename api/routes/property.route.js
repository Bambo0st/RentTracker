import express from 'express'
import { addProperty, getPropertyById, getPropertyByOwnerId, addTenant, getTenants } from '../controllers/property.controller.js'
import { getTenantById, removeTenantById } from '../controllers/tenant.controller.js';

const router = express.Router();

router.post('/', addProperty)
router.get('/:id', getPropertyById);
router.get('/owner/:ownerId', getPropertyByOwnerId);
router.get('/:propertyId/tenants', getTenants);
router.post('/:propertyId/tenants', addTenant);
router.get('/:propertyId/tenants/:tenantId', getTenantById);
router.delete('/:propertyId/tenants/:tenantId', removeTenantById);
export default router