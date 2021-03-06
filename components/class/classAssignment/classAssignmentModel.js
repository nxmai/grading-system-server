import mongoose from 'mongoose';
const ClassAssignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'an assignment must title'],
    },
    grade: {
        type: Number,
        required: [true, 'an assignment grade must not be null'],
    },
    class: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Class',
        required: [true, 'An assignment must have a ClassID'],
    },
    order: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toObject: { virtuals: true },
})

const ClassAssignment = mongoose.model('ClassAssignment', ClassAssignmentSchema);
export default ClassAssignment;
