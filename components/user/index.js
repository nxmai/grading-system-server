import express from "express";
import { createNotification, getNotification, updateNotificationRead } from "./notification/notificationCtrl.js";
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

// Notification
router.get('/notification', getNotification);
router.post('/notification', createNotification);
router.post('/notification/read', updateNotificationRead);

export default router;
