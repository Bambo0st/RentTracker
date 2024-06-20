import express from "express";
const router = express.Router();
import { getRecordsByTenantId, recordPayment, getRecordByPaymentId } from "../controllers/payment.controller.js";

router.get('/:tenantId', getRecordsByTenantId)
router.get('/record/:paymentId', getRecordByPaymentId)
router.put('/:paymentId', recordPayment)
export default router