import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  tagline: string;
  about: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  privacyPolicy: string;
  termsConditions: string;
  services: Array<{
    title: string;
    description: string;
  }>;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: 'Nivesh Ventures' },
    tagline: { type: String, default: 'Together We Grow' },
    about: String,
    whatsappNumber: String,
    email: String,
    phone: String,
    address: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String,
      youtube: String,
    },
    privacyPolicy: String,
    termsConditions: String,
    services: [
      {
        title: String,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
