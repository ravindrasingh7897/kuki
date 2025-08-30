import express from 'express';
import mongoose from 'mongoose';
const opengdsSchema = new mongoose.Schema({}, { strict: false, collection: 'opengds' });
const Opengds = mongoose.models.Opengds || mongoose.model('Opengds', opengdsSchema, 'opengds');
import { authenticateToken } from '../middleware/auth.js';


const router = express.Router();
// Secure all routes in this router
router.use(authenticateToken);


// GET /api/data with filtering
router.get('/', async (req, res) => {
  try {
    const { year, startYear, endYear, startMonth, endMonth } = req.query;
    let filter = {};
    const parseMonthYear = (str) => {
      if (!str) return { month: 1, year: 2021 };
      const [monthStr, yearStr] = str.split('-');
      const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
      return {
        month: monthMap[monthStr] || 1,
        year: yearStr ? 2000 + parseInt(yearStr) : 2021
      };
    };

    // Fetch all records
    let records = await Opengds.find({});
    records = records.map(item => {
      const { month, year: y } = parseMonthYear(item["Month - Year"]);
      return {
        id: item._id,
        location: item.City || item.city || "",
        year: y,
        month,
        benzene: Number(item["Benzene (µg/m3)"]) || 0,
        toluene: Number(item["Toluene (µg/m3)"]) || 0,
        no: Number(item["NO (µg/m3)"]) || 0,
      };
    });

    // Filtering logic
    if (year && startMonth && endMonth) {
      // Year + month range
      records = records.filter(r => r.year === parseInt(year) && r.month >= parseInt(startMonth) && r.month <= parseInt(endMonth));
    } else if (startYear && endYear) {
      // Year range
      records = records.filter(r => r.year >= parseInt(startYear) && r.year <= parseInt(endYear));
    } else if (year) {
      // Single year
      records = records.filter(r => r.year === parseInt(year));
    } else {
      // Default: year 2021
      records = records.filter(r => r.year === 2021);
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch data', error: err.message });
  }
});

// Add new record 
router.post('/', async (req, res) => {
  try {
    const { year, month, location, Benzene, Toluene, NO } = req.body;
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

// Edit record
router.put('/:id', async (req, res) => {
  try {
    const { year, month, location, Benzene, Toluene, NO } = req.body;
    const update = {
      City: location,
      "Month - Year": `${getMonthAbbr(month)}-${String(year).slice(-2)}`,
      "NO (µg/m3)": Number(NO) || 0,
      "Benzene (µg/m3)": Number(Benzene) || 0,
      "Toluene (µg/m3)": Number(Toluene) || 0
    };
    const updated = await Opengds.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.json({ updated });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update', error: err.message });
  }
});

// Delete record
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Opengds.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.json({ deleted });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete', error: err.message });
  }
});

// Helper to get month abbreviation
function getMonthAbbr(month) {
  const abbrs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return abbrs[(month || 1) - 1] || "Jan";
}



export default router;
