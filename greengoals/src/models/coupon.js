const CouponSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ['fixed', 'percentage'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hasBeenUsed: {
      type: Boolean,
      default: false,
    },
  });
  
  const Coupon = mongoose.model('Coupon', CouponSchema);
  export default Coupon;
  