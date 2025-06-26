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
exports.deleteClient = exports.updateClient = exports.createClient = exports.getClient = exports.getClients = void 0;
const client_model_1 = require("../models/client.model");
// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield client_model_1.Client.find({ user: req.user.id });
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getClients = getClients;
// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield client_model_1.Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        // Make sure user owns client
        if (client.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getClient = getClient;
// @desc    Create a client
// @route   POST /api/clients
// @access  Private
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.user = req.user.id;
        const client = yield client_model_1.Client.create(req.body);
        res.status(201).json(client);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createClient = createClient;
// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let client = yield client_model_1.Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        // Make sure user owns client
        if (client.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        client = yield client_model_1.Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateClient = updateClient;
// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield client_model_1.Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        // Make sure user owns client
        if (client.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        yield client.deleteOne();
        res.json({ message: 'Client removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteClient = deleteClient;
