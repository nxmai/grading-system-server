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
    createAssignment,
    getAssignmentByClassId,
    updateOrderAssignment,
    updateAssignmentById,
    deleteAssignmentById,
} from './classAssignment/classAssignmentCtrl.js';

import {
    upload,
    downloadTemplateStudentList,
    getStudentScoreByClassId,
    uploadStudentList,
    uploadScoreByAssignmentId,
    downloadTemplateScoreByAssignmentId,
    downloadFullScoreByClassId,
    createClassScore,
    updateClassScoreById,
    markReturnedByAssignmentId,
    getAssignmentsScoreByClassId
} from './classScore/classScoreCtrl.js';

// one class has ONLY one link invite
router.post('/approve/:inviteLink', approveInvite) // approve this usser

router.get('/:classId/invite-link', checkTeacherClass, getInviteLinkByClassID); // get link text invite user of class
router.post('/:classId/invite-link', checkTeacherClass, createInviteLink); // create link invite
router.put('/:classId/invite-link', checkTeacherClass, updateInviteLinkByClassID); // update to deactive link

router.post('/:classId/invite-link/:inviteLinkId/invite', checkTeacherClass, createInviteSendMail); // invite teacher/student with send email
router.delete('/:classId/invite-link/:inviteLinkId/invite/:inviteUserClassId', checkTeacherClass, deleteInvite); // delete teacher invite

router.get('/:classId/assignment', checkTeacherClass, getAssignmentByClassId);
router.post('/:classId/assignment', checkTeacherClass, createAssignment);
router.patch('/:classId/assignment/order', checkTeacherClass, updateOrderAssignment);
// router.get('/:classId/assignment/:id',);
router.put('/:classId/assignment/:id', checkTeacherClass, updateAssignmentById);
router.delete('/:classId/assignment/:id', checkTeacherClass, deleteAssignmentById);

router.get('/', getClasses);
router.post('/', createClass);
router.get('/:classId/role', checkJoinedClass, getUserRoleByClassId);
router.get('/:classId', checkJoinedClass, getClassById);
router.get('/:classId/people/teacher', checkJoinedClass, getTeacherOfClass);
router.get('/:classId/people/student', checkJoinedClass, getStudentOfClass);

router.get('/:classId/score/student/file', checkTeacherClass, downloadTemplateStudentList);
router.get('/:classId/score/student/', checkTeacherClass, getStudentScoreByClassId);
router.post('/:classId/score/student/file', checkTeacherClass, upload.single('file'), uploadStudentList);
router.get('/:classId/score/full/file', checkTeacherClass, downloadFullScoreByClassId);
router.post('/:classId/score/:assignmentId/score/', checkTeacherClass, createClassScore);
router.put('/:classId/score/:assignmentId/update/:scoreId', checkTeacherClass, updateClassScoreById);
router.put('/:classId/score/:assignmentId/mark-returned-all', checkTeacherClass, markReturnedByAssignmentId);
router.post('/:classId/score/:assignmentId/upload/', checkTeacherClass, upload.single('file'), uploadScoreByAssignmentId);
router.get('/:classId/score/:assignmentId/download/', checkTeacherClass, downloadTemplateScoreByAssignmentId);
router.get('/:classId/score', checkTeacherClass, getAssignmentsScoreByClassId);

export default router;
