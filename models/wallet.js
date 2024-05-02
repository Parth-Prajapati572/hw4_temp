const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema(
  {
    wallet: {
      type: Number,
      required: true
    },
  },
  { timestamp: true }
);

const Wallet = mongoose.model("wallet", walletSchema);
module.exports = Wallet;
