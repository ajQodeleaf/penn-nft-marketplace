const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: Number,
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0.0,
    },
    nftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NFT",
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.plugin(mongooseSequence, { inc_field: "transactionId" });

transactionSchema.index({ buyerId: 1 });
transactionSchema.index({ sellerId: 1 });
transactionSchema.index({ nftId: 1 });
transactionSchema.index({ collectionId: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
