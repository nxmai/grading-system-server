import mongoose from 'mongoose';

const ClassSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  coverUrl: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
}, {
  timestamps: true,
})

const Class = mongoose.model('Class', ClassSchema);

export default Class;
