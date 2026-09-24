const Trade = require('../models/Trade');

const getTrades = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { userId: req.user.id };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const trades = await Trade.find(query).sort({ date: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTrade = async (req, res) => {
  try {
    const { amount, type, date, journal, pair, entryTime, exitTime } = req.body;
    let imageUrl = req.body.imageUrl;
    
    // Safely read req.file.path (Cloudinary URL)
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
      console.log("Uploaded File Details:", req.file);
    }
    
    const trade = new Trade({
      userId: req.user.id,
      amount,
      type,
      date,
      imageUrl,
      journal,
      pair,
      entryTime,
      exitTime
    });
    await trade.save();
    res.json(trade);
  } catch (err) {
    console.error("Trade Creation Error:", err);
    res.status(400).json({ message: err.message || 'Server error or upload failed' });
  }
};

const updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    res.json(trade);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const clearTrades = async (req, res) => {
  try {
    const { confirm } = req.body;
    if (!confirm) return res.status(400).json({ message: 'Confirmation required' });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    await Trade.deleteMany({
      userId: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    res.json({ message: 'Monthly data cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    res.json({ message: 'Trade deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTrades, createTrade, updateTrade, clearTrades, deleteTrade };
