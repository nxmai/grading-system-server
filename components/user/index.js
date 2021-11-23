import express from "express";
const router = express.Router();

import {
    getMe,
    updateMe
} from './userController.js';

router.get('/me', getMe);
router.put('/updateMe', updateMe);

export default router;
