import mongoose, { Schema, Document } from "mongoose";

interface ICoupon extends Document {
  code: string;
  isClaimed: boolean;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  isClaimed: { type: Boolean, default: false }
});

export const Coupon =  mongoose.model<ICoupon>("Coupon", CouponSchema);
