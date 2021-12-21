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
    toJSON: { virtuals: true },
});

classStudentIdSchema.index({ studentId: 1, class: 1 }, { unique: true });

classStudentIdSchema.virtual('user', {
    ref: 'User',
    foreignField: 'studentCardID',
    localField: 'studentId',
});

const classStudentId = mongoose.model('ClassStudentId2', classStudentIdSchema);
export default classStudentId;
