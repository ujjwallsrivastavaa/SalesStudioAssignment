import mongoose, { Schema, Document } from "mongoose";

interface IUserClaim extends Document {
  ip: string;
  sessionId: string;
  lastClaimedAt: Date;
  claimedCoupons: string[]; 
}

const UserClaimSchema = new Schema<IUserClaim>({
  ip: { type: String, required: true },
  sessionId: { type: String, required: true },
  lastClaimedAt: { type: Date, required: true },
  claimedCoupons: { type: [String], default: [] } 
});

export const UserClaim = mongoose.model<IUserClaim>("UserClaim", UserClaimSchema);
