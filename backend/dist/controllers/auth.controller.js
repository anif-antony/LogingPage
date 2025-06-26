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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getMe = exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const hashedPassword = yield (0, hash_1.hashPassword)(password);
        const user = new user_model_1.User({ email, password: hashedPassword });
        yield user.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        error.statusCode = 500;
        error.message = 'Error creating user';
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }
        const isMatch = yield (0, hash_1.comparePassword)(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }
        const token = (0, jwt_1.generateToken)(user.id);
        res.json({ token });
    }
    catch (error) {
        error.statusCode = 500;
        error.message = 'Error logging in';
        next(error);
    }
});
exports.login = login;
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // The user object is attached to the request in the protect middleware
        const user = yield user_model_1.User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (error) {
        error.statusCode = 500;
        error.message = 'Error fetching user';
        next(error);
    }
});
exports.getMe = getMe;
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const crypto_1 = __importDefault(require("crypto"));
// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            const error = new Error('There is no user with that email');
            error.statusCode = 404;
            return next(error);
        }
        // Get reset token
        const resetToken = user.getResetPasswordToken();
        yield user.save({ validateBeforeSave: false });
        // Create reset URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link, or paste it into your browser to complete the process: \n\n ${resetUrl}`;
        try {
            yield (0, sendEmail_1.default)({
                email: user.email,
                subject: 'Password Reset Token',
                message,
            });
            res.status(200).json({ success: true, data: 'Email sent' });
        }
        catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            yield user.save({ validateBeforeSave: false });
            const error = new Error('Email could not be sent');
            error.statusCode = 500;
            return next(error);
        }
    }
    catch (error) {
        error.statusCode = 500;
        error.message = 'Server error';
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get hashed token
    const resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    try {
        const user = yield user_model_1.User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        // Set new password
        user.password = yield (0, hash_1.hashPassword)(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save();
        res.status(200).json({ success: true, data: 'Password reset successful' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.resetPassword = resetPassword;
