import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  slug: string;
  location: string;
  description: string;
  propertyType: 'Residential' | 'Commercial' | 'Plot/Land' | 'Apartment' | 'Villa';
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  price?: number;
  priceRange?: { min: number; max: number };
  size?: number;
  units?: number;
  amenities: string[];
  images: Array<{ cloudinaryId: string; url: string; alt: string }>;
  floorPlans?: Array<{ title?: string; imageUrl: string; size?: string }>;
  brochureUrl?: string;
  location_lat?: number;
  location_lng?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  published: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    location: { type: String, required: true },
    description: String,
    propertyType: {
      type: String,
      enum: ['Residential', 'Commercial', 'Plot/Land', 'Apartment', 'Villa'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
    price: Number,
    priceRange: { min: Number, max: Number },
    size: Number,
    units: Number,
    amenities: [String],
    images: [
      {
        cloudinaryId: String,
        url: String,
        alt: String,
      },
    ],
    floorPlans: [
      {
        title: String,
        imageUrl: String,
        size: String,
      },
    ],
    brochureUrl: String,
    location_lat: Number,
    location_lng: Number,
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    createdBy: String,
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ slug: 1 });
projectSchema.index({ propertyType: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ published: 1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
