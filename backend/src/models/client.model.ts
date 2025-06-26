import { Schema, model, Document, Types } from 'mongoose';

export interface IClient extends Document {
  user: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

const clientSchema = new Schema<IClient>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Client = model<IClient>('Client', clientSchema); 