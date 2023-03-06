import mongoose, { Document, Schema } from 'mongoose';
import { Timestamps } from '../common/common.model';

export interface IImage {
  filename: string;
  description?: string;
  uploaderEmail: string;
}

export interface IImageDocument extends Timestamps, Document, IImage {}

const ImageSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    uploaderEmail: {
      type: String,
      required: true,
    },
    hits: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
    id: false,
  },
);

export const ImageModel = mongoose.model<IImageDocument>('Image', ImageSchema);
