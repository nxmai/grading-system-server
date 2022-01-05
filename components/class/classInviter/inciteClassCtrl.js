import InviteClassLink from "./inviteClassLinkModel.js";
import InviteUserClass from "./inviteUserClassModel.js";
import ClassUser from "../classUser/classUserModel.js";
import { EnumUserRoll } from "../classUser/userClassRollEnum.js";
import { sendEmail } from "../../../utils/send_email.js"

import AppError from "../../../utils/appError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";

export const getInviteLinkByClassID = async (req, res) => {
    try {
        const classId = req.params.classId;
        const oneLink = await InviteClassLink.findOne({ class: classId });
        if (!oneLink) throw Error("not found this invite link for this class");
        if (!oneLink.isActive) throw Error("this link is not active");

        res.status(201).json(oneLink);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createInviteLink = async (req, res) => {
    try {
        const classId = req.params.classId;
        const newLink = new InviteClassLink({
            class: classId,
            linkText: classId,
        });
        await newLink.save();
        console.log(newLink);

        return res.status(201).json(newLink);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateInviteLinkByClassID = async (req, res) => {
    try {
        const classId = req.params.classId;
        const oneLink = await InviteClassLink.findOne({ class: classId });
        if (!oneLink) throw Error("not found this invite link for this class");
        const isActive = req.body.isActive;
        oneLink.isActive = isActive;

        await oneLink.save();

        res.status(201).json(oneLink);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const approveInvite = async (req, res) => {
    try {
        const inviteLink = req.params.inviteLink;
        const oneLink = await InviteClassLink.findOne({ linkText: inviteLink });
        if (!oneLink) throw Error("not found this invite link for this class");
        if (!oneLink.isActive) throw Error("this link not active");

        // get user info
        const user = req.user;
        // find user in invite user class
        const inviteWithRole = await InviteUserClass.findOne({
            email: user.email,
            link: oneLink._id,
        });
        let inviteRoll = inviteWithRole ? inviteWithRole.role : EnumUserRoll.STUDENT;

        // add user to classs
        const result = new ClassUser({
            class: oneLink.class,
            user: user._id,
            role: inviteRoll,
        });
        await result.save();

        // delete user invite if
        if (inviteWithRole) {
            await InviteUserClass.deleteOne({
                email: user.email,
                link: oneLink._id,
            });
        }

        return res.status(201).json(oneLink);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createInviteSendMail = async (req, res) => {
    try {
        const inviteLinkId = req.params.inviteLinkId;
        // check link active
        const inviteLink = await InviteClassLink.findOne({
            linkText: inviteLinkId,
        });
        if (!inviteLink) throw Error("no found this link");
        if (!inviteLink.isActive) throw Error("this link not active");

        // get dto
        const { email, role } = req.body;

        const newInviteWithRole = new InviteUserClass({
            link: inviteLink._id,
            email: email,
            role: role,
        });
        await newInviteWithRole.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const message = `Teacher of class invite you to class with ${role}. Please checkout link: ${clientUrl}/confirm/${inviteLinkId}`

        await sendEmail({
            email: email,
            name: "Alpha Web Team",
            subject: "Invitation Link to Doodle Classroom",
            message: message,
        });

        return res.status(201).json({ message: "success" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const listInviteUserClassByInviteLinkText = catchAsync( async (req, res, next) => {
    const inviteLinkText = req.params.inviteLinkText;
    // check link active
    const inviteLink = await InviteClassLink.findOne({
        linkText: inviteLinkText,
    });
    if (!inviteLink) throw Error("no found this link");
    const reps = await InviteUserClass.find({
        link: inviteLink.id
    });
    return sendResponse(reps, 200, res);
});

export const deleteInviteUser =  catchAsync( async (req, res, next) => {
    const inviteUserClassId = req.params.inviteUserClassId;
    await InviteUserClass.findByIdAndDelete(inviteUserClassId);

    return sendResponse(null, 200, res);
});
