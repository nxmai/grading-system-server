import User from '../user/userModel.js';
import jwt from "jsonwebtoken";
import { userBlackTypeEnum } from "../user/userBlackTypeEnum.js";
import { getEnum } from "../user/userRollEnum.js";
import bcrypt from 'bcrypt'
import express from "express";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";

// Google Auth
import { OAuth2Client } from 'google-auth-library'
import { sendEmail } from '../../utils/send_email.js';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

export function hashPw(pw) {
    const saltRounds = 10
    const hash = bcrypt.hashSync(pw, saltRounds)
    return hash;
}

export function comparePw(src, hash) {
    return bcrypt.compareSync(src, hash)
}

router.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body

    User.find({ email }).then(user => {
        if (user.length == 0) {

            const hash = hashPw(password);
            const newUser = new User({ firstName, lastName, email, password: hash })

            newUser.save((error, user) => {
                if (error) {
                    return res.status(404)
                }
                res.send(user);
            })

        } else {
            res.status(404).json({ message: "Your account has already existed, please log in" })
        }
    })

})

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(401).json({ message: "Please provide email & password" })

    User.find({ email })
        .then(users => {
            if (users.length === 0) {
                console.log(users);
                return res.status(303).json({ message: "User doesn't exist" })
            }

            if (!comparePw(password, users[0].password)) {
                return res.status(401).json({ message: "Wrong password" })
            }

            const accessToken = generateAccessToken({ id: users[0].id });
            res.send(accessToken)
        })
        .catch(error => res.status(404).json(error))
});

export function verifyToken(req, res, next) {
    // const authPaths = ['/auth/login', '/auth/register', '/auth/google'];
    // if (authPaths.includes(req.path)) return next();
    if (req.path.includes('/auth/')) return next();
    const bearerHeader = req.headers['authorization']
    const accessToken = bearerHeader && bearerHeader.split(' ')[1]
    if (accessToken == null) return res.status(401).json({ message: "Unauthorized" })

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (!error) {
            User.findById(decoded.id)
                .then(user => {
                    req.user = user
                    if (user.black_type == userBlackTypeEnum.BAN) {
                        return res.status(404).json({ message: "Your account baned" })
                    }
                    next()
                })
                .catch(error => {
                    return res.status(404).json({ message: "Your account doeasn't exist", error })
                })
        }
        else res.status(404).json({ message: "Lost token", error })
    })
}

export function checkIsAdmin(req, res, next) {
    if (req.user.role != getEnum.ADMIN) {
        return res.status(403).json({ message: "Permission denied" })
    }
    return next();
}

export function checkBlock(req, res, next) {
    if (req.user.black_type != userBlackTypeEnum.BLOCK) {
        return res.status(403).json({ message: "Permission denied" })
    }
    return next();
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}


router.post('/google', catchAsync(async (req, res, next) => {
    const token = req.body.tokenId
    if (!token) throw new AppError("token not found", 404);

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            firstName: given_name,
            lastName: family_name,
            email,
            photoUrl: picture
        });
    }

    const accessToken = generateAccessToken({ id: user.id });
    return res.send(accessToken);
}));

router.get('/confirmation/:token', (req, res) => {
    const { token } = req.params;
    if (!token) return res.status(401).json({ message: "Dont found your token" })

    jwt.verify(token, process.env.EMAIL_SECRET, (error, decoded) => {
        if (!error) {
            User.findByIdAndUpdate(decoded.id, { active: true })
                .then(user => {
                    const accessToken = generateAccessToken({ id: user._id });
                    return res.send(accessToken);
                })
                .catch(error => {
                    return res.status(404).json({ message: "This user does no longer exist or already confirmed email.", error })
                })
        }
        else res.status(404).json({ message: "Lost token", error })
    })
});

router.post('/confirmation', async (req, res) => {
    const { _id, email } = req.body;
    if (!_id || !email) {
        return res.status(404).json({ message: "Missing information" });
    }

    jwt.sign({ id: _id }, process.env.EMAIL_SECRET, async (error, emailToken) => {
        if (error) {
            return res.status(404).json({ message: error.message });
        }
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const link = `${clientUrl}/auth/confirmation/${emailToken}`;
        const message = `Please click the link to confirm your email: ${link}`;

        await sendEmail({
            email,
            name: "Alpha Web Team",
            subject: "Email Confirmation Link",
            message,
        });

        return res.status(201).json({ message: "success" });
    });
});

router.post('/renew-password/send-instruction', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(404).json({ message: "Missing information" });
    }

    User.findOne({ email })
        .then(user => {
            const renewToken = jwt.sign({ id: user._id }, process.env.PASSWORD_RENEW_SECRET, { expiresIn: '15m' });
            const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
            const link = `${clientUrl}/auth/forgot-password/${renewToken}`;
            const message = `Please click the link to renew your password: ${link}`;

            sendEmail({
                email,
                name: "Alpha Web Team",
                subject: "Renew Password Link",
                message,
            });

            return res.status(201).json({ message: "success" });
        })
        .catch(error => {
            return res.status(404).json({ message: "This user doesn's exist.", error });
        })
});

router.post('/renew-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) return res.status(401).json({ message: "Dont found your token" });
    if (!password) return res.status(401).json({ message: "Dont found your new password" });

    const hash = hashPw(password);
    jwt.verify(token, process.env.EMAIL_SECRET, (error, decoded) => {
        if (!error) {
            User.findByIdAndUpdate(decoded.id, { password: hash })
                .then(user => {
                    const accessToken = generateAccessToken({ id: user._id });
                    return res.send(accessToken);
                })
                .catch(error => {
                    return res.status(404).json({ message: "This user doesn's exist.", error });
                })
        }
        else res.status(404).json(error);
    })
});

export default router