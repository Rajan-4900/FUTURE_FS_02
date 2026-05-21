import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: [true, 'Lead is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['note', 'reminder', 'call', 'email', 'meeting'],
      default: 'note',
    },
    title: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    note: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true,
      maxlength: [3000, 'Note cannot exceed 3000 characters'],
    },
    reminderDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

followUpSchema.index({ owner: 1, reminderDate: 1 });
followUpSchema.index({ owner: 1, lead: 1, createdAt: -1 });
followUpSchema.index({ owner: 1, completed: 1, reminderDate: 1 });

const FollowUp = mongoose.model('FollowUp', followUpSchema);
export default FollowUp;
