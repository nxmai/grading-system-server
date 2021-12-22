import dotenv from "dotenv";
dotenv.config();

import {classes, user, classUser, gradeAssi} from './dummy.js';
import connectDB from './configData.js';
// import Class from '../components/class/classModel.js';
// import User from "../components/user/userModel.js";
// import ClassUser from "../components/class/classUserModel.js";
import ClassScoreModel from "../components/class/classScore/classScoreModel.js";

connectDB();

const importData = async() => {
    try {
        // await Class.deleteMany();
        // await Class.insertMany(classes);

        // await User.deleteMany();
        // await User.insertMany(user);

        // await ClassUser.deleteMany();
        // await ClassUser.insertMany(classUser);

        await ClassScoreModel.deleteMany();
        await ClassScoreModel.insertMany(gradeAssi);

        console.log('Data import success');
        process.exit();
    } catch(error){
        console.error('Error with data import', error);
        process.exit(1);
    }
};

importData();
//use to import fake data for frontend, delete when complete backend