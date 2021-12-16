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

import {
    upload,
    downloadTemplateStudentList,
    uploadStudentList,
    uploadScoreByGradeId,
    downloadTemplateScoreByGradeId,
    downloadFullScoreByClassId,
    updateClassScoreById,
    markReturnedByGradeId

} from './classScore/classScoreCtrl.js';

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

router.get('/:classId/score/student/file', checkTeacherClass, downloadTemplateStudentList);
router.post('/:classId/score/student/file', checkTeacherClass, upload.single('file'), uploadStudentList);
router.get('/:classId/score/full/file', checkTeacherClass, downloadFullScoreByClassId);
router.put('/:classId/score/:gradeId/update/:scoreId', checkTeacherClass, updateClassScoreById);
router.put('/:classId/score/:gradeId/mark-returned-all', checkTeacherClass, markReturnedByGradeId);
router.post('/:classId/score/:gradeId/upload/', checkTeacherClass, upload.single('file'), uploadScoreByGradeId);
router.get('/:classId/score/:gradeId/download/', checkTeacherClass, downloadTemplateScoreByGradeId);

export default router;
