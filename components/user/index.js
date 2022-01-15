import express from "express";
import { createNotification, getNotification, updateNotificationRead } from "./notification/notificationCtrl.js";
import { checkIsAdmin } from "../auth/index.js";

const router = express.Router();

import {
    getMe,
    updateMe,
    updateStudentCardId,
    updatePassword,
    getUsers,
    updateOne,
} from './userController.js';
import { convVieSearch } from "../midd/convVieSearch.js";

router.get('/me', getMe);
router.put('/update/card', updateStudentCardId);
router.put('/updateMe', updateMe);
router.put('/updatePassword', updatePassword);

router.get('/all', checkIsAdmin, convVieSearch, getUsers);
router.post('/all/update/:userId', checkIsAdmin, updateOne);

// Notification
router.get('/notification', getNotification);
router.post('/notification', createNotification);
router.post('/notification/read', updateNotificationRead);

export default router;
