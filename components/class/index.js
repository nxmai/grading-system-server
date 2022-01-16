import express from "express";
const router = express.Router();
import { checkTeacherClass, checkJoinedClass, checkTeacherAndStudentInClass, checkStudentInClass } from "./classService.js";

import {
    getClasses, 
    getClassById,
    createClass, 
    getAllClasses
} from './classController.js';

import {
    getInviteLinkByClassID,
    createInviteLink, 
    updateInviteLinkByClassID, 
    approveInvite, 
    createInviteSendMail,
    listInviteUserClassByInviteLinkText,
    deleteInviteUser
} from './classInviter/inciteClassCtrl.js';

import {
    getTeacherOfClass,
    getStudentOfClass,
    getUserRoleByClassId,
    getStudentClassId
} from './classUser/classUserCtrl.js';

import {
    createAssignment,
    getAssignmentByClassId,
    getAssignmentByAssignmentId,
    updateOrderAssignment,
    updateAssignmentById,
    deleteAssignmentById,
} from './classAssignment/classAssignmentCtrl.js';

import {
    upload,
    downloadTemplateStudentList,
    getStudentByClassId,
    uploadStudentList,
    uploadScoreByAssignmentId,
    downloadTemplateScoreByAssignmentId,
    downloadFullScoreByClassId,
    createClassScore,
    updateClassScoreById,
    markReturnedByAssignmentId,
    getAssignmentsScoreByClassId,
    getAssignmentsScoreByClassIdByStudentIdAndCountTotal,
    getAssignmentsScoreByClassStudentId
} from './classScore/classScoreCtrl.js';

import {
    createAssignmentReviewRequest,
    getOneAssignmentReviewRequestForStudent,
    getAllReviewRequestsInOneAssignment,
    getOneAssignmentReviewRequest,
    acceptScoreRequestByStudent,
    ignoreScoreRequestByStudent,
    acceptRequestByNewScoreFromTeacher,

    getReviewChatByReviewRequestId,
    createReviewChat
} from './classAssignment/assignmentReview/assignmentReivewCtrl.js';

// one class has ONLY one link invite
router.post('/approve/:inviteLink', approveInvite) // approve this usser

router.get('/:classId/invite-link', checkTeacherClass, getInviteLinkByClassID); // get link text invite user of class
router.post('/:classId/invite-link', checkTeacherClass, createInviteLink); // create link invite
router.put('/:classId/invite-link', checkTeacherClass, updateInviteLinkByClassID); // update to deactive link

router.post('/:classId/invite-link/:inviteLinkId/invite', checkTeacherClass, createInviteSendMail); // invite teacher/student with send email
router.get('/:classId/invite-link/:inviteLinkText/', checkTeacherClass, listInviteUserClassByInviteLinkText)
router.delete('/:classId/invite-link/:inviteLinkId/invite/:inviteUserClassId', checkTeacherClass, deleteInviteUser); // delete teacher invite

router.get('/:classId/assignment', checkTeacherAndStudentInClass, getAssignmentByClassId);
router.post('/:classId/assignment', checkTeacherClass, createAssignment);
router.patch('/:classId/assignment/order', checkTeacherClass, updateOrderAssignment);
router.get('/:classId/assignment/:id', checkTeacherAndStudentInClass, getAssignmentByAssignmentId);
router.put('/:classId/assignment/:id', checkTeacherClass, updateAssignmentById);
router.delete('/:classId/assignment/:id', checkTeacherClass, deleteAssignmentById);

router.get('/', getClasses);
router.get('/getall', getAllClasses);
router.post('/', createClass);
router.get('/:classId/role', checkJoinedClass, getUserRoleByClassId);
router.get('/:classId', checkJoinedClass, getClassById);
router.get('/:classId/people/teacher', checkJoinedClass, getTeacherOfClass);
router.get('/:classId/people/student', checkJoinedClass, getStudentOfClass);
// router.get('/:classId/people/invite', checkTeacherClass, getInviteUserClassByClassId);

router.route('/:classId/score/student/file')
    .get(checkTeacherClass, downloadTemplateStudentList)
    .post(checkTeacherClass, upload.single('file'), uploadStudentList);
router.get('/:classId/score/student/list', checkTeacherClass, getStudentByClassId);
router.get('/:classId/score/student/:studentIdId', checkTeacherClass, getAssignmentsScoreByClassIdByStudentIdAndCountTotal);

router.get('/:classId/score/full/file', checkTeacherClass, downloadFullScoreByClassId);
router.get('/:classId/score/full/score', checkTeacherClass, getAssignmentsScoreByClassId);

router.put('/:classId/score/class-score/assignment/:assignmentId/mark-returned-all', checkTeacherClass, markReturnedByAssignmentId);
router.route('/:classId/score/class-score/assignment/:assignmentId/file')
    .get(checkTeacherClass, downloadTemplateScoreByAssignmentId)
    .post(checkTeacherClass, upload.single('file'), uploadScoreByAssignmentId);

router.get('/:classId/score/class-score/assignment/:assignmentId/:classStudentId', checkTeacherAndStudentInClass, getAssignmentsScoreByClassStudentId);

router.post('/:classId/score/class-score/', checkTeacherClass, createClassScore);
router.put('/:classId/score/class-score/:scoreId', checkTeacherClass, updateClassScoreById);
router.post('/:classId/score/class-score/draft', checkTeacherClass, createClassScore);
router.put('/:classId/score/class-score/draft/:scoreId', checkTeacherClass, updateClassScoreById);

router.get('/:classId/review/request/class-studentid', checkStudentInClass, getStudentClassId);

router.post('/:classId/review/request', checkStudentInClass, createAssignmentReviewRequest);
router.get('/:classId/review/request/:assignmentId', checkStudentInClass, getOneAssignmentReviewRequestForStudent);
router.get('/:classId/review/request/:assignmentId/get-all', checkTeacherClass, getAllReviewRequestsInOneAssignment);
router.get('/:classId/review/request/:assignmentId/get-one/:classStudentId', checkTeacherAndStudentInClass, getOneAssignmentReviewRequest);
router.route('/:classId/review/request/:assignmentId/chat/:reviewRequestId')
    .get(checkTeacherAndStudentInClass, getReviewChatByReviewRequestId)
    .post(checkTeacherAndStudentInClass, createReviewChat);

router.put('/:classId/review/request/:assignmentId/accept-newscore/:classStudentId', checkTeacherClass, acceptRequestByNewScoreFromTeacher);
router.put('/:classId/review/request/:assignmentId/accept-score/:classStudentId', checkTeacherClass, acceptScoreRequestByStudent);
router.put('/:classId/review/request/:assignmentId/ignore-score/:classStudentId', checkTeacherClass, ignoreScoreRequestByStudent);

export default router;
