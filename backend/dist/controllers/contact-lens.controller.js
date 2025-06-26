"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactLens = exports.updateContactLens = exports.createContactLens = exports.getContactLens = exports.getContactLenses = void 0;
const contact_lens_model_1 = require("../models/contact-lens.model");
// @desc    Get all contact lenses
// @route   GET /api/lenses
// @access  Private
const getContactLenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactLenses = yield contact_lens_model_1.ContactLens.find({ user: req.user.id });
        res.json(contactLenses);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getContactLenses = getContactLenses;
// @desc    Get single contact lens
// @route   GET /api/lenses/:id
// @access  Private
const getContactLens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactLens = yield contact_lens_model_1.ContactLens.findById(req.params.id);
        if (!contactLens) {
            return res.status(404).json({ message: 'Contact lens not found' });
        }
        if (contactLens.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(contactLens);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getContactLens = getContactLens;
// @desc    Create a contact lens
// @route   POST /api/lenses
// @access  Private
const createContactLens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.user = req.user.id;
        const contactLens = yield contact_lens_model_1.ContactLens.create(req.body);
        res.status(201).json(contactLens);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createContactLens = createContactLens;
// @desc    Update a contact lens
// @route   PUT /api/lenses/:id
// @access  Private
const updateContactLens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contactLens = yield contact_lens_model_1.ContactLens.findById(req.params.id);
        if (!contactLens) {
            return res.status(404).json({ message: 'Contact lens not found' });
        }
        if (contactLens.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        contactLens = yield contact_lens_model_1.ContactLens.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.json(contactLens);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateContactLens = updateContactLens;
// @desc    Delete a contact lens
// @route   DELETE /api/lenses/:id
// @access  Private
const deleteContactLens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactLens = yield contact_lens_model_1.ContactLens.findById(req.params.id);
        if (!contactLens) {
            return res.status(404).json({ message: 'Contact lens not found' });
        }
        if (contactLens.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        yield contactLens.deleteOne();
        res.json({ message: 'Contact lens removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteContactLens = deleteContactLens;
