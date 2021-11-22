import express from "express";
const router = express.Router();

import {
    getClasses, 
    getClassById,
    createClass, 
    getTeacherOfClass,
    getStudentOfClass,
    getInviteLinkByClassID,
    createInviteLink, 
    updateInviteLinkByClassID, 
    approveInvite, 
    createInviteSendMail, 
    deleteInvite 
} from './classController.js';

// one class has ONLY one link invite
router.post('approve/:inviteLink', approveInvite) // approve this usser

router.get('/:classId/invite-link', getInviteLinkByClassID); // get link text invite user of class
router.post('/:classId/invite-link', createInviteLink); // create link invite
router.put('/:classId/invite-link', updateInviteLinkByClassID); // update to deactive link

router.post('/:classId/invite-link/:inviteLinkId/invite', createInviteSendMail); // invite teacher/student with send email
router.delete('/:classId/invite-link/:inviteLinkId/invite/:inviteUserClassId', deleteInvite); // delete teacher invite

router.get('/', getClasses);
router.post('/', createClass);
router.get('/:classId', getClassById);
router.get('/:classId/people/teacher', getTeacherOfClass);
router.get('/:classId/people/student', getStudentOfClass);

export default router;
