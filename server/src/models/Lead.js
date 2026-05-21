import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    leadSource: {
      type: String,
      enum: ['website', 'referral', 'linkedin', 'cold_call', 'email', 'event', 'other'],
      default: 'website',
    },
    status: {
      type: String,
      enum: ['lead', 'prospect', 'customer', 'inactive'],
      default: 'lead',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ owner: 1, status: 1 });
leadSchema.index({ owner: 1, name: 'text', email: 'text', company: 'text' });

const Lead = mongoose.model('Lead', leadSchema, 'leads');
export default Lead;
