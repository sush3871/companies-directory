import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  size: { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '500+'], required: true },
  type: { type: String, enum: ['Private', 'Public', 'Non-Profit', 'Government'], required: true },
  founded: { type: Number },
  website: { type: String },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);