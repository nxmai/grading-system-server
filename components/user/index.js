import express from "express";
const router = express.Router();

import {
    getMe,
    updateMe,
    updateStudentCardId,
    updatePassword
} from './userController.js';

router.get('/me', getMe);
router.put('/update/card', updateStudentCardId);
router.put('/updateMe', updateMe);
router.put('/updatePassword', updatePassword);

export default router;
