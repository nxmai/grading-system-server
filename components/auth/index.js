import User from '../user/userModel.js';
import jwt from "jsonwebtoken";
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
                    return res.render('register', { error })
                }
                const accessToken = jwt.sign(
                    { id: user.id, name: user.firstName + " " + user.lastName },
                    process.env.PRIVATE_KEY,
                );
                // res.json({ accessToken })
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
        .then(user => {

            if (user.length == 0) {
                return res.redirect('/register', { email })
            }

            if (!bcrypt.compareSync(password, user[0].password)) {
                return res.status(401).json({ message: "Wrong password" })
            }
            const accessToken = jwt.sign(
                { id: user[0]._id, name: user[0].firstName + " " + user[0].lastName },
                process.env.PRIVATE_KEY,
            );
            // return res.json({ accessToken })
            res.send(accessToken)
        })
        .catch(error => res.status(404).json(error))
});

export function verifyToken(req, res, next) {
    // const authPaths = ['/auth/login', '/auth/register', '/auth/google'];
    // if (authPaths.includes(req.path)) return next();
    if(req.path.includes('/auth/')) return next();
    const bearerHeader = req.headers['authorization']
    const accessToken = bearerHeader && bearerHeader.split(' ')[1]
    if (accessToken == null) return res.status(401).json({ message: "Unauthorized" })

    jwt.verify(accessToken, process.env.PRIVATE_KEY, (error, decoded) => {
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

router.post('/google', (req, res, next) => {
    const token = req.body.tokenId

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, given_name, family_name, picture } = payload

        User.find({ email }).then(user => {
            if (user.length == 0) {
                const newUser = new User({ firstName: given_name, lastName: family_name, email, picture })
                newUser.save((error, user) => {
                    if (error) {
                        return res.status(401).json({ message: "Something wrong happen, can't save your account" })
                    }
                    const accessToken = jwt.sign(
                        { id: user.id, name: user.firstName + " " + user.lastName },
                        process.env.PRIVATE_KEY,
                    );
                    res.send(accessToken)
                    next()
                })
            }
            const accessToken = jwt.sign(
                { id: user[0].id, name: user[0].firstName + " " + user[0].lastName },
                process.env.PRIVATE_KEY,
            );
            res.send(accessToken)
            next()
        })
    }
    verify().catch(console.error);
})

router.get('/access', verifyToken, (req, res) => {
    res.json({ message: "Access...", user: req.user })
})

router.get('/users', (req, res) => {
    User.find({}).then(users => {
        res.json({ users })
    })
})

router.post('/logout', (req, res) => {
    res.redirect('/login')
})

export default router