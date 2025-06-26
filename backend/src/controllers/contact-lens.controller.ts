import { Request, Response } from 'express';
import { ContactLens } from '../models/contact-lens.model';

// @desc    Get all contact lenses
// @route   GET /api/lenses
// @access  Private
export const getContactLenses = async (req: Request, res: Response) => {
  try {
    const contactLenses = await ContactLens.find({ user: (req as any).user.id });
    res.json(contactLenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single contact lens
// @route   GET /api/lenses/:id
// @access  Private
export const getContactLens = async (req: Request, res: Response) => {
  try {
    const contactLens = await ContactLens.findById(req.params.id);
    if (!contactLens) {
      return res.status(404).json({ message: 'Contact lens not found' });
    }
    if (contactLens.user.toString() !== (req as any).user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(contactLens);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a contact lens
// @route   POST /api/lenses
// @access  Private
export const createContactLens = async (req: Request, res: Response) => {
  try {
    req.body.user = (req as any).user.id;
    const contactLens = await ContactLens.create(req.body);
    res.status(201).json(contactLens);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Update a contact lens
// @route   PUT /api/lenses/:id
// @access  Private
export const updateContactLens = async (req: Request, res: Response) => {
  try {
    let contactLens = await ContactLens.findById(req.params.id);
    if (!contactLens) {
      return res.status(404).json({ message: 'Contact lens not found' });
    }
    if (contactLens.user.toString() !== (req as any).user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    contactLens = await ContactLens.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(contactLens);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a contact lens
// @route   DELETE /api/lenses/:id
// @access  Private
export const deleteContactLens = async (req: Request, res: Response) => {
  try {
    const contactLens = await ContactLens.findById(req.params.id);
    if (!contactLens) {
      return res.status(404).json({ message: 'Contact lens not found' });
    }
    if (contactLens.user.toString() !== (req as any).user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await contactLens.deleteOne();
    res.json({ message: 'Contact lens removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 