const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/summary', async (req, res) => {
  try {
    const { range } = req.query; // week, month, all
    let query = { userId: req.user.id };

    if (range === 'week') {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      query.date = { $gte: start };
    } else if (range === 'month') {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      query.date = { $gte: start };
    }

    const trades = await Trade.find(query);

    let totalProfit = 0;
    let totalLoss = 0;
    let profitTrades = 0;
    let lossTrades = 0;

    trades.forEach(t => {
      if (t.type === 'profit') {
        totalProfit += t.amount;
        profitTrades++;
      } else {
        totalLoss += t.amount;
        lossTrades++;
      }
    });

    res.json({
      totalProfit,
      totalLoss,
      netPnL: totalProfit - totalLoss,
      totalTrades: trades.length,
      profitTrades,
      lossTrades
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/calendar', async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    if (!month) return res.status(400).json({ message: 'Month required' });

    const [yyyy, mm] = month.split('-');
    const start = new Date(yyyy, mm - 1, 1);
    const end = new Date(yyyy, mm, 0, 23, 59, 59, 999);

    const trades = await Trade.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    const calendar = {};
    trades.forEach(t => {
      const dateStr = t.date.toISOString().split('T')[0];
      if (!calendar[dateStr]) calendar[dateStr] = 0;
      calendar[dateStr] += (t.type === 'profit' ? t.amount : -t.amount);
    });

    res.json(calendar);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/chart', async (req, res) => {
    try {
        const trades = await Trade.find({ userId: req.user.id }).sort({ date: 1 });
        res.json(trades);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
