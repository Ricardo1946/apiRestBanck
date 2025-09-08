const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    cardId: { type: String, unique: true, required: true }, 
    productId: { type: String, required: true },
    holderName: { type: String, required: false },
    expirationDate: { type: String, required: true }, 
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["INACTIVE", "ACTIVE", "BLOCKED"], default: "INACTIVE" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
