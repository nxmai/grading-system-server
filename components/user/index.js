import express from "express";
import { getNotification, requestGradeReviewNotification, responseToStudentGradeReviewNotification, returnScoreNotification, updateNotificationRead } from "./notification/notificationCtrl.js";
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
router.post('/notification/response-to-student-grade-review', responseToStudentGradeReviewNotification);
router.post('/notification/request-a-grade-review', requestGradeReviewNotification);
router.post('/notification/return-all-scores', returnScoreNotification);
router.post('/notification/read', updateNotificationRead);

export default router;
