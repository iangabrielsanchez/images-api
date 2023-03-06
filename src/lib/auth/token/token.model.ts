import mongoose, { Document, Schema } from 'mongoose';
import { Timestamps } from '../../common/common.model';

export interface IToken {
  token: string;
  expires?: Date;
}

export interface ITokenDocument extends Timestamps, Document, IToken {}

const TokenSchema = new Schema(
  {
    token: {
      required: true,
      type: 'String',
      unique: true,
    },
    expires: {
      required: false,
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const TokenModel = mongoose.model<ITokenDocument>('Token', TokenSchema);
