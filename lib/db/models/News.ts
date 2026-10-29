import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  featuredImage?: string;
  cloudinaryId?: string;
  category?: string;
  author?: string;
  authorName?: string;
  seoTitle?: string;
  seoDescription?: string;
  scheduledFor?: Date;
  views?: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: String,
    imageUrl: String,
    featuredImage: String,
    cloudinaryId: String,
    category: String,
    author: String,
    authorName: String,
    seoTitle: String,
    seoDescription: String,
    scheduledFor: Date,
    views: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

newsSchema.index({ slug: 1 });
newsSchema.index({ published: 1 });
newsSchema.index({ createdAt: -1 });

export default mongoose.models.News || mongoose.model<INews>('News', newsSchema);
