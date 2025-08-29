import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Define a dynamic schema for opengds
const opengdsSchema = new mongoose.Schema({}, { strict: false, collection: 'opengds' });
const Opengds = mongoose.models.Opengds || mongoose.model('Opengds', opengdsSchema, 'opengds');


// GET all documents from opengds collection
router.get('/', authenticateToken, async (req, res) => {
  try {
    const records = await Opengds.find({}).limit(100); 
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADD new record to opengds
router.post('/', authenticateToken, async (req, res) => {
  try {
    const record = await Opengds.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// UPDATE a record in opengds
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Opengds.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// DELETE a record from opengds
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Opengds.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid request', error: err.message });
  }
});

export default router;
