const express = require('express');
const router = express.Router();
const axios = require('axios');

let cachedRate = null;
let lastFetchTime = null;
const CACHE_DURATION = 1000 * 60 * 60 * 3; // 3 hours

router.get('/usd-inr', async (req, res) => {
  const now = new Date().getTime();

  if (cachedRate && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    return res.json({ rate: cachedRate, cachedAt: lastFetchTime, source: 'cache' });
  }

  try {
    if (process.env.CURRENCY_API_KEY === 'mock_currency_key') {
      cachedRate = 83.5;
      lastFetchTime = now;
      return res.json({ rate: cachedRate, cachedAt: lastFetchTime, source: 'live' });
    }

    const response = await axios.get(process.env.CURRENCY_API_URL, {
      params: {
        apikey: process.env.CURRENCY_API_KEY,
        base_currency: 'USD',
        currencies: 'INR'
      }
    });
    
    cachedRate = response.data.data.INR.value;
    lastFetchTime = now;
    res.json({ rate: cachedRate, cachedAt: lastFetchTime, source: 'live' });
  } catch (err) {
    if (cachedRate) {
      res.json({ rate: cachedRate, cachedAt: lastFetchTime, source: 'stale-cache', error: true });
    } else {
      res.status(500).json({ message: 'Failed to fetch currency and no cache available' });
    }
  }
});

module.exports = router;
