import mongoose, { Document, Schema } from 'mongoose';
import { Timestamps } from '../common/common.model';

export interface IImage {
  filename: string;
  description?: string;
  uploaderEmail: string;
  directUrl: string;
}

export interface IImageDocument extends Timestamps, Document, IImage {}

const ImageSchema = new Schema({
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
    required: false,
  },
  directUrl: {
    type: String,
    required: false,
  },
});

export const ImageModel = mongoose.model<IImageDocument>('Image', ImageSchema);
