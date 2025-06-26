import { Request, Response } from 'express';
import { Client, IClient } from '../models/client.model';
import { User } from '../models/user.model';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find({ user: (req as any).user.id });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
export const getClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    // Make sure user owns client
    if (client.user.toString() !== (req as any).user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a client
// @route   POST /api/clients
// @access  Private
export const createClient = async (req: Request, res: Response) => {
  try {
    req.body.user = (req as any).user.id;
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req: Request, res: Response) => {
  try {
    let client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    // Make sure user owns client
    if (client.user.toString() !== (req as any).user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    // Make sure user owns client
    if (client.user.toString() !== (req as any).user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await client.deleteOne();
    res.json({ message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 