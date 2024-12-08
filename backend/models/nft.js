const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    metadataURI: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^https?:\/\/.+/i.test(value),
        message: "Invalid URL",
      },
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nftContract: {
      type: String,
      required: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    tokenId: {
      type: Number,
      required: true,
      min: 0,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  },
  {
    timestamps: true,
  }
);

nftSchema.plugin(mongooseSequence, { inc_field: "tokenId" });

nftSchema.index({ sellerId: 1 });
nftSchema.index({ collectionId: 1 });
nftSchema.index({ nftContract: 1, tokenId: 1 }, { unique: true });

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
