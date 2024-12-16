import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
    },
    walletAddress: {
      type: String,
      unique: true,
      required: true,
      match: /^0x[a-fA-F0-9]{40}$/i,
      set: (value) => value.toLowerCase(),
    },
    name: {
      type: String,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

userSchema.virtual('nfts', {
  ref: 'NFT',
  localField: '_id',
  foreignField: 'sellerId',
});

userSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'buyerId',
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
