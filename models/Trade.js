const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['profit', 'loss'], required: true },
  date: { type: Date, required: true },
  imageUrl: { type: String },
  journal: { type: String },
  pair: { type: String },
  entryTime: { type: String },
  exitTime: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
