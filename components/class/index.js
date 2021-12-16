import express from "express";
const router = express.Router();
import { checkTeacherClass, checkJoinedClass } from "./classService.js";

import {
    getClasses, 
    getClassById,
    createClass, 
} from './classController.js';

import {
    getInviteLinkByClassID,
    createInviteLink, 
    updateInviteLinkByClassID, 
    approveInvite, 
    createInviteSendMail, 
    deleteInvite
} from './classInviter/inciteClassCtrl.js';

import {
    getTeacherOfClass,
    getStudentOfClass,
    getUserRoleByClassId,
} from './classUser/classUserCtrl.js';

import {
    createClassGrade,
    getClassGradeByClassId,
    updateOrderClassGrade,
    updateClassGradeById,
    deleteClassGradeById,
} from './classGrade/classGradeCtrl.js';

// one class has ONLY one link invite
router.post('/approve/:inviteLink', approveInvite) // approve this usser

router.get('/:classId/invite-link', checkTeacherClass, getInviteLinkByClassID); // get link text invite user of class
router.post('/:classId/invite-link', checkTeacherClass, createInviteLink); // create link invite
router.put('/:classId/invite-link', checkTeacherClass, updateInviteLinkByClassID); // update to deactive link

router.post('/:classId/invite-link/:inviteLinkId/invite', checkTeacherClass, createInviteSendMail); // invite teacher/student with send email
router.delete('/:classId/invite-link/:inviteLinkId/invite/:inviteUserClassId', checkTeacherClass, deleteInvite); // delete teacher invite

router.get('/:classId/grade', checkTeacherClass, getClassGradeByClassId);
router.post('/:classId/grade', checkTeacherClass, createClassGrade);
router.patch('/:classId/grade/order', checkTeacherClass, updateOrderClassGrade);
// router.get('/:classId/grade/:id',);
router.put('/:classId/grade/:id', checkTeacherClass, updateClassGradeById);
router.delete('/:classId/grade/:id', checkTeacherClass, deleteClassGradeById);

router.get('/', getClasses);
router.post('/', createClass);
router.get('/:classId/role', checkJoinedClass, getUserRoleByClassId);
router.get('/:classId', checkJoinedClass, getClassById);
router.get('/:classId/people/teacher', checkJoinedClass, getTeacherOfClass);
router.get('/:classId/people/student', checkJoinedClass, getStudentOfClass);

export default router;
