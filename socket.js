import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import AppError from "./utils/appError.js";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

import connectDB from "./data/configData.js";
connectDB();

import classesRouter from "./components/class/index.js";
import userRouter from "./components/user/index.js";
import authRouter, { verifyToken } from "./components/auth/index.js";
import globalErrorHandler from './utils/errorHandler.js';

// middleware to show log on console
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        skip(req, res) { return res.statusCode < 400; }, // only log error responses
    }));
}

app.use("/", verifyToken, classesRouter);
app.use("/user", verifyToken, userRouter);
app.use("/auth", authRouter);

app.all('*', (request, response, next) => {
    next(new AppError(`Can't find ${request.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// io.on("connection", (socket) => {

//     socket.on('message', data => {
//         createNotification();
//         io.emit('message', data.message)
//     })

//     socket.on('request', data => {
//         // {studentName} has requested a grade review of {assignmentName} in {className}
//     })
// });

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
    console.log(`Server is running in port ${port}`);
}); 
