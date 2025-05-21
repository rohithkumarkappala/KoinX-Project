const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true
  },
  coinName: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  totalHolding: {
    type: Number,
    required: true
  },
  averageBuyPrice: {
    type: Number,
    required: true
  },
  stcg: {
    balance: {
      type: Number,
      required: true
    },
    gain: {
      type: Number,
      required: true
    }
  },
  ltcg: {
    balance: {
      type: Number,
      required: true
    },
    gain: {
      type: Number,
      required: true
    }
  }
});
const Coin = mongoose.model('Coin', coinSchema)
module.exports = Coin;