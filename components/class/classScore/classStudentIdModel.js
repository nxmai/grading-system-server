import mongoose from 'mongoose';

const classStudentIdSchema = new mongoose.Schema({
    studentId: {
        type: String,
    },
    class: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Class',
        required: [true, 'Score must have a ClassID'],
    },
    fullName: {
        type: String,
        default: "Noname",
    },

}, {
    timestamps: true,
    toObject: { virtuals: true },
});

classStudentIdSchema.virtual('user', {
    ref: 'User',
    foreignField: 'studentCardID',
    localField: 'studentId',
});

const classStudentId = mongoose.model('ClassStudentId', classStudentIdSchema);
export default classStudentId;
