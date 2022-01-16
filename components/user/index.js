import express from "express";
import { createNotification, getNotification, responseToStudentGradeReviewNotification, updateNotificationRead } from "./notification/notificationCtrl.js";
import { checkIsAdmin } from "../auth/index.js";

const router = express.Router();

import {
    getMe,
    updateMe,
    updateStudentCardId,
    updatePassword,
    getUsers,
    updateOne,
    searchBy,
} from './userController.js';

router.get('/me', getMe);
router.put('/update/card', updateStudentCardId);
router.put('/updateMe', updateMe);
router.put('/updatePassword', updatePassword);

router.get('/search', checkIsAdmin, searchBy);
router.get('/all', checkIsAdmin, getUsers);
router.post('/all/update/:userId', checkIsAdmin, updateOne);

// Notification
router.get('/notification', getNotification);
router.post('/notification', createNotification);
router.post('/notification/response-to-student-grade-review', responseToStudentGradeReviewNotification);
router.post('/notification/read', updateNotificationRead);

export default router;
