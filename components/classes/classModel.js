import mongoose from 'mongoose';

const ClassSchema = mongoose.Schema({
  className: {
    type: String,
    trim: true,
    required: true,
  },
  classSubject: {
    type: String,
    trim: true,
  },
  classTeacher: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true
})

const Class = mongoose.model('Class', ClassSchema);

export default Class;
