import express from 'express';
import mongoose from 'mongoose';
const opengdsSchema = new mongoose.Schema({}, { strict: false, collection: 'opengds' });
const Opengds = mongoose.models.Opengds || mongoose.model('Opengds', opengdsSchema, 'opengds');
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Add new record 
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { year, month, location, Benzene, Toluene, NO } = req.body;

    // Save to opengds collection 
    const opengdsRecord = await Opengds.create({
      City: location,
      "Month - Year": `${getMonthAbbr(month)}-${String(year).slice(-2)}`,
      "NO (µg/m3)": Number(NO) || 0,
      "Benzene (µg/m3)": Number(Benzene) || 0,
      "Toluene (µg/m3)": Number(Toluene) || 0

    });

  res.status(201).json({ opengdsRecord });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Helper to get month abbreviation
function getMonthAbbr(month) {
  const abbrs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return abbrs[(month || 1) - 1] || "Jan";
}



export default router;
