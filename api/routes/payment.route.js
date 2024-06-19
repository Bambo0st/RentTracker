import express from "express";
const router = express.Router();
import { getRecordsByTenantId, recordPayment } from "../controllers/payment.controller.js";

router.get('/:tenantId', getRecordsByTenantId)
router.put('/:paymentId', recordPayment)
export default router