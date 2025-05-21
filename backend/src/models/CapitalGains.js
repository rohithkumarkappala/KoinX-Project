const mongoose = require("mongoose")

const capitalGainsSchema = new mongoose.Schema({
  capitalGains: {
    stcg: {
      profits: { type: Number, required: true },
      losses: { type: Number, required: true }
    },
    ltcg: {
      profits: { type: Number, required: true },
      losses: { type: Number, required: true }
    }
  }
});

const CapitalGains = mongoose.model('CapitalGains', capitalGainsSchema);

module.exports = CapitalGains