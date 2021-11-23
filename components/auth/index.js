import User from '../user/userModel.js';
import jwt, { decode } from "jsonwebtoken";
import bcrypt from 'bcrypt'
import express from "express";

// Google Auth
import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const router = express.Router();

router.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const saltRounds = 10

    User.find({ email }).then(user => {
        if (user.length == 0) {

            const hash = bcrypt.hashSync(password, saltRounds)
            const newUser = new User({ firstName, lastName, email, password: hash })

            newUser.save((error, user) => {
                if (error) {
                    return res.status(404)
                }
                const accessToken = generateAccessToken({ id: user.id });
                res.send(accessToken)
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

            if (users.length == 0) {
                return res.redirect('/register', { email })
            }

            if (!bcrypt.compareSync(password, users[0].password)) {
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
                    next()
                })
                .catch(error => {
                    return res.status(404).json({ message: "Your account doeasn't exist", error })
                })
        }
        else res.status(404).json({ message: "Lost token", error })
    })
}

function generateAccessToken(user) {
    console.log('[jwt sign] ', user);
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

router.post('/google', (req, res) => {
    const token = req.body.tokenId

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, given_name, family_name, picture } = payload;

        const user = await User.findOne({ email });
            if (!user) {
                const newUser = new User({ firstName: given_name, lastName: family_name, email, photoUrl: picture })
                newUser.save((error, user) => {
                    if (error) {
                        return res.status(401).json({ message: "Something wrong happen, can't save your account" })
                    }
                    const accessToken = generateAccessToken({ id: user.id });
                    return res.send(accessToken)
                })
            } else {
                const accessToken = generateAccessToken({ id: user.id });
                return res.send(accessToken);
            }
    }
    verify().catch(console.error);
})

// router.get('/access', verifyToken, (req, res) => {
//     res.json({ message: "Access...", user: req.user })
// })

// router.get('/users', (req, res) => {
//     User.find({}).then(users => {
//         res.json({ users })
//     })
// })

export default router