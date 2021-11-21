import mongoose from 'mongoose';

const ClassSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  }
})

const Class = mongoose.model('Class', ClassSchema);

export default Class;
