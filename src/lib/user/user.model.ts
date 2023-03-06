import mongoose, { Document, Schema } from 'mongoose';
import { Timestamps } from '../common/common.model';

export interface IUser {
  email?: string;
  fullName?: string;
  salt?: string;
  hash?: string;
}

export interface IUserDocument extends Timestamps, Document, IUser {}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    fullName: {
      required: true,
      type: String,
    },
    salt: {
      required: true,
      type: String,
      select: false,
    },
    hash: {
      required: true,
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    id: false,
    toObject: {
      transform: function (doc, ret) {
        delete ret.salt;
        delete ret.hash;
      },
    },
  },
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
