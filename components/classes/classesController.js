import Class from "./classModel.js";
import InviteClassLink from "./inviteClassLinkModel.js";
import InviteUserClass from "./inviteUserClassModel.js";
import ClassUser from './classUserModel.js';

export const getClasses = async (req, res) => {
  try {
    const total = await Class.find();

    res.status(200).json(total);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  try{
    const newClass = new Class({...req.body});
    await newClass.save();

    res.status(201).json(newClass);
  } catch{
    res.status(404).json({ message: error.message });
  }
}

// ----------------------
//      INVITE LINK      
// ----------------------

export const createInviteLink = async (req, res) => {
  try{
    const classId = req.param.classId;
    const newLink = new InviteClassLink({
      class: classId,
      linkText: classId,
    });
    await newLink.save();

    res.status(201).json(newLink);
  } catch{
    res.status(404).json({ message: error.message });
  }
}

export const updateInviteLinkByClassID = async (req, res) => {
  try{
    const classId = req.param.classId;
    const oneLink = await InviteClassLink.findOne({ class: classId });
    if (!oneLink) throw Error('not found this invite link for this class');
    const isActive = req.body.isActive;
    oneLink.isActive = isActive;

    await oneLink.save();

    res.status(201).json(oneLink);
  } catch{
    res.status(404).json({ message: error.message });
  }
}

export const approveInvite = async (req, res) => {
  try{
    const inviteLink = req.param.inviteLink;
    const oneLink = await InviteClassLink.findOne({ linkText: inviteLink });
    if (!oneLink) throw Error('not found this invite link for this class');
    if (!oneLink.isActive) throw Error('this link not active');

    // get user info
    const user = req.user;
    // find user in invite user class
    const inviteWithRole = await InviteUserClass.findOne({
      user: user._id,
      link: oneLink._id,
    });

    let inviteRoll = inviteWithRole? inviteWithRole : 'student';

    // add user to class
    const result = new ClassUser({
      class: oneLink.class,
      user: user._id,
      role: inviteRoll,
    })
    await oneLink.save();

    // TODO:
    // check if user had join in class, then update role if 

    // delete user invite if
    if (inviteWithRole) {
      await InviteUserClass.deleteOne({
        user: user._id,
        link: oneLink._id,
      });
    }

    return res.status(201).json(oneLink);
  } catch{
    res.status(404).json({ message: error.message });
  }
}

export const createInvite = async (req, res) => {
  try{
    const classId = req.param.classId;
    const newLink = new InviteClassLink({
      class: classId,
      linkText: classId,
    });
    await newLink.save();

    res.status(201).json(newLink);
  } catch{
    res.status(404).json({ message: error.message });
  }
}

export const createInviteSendMail = async (req, res) => {
  try{
    const inviteLinkId = req.param.InviteLinkId;
    // check link active
    const inviteLink = await InviteUserClass.findById(inviteLinkId);
    if (!inviteLink) throw Error('no found this link')
    if (!inviteLink.isActive) throw Error('this link not active');

    // get dto
    const {userId, role} = req.body;

    const newInviteWithRole = new InviteUserClass({
      link: inviteLink._id,
      user: userId,
      role: role,
    });
    await newInviteWithRole.save();

    // TODO send email

    return res.status(201).json(newInviteWithRole);
  } catch{
    return res.status(404).json({ message: error.message });
  }
}

export const deleteInvite = async (req, res) => {
  try{
    const inviteUserClassId = req.param.inviteUserClassId;
    await InviteUserClass.findByIdAndDelete(inviteUserClassId);

    return res.status(201);
  } catch{
    return res.status(404).json({ message: error.message });
  }
}