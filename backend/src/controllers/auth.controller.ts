import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    (error as any).statusCode = 500;
    (error as any).message = 'Error creating user';
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error('Invalid credentials');
      error.statusCode = 401;
      return next(error);
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const error: any = new Error('Invalid credentials');
      error.statusCode = 401;
      return next(error);
    }
    const token = generateToken(user.id);
    res.json({ token });
  } catch (error) {
    (error as any).statusCode = 500;
    (error as any).message = 'Error logging in';
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // The user object is attached to the request in the protect middleware
    const user = await User.findById((req as any).user.id).select('-password');
    res.json(user);
  } catch (error) {
    (error as any).statusCode = 500;
    (error as any).message = 'Error fetching user';
    next(error);
  }
};

import sendEmail from '../utils/sendEmail';
import crypto from 'crypto';

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error('There is no user with that email');
      error.statusCode = 404;
      return next(error);
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link, or paste it into your browser to complete the process: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message,
      });
      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      const error: any = new Error('Email could not be sent');
      error.statusCode = 500;
      return next(error);
    }
  } catch (error) {
    (error as any).statusCode = 500;
    (error as any).message = 'Server error';
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
export const resetPassword = async (req: Request, res: Response) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    user.password = await hashPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, data: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 