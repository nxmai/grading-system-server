import Class from "./classModel.js";
import InviteClassLink from "./inviteClassLinkModel.js";
import InviteUserClass from "./inviteUserClassModel.js";
import ClassUser from "./classUserModel.js";
import { sendEmail } from "../../utils/send_email.js";

export const getClasses = async (req, res) => {
    try {
        const userId = req.user._id;
        const classByUserId = await ClassUser.find({ user: userId }).populate({
            path: "class",
            select: 'name subject description',
        });
        const total = classByUserId.map((item) => item.class);

        res.status(200).json(total);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getClassById = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classData = await Class.findById(classId);
        
        res.status(200).json(classData);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createClass = async (req, res) => {
    try {
        const userId = req.user._id;
        const newClass = new Class({ ...req.body });
        await newClass.save();

        const newClassUser = new ClassUser({class: newClass._id, user: userId, role: "teacher"});
        await newClassUser.save();

        res.status(201).json(newClassUser);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

export const getTeacherOfClass = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classUsers = await ClassUser.find({ class: classId }).populate({
            path: "user",
            // select: 'firstName lastName email'
        });

        const result = classUsers
            .filter((classUser) => classUser.role === "teacher")
            .map((classUser) => classUser.user);

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getStudentOfClass = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classUsers = await ClassUser.find({ class: classId }).populate({
            path: "user",
            // select: 'firstName lastName email'
        });

        const result = classUsers
            .filter((classUser) => classUser.role === "student")
            .map((classUser) => classUser.user);

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// ----------------------
//      INVITE LINK
// ----------------------

export const getInviteLinkByClassID = async (req, res) => {
    try {
        const classId = req.params.classId;
        const oneLink = await InviteClassLink.findOne({ class: classId });
        if (!oneLink) throw Error("not found this invite link for this class");
        if (!oneLink.isActive) throw Error("this link is not active");

        res.status(201).json(oneLink);
    } catch (error){
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
    } catch (error){
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
    } catch (error){
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
        let inviteRoll = inviteWithRole ? inviteWithRole.role : "student";

        // add user to class
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
    } catch (error){
        res.status(404).json({ message: error.message });
    }
};

export const createInvite = async (req, res) => {
    try {
        const classId = req.param.classId;
        const newLink = new InviteClassLink({
            class: classId,
            linkText: classId,
        });
        await newLink.save();

        res.status(201).json(newLink);
    } catch (error){
        res.status(404).json({ message: error.message });
    }
};

export const createInviteSendMail = async (req, res) => {
    try {
        const inviteLinkId = req.params.inviteLinkId;
        // check link active
        const inviteLink = await InviteClassLink.findOne({linkText: inviteLinkId});
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

        // TODO send email
        await sendEmail({
            email: email,
            name: "Nhut",
            subject: "asdf",
            message: "asf dsd fg"
        })

        return res.status(201).json({message: "success"});
    } catch (error){
        return res.status(404).json({ message: error.message });
    }
};

export const deleteInvite = async (req, res) => {
    try {
        const inviteUserClassId = req.param.inviteUserClassId;
        await InviteUserClass.findByIdAndDelete(inviteUserClassId);

        return res.status(201);
    } catch (error){
        return res.status(404).json({ message: error.message });
    }
};
