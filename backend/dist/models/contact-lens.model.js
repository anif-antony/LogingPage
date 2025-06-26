"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactLens = void 0;
const mongoose_1 = require("mongoose");
const contactLensSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.ContactLens = (0, mongoose_1.model)('ContactLens', contactLensSchema);
