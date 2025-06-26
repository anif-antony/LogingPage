import { Schema, model, Document, Types } from 'mongoose';

export interface IContactLens extends Document {
  user: Types.ObjectId;
  name: string;
  brand: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  power: number;
  baseCurve: number;
  diameter: number;
  quantity: number;
  price: number;
  purchaseDate: Date;
  expiryDate: Date;
  createdAt: Date;
}

const contactLensSchema = new Schema<IContactLens>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: [true, 'Please add a type'],
  },
  power: {
    type: Number,
    required: [true, 'Please add a power'],
  },
  baseCurve: {
    type: Number,
    required: [true, 'Please add a base curve'],
  },
  diameter: {
    type: Number,
    required: [true, 'Please add a diameter'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
  },
  price: {
    type: Number,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please add an expiry date'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ContactLens = model<IContactLens>('ContactLens', contactLensSchema); 