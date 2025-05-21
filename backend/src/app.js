require("dotenv").config();
const express = require("express");
const { connectDb } = require("../src/config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const seedDatabase = require("./utils/postData");
const Coin = require("./models/holdings");
const CapitalGains = require("./models/CapitalGains");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Existing Routes
app.get('/api/holdings', async (req, res) => {
  try {
    const holdings = await Coin.find();
    res.json(holdings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
});

app.get('/api/capital-gains', async (req, res) => {
  try {
    const capitalGains = await CapitalGains.findOne();
    res.json(capitalGains);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch capital gains' });
  }
});

// New API to Calculate Post-Harvesting Capital Gains
app.get('/api/calculate-capital-gains/:id', async (req, res) => {
  try {
    // Extract selectedHoldingIds from route params (e.g., /:id = "id1,id2,id3")
    const selectedHoldingIds = req.params.id ? req.params.id.split(',') : [];

    if (!Array.isArray(selectedHoldingIds) || selectedHoldingIds.length === 0) {
      return res.status(400).json({ error: 'Selected holding IDs must be a non-empty array' });
    }

    // Fetch initial capital gains
    const initialCapitalGains = await CapitalGains.findOne();
    if (!initialCapitalGains) {
      return res.status(404).json({ error: 'Capital gains data not found' });
    }

    // Fetch selected holdings
    const selectedHoldings = await Coin.find({ _id: { $in: selectedHoldingIds } });
    if (selectedHoldings.length !== selectedHoldingIds.length) {
      return res.status(404).json({ error: 'Some holdings not found' });
    }

    // Calculate initial realized gains (pre-harvesting)
    const initialStcgNet = initialCapitalGains.capitalGains.stcg.profits - initialCapitalGains.capitalGains.stcg.losses;
    const initialLtcgNet = initialCapitalGains.capitalGains.ltcg.profits - initialCapitalGains.capitalGains.ltcg.losses;
    const initialRealizedGains = initialStcgNet + initialLtcgNet;

    // Initialize updated capital gains with initial values
    let updatedCapitalGains = {
      stcg: {
        profits: initialCapitalGains.capitalGains.stcg.profits,
        losses: initialCapitalGains.capitalGains.stcg.losses
      },
      ltcg: {
        profits: initialCapitalGains.capitalGains.ltcg.profits,
        losses: initialCapitalGains.capitalGains.ltcg.losses
      }
    };

    // Update capital gains based on selected holdings
    selectedHoldings.forEach(holding => {
      // Short-term gains/losses
      if (holding.stcg.gain > 0) {
        updatedCapitalGains.stcg.profits += holding.stcg.gain;
      } else if (holding.stcg.gain < 0) {
        updatedCapitalGains.stcg.losses += Math.abs(holding.stcg.gain);
      }

      // Long-term gains/losses
      if (holding.ltcg.gain > 0) {
        updatedCapitalGains.ltcg.profits += holding.ltcg.gain;
      } else if (holding.ltcg.gain < 0) {
        updatedCapitalGains.ltcg.losses += Math.abs(holding.ltcg.gain);
      }
    });

    // Calculate updated realized gains (post-harvesting)
    const updatedStcgNet = updatedCapitalGains.stcg.profits - updatedCapitalGains.stcg.losses;
    const updatedLtcgNet = updatedCapitalGains.ltcg.profits - updatedCapitalGains.ltcg.losses;
    const updatedRealizedGains = updatedStcgNet + updatedLtcgNet;

    // Calculate savings
    const savings = initialRealizedGains > updatedRealizedGains ? initialRealizedGains - updatedRealizedGains : 0;

    // Respond with updated capital gains and savings
    res.json({
      capitalGains: updatedCapitalGains,
      savings,
      initialRealizedGains,
      updatedRealizedGains
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate capital gains', details: err.message });
  }
});

connectDb()
  .then(() => {
    console.log("Database Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}.....`);
    });
  })
  .catch((err) => {
    console.log("Error:", err.message);
  });