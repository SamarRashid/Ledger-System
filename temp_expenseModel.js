const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  nameUrdu: { type: String, required: true },
  nameEnglish: { type: String },
  calculationType: { type: String, required: true },
  rate: { type: Number, default: 0 },
  sellerApplicable: { type: Boolean, default: false },
  buyerApplicable: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
