import mongoose, { Schema, Document } from "mongoose";

interface IRoundRobinTracker extends Document {
  currentPosition: number;
}

const RoundRobinTrackerSchema = new Schema<IRoundRobinTracker>({
  currentPosition: { type: Number, required: true, default: 0 }
});

export const RoundRobinTracker = mongoose.model<IRoundRobinTracker>("RoundRobinTracker", RoundRobinTrackerSchema);