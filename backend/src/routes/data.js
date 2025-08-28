import express from 'express';
import Pollution from '../models/Pollution.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Add new record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { year, month, location, Benzene, Toluene, NO } = req.body;
    const record = await Pollution.create({ year, month, location, Benzene, Toluene, NO });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Get records with filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { year, startYear, endYear, startMonth, endMonth } = req.query;
    let filter = {};
    if (year) filter.year = Number(year);
    if (startYear && endYear) filter.year = { $gte: Number(startYear), $lte: Number(endYear) };
    if (year && startMonth && endMonth) {
      filter.year = Number(year);
      filter.month = { $gte: Number(startMonth), $lte: Number(endMonth) };
    }
    if (!year && !startYear && !endYear) filter.year = 2021;
    const records = await Pollution.find(filter).sort({ year: 1, month: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Edit record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Pollution.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

// Delete record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Pollution.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
});

// Trends for line graph
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const year = Number(req.query.year) || 2021;
    const records = await Pollution.find({ year }).sort({ month: 1 });
    const monthlyTrends = records.map(r => ({
      month: r.month,
      Benzene: r.Benzene,
      Toluene: r.Toluene,
      NO: r.NO
    }));
    res.json({ year, monthlyTrends });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
