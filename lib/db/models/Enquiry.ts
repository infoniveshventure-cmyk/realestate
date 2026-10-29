import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  fullName: string;
  mobileNumber: string;
  email?: string;
  projectId?: mongoose.Types.ObjectId;
  projectName?: string;
  propertyType?: string;
  budgetRange?: string;
  message?: string;
  leadStatus: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';
  source?: 'ProjectForm' | 'HomepageForm' | 'CallbackRequest' | 'WhatsApp' | 'Organic';
  nextFollowUp?: Date;
  lastContactDate?: Date;
  internalNotes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: String,
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    projectName: String,
    propertyType: String,
    budgetRange: String,
    message: String,
    leadStatus: {
      type: String,
      enum: ['New', 'Contacted', 'Follow-up', 'Converted', 'Closed'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['ProjectForm', 'HomepageForm', 'CallbackRequest', 'WhatsApp', 'Organic'],
    },
    nextFollowUp: Date,
    lastContactDate: Date,
    internalNotes: String,
    assignedTo: String,
  },
  { timestamps: true }
);

enquirySchema.index({ leadStatus: 1 });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ mobileNumber: 1 });

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', enquirySchema);
