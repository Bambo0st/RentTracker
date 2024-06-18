import express from 'express'
import { verifyUser } from '../middleware/verifyUser.js'
import { updateUser, deleteUser, getUser } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/:id', getUser);
router.post('/update/:id', verifyUser, updateUser)
router.delete('/delete/:id', verifyUser, deleteUser);

export default router;