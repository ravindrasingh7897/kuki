import mongoose from 'mongoose';

const pollutionSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  location: { type: String, required: true },
  Benzene: { type: Number, required: true },
  Toluene: { type: Number, required: true },
  NO: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Pollution', pollutionSchema);
