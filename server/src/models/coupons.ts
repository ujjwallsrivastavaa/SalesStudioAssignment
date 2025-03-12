import mongoose, { Schema, Document } from "mongoose";

interface ICoupon extends Document {
  code: string;
  isClaimed: boolean;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
});

export const Coupon =  mongoose.model<ICoupon>("Coupon", CouponSchema);
