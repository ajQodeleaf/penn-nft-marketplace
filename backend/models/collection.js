import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const collectionSchema = new mongoose.Schema(
  {
    collectionId: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
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
    },
    isListed: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    contractAddress: {
      type: String,
      unique: true,
      required: true,
      match: /^0x[a-fA-F0-9]{40}$/,
      set: (value) => value.toLowerCase(),
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

collectionSchema.plugin(mongooseSequence, { inc_field: "collectionId" });

collectionSchema.index({ creatorId: 1 });
collectionSchema.index({ contractAddress: 1 }, { unique: true });

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
