import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';
const URL = process.env.CONNECTION_URL;

const connectDB = async() => {
    try{
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connection SUCCESS');
    } catch(error){
        console.error('MonggoDB connection FAIL');
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;