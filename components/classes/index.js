import express from "express";
const router = express.Router();

import { getClasses, createClass } from './classesController.js';

router.get('/', getClasses);
router.post('/', createClass);

export default router;
