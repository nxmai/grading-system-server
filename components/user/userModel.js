import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
    },
    picture: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now(),
    }
})

const User = mongoose.model('user', UserSchema)
export default User