import { Request, Response } from "express";
import { Coupon } from "../models/coupons";
import { UserClaim } from "../models/userClaim";
import { RoundRobinTracker } from "../models/roundRobinModel";

const CLAIM_COOLDOWN = 60 * 60 * 1000;

export const claimCoupon = async (req: Request, res: Response) => {
  try {
    const userIp = req.ip;
    const sessionId =
      req.cookies.session_id || Math.random().toString(36).substring(2);
    const now = new Date();

   
    // Get the current round-robin position
    let tracker = await RoundRobinTracker.findOne();
    if (!tracker) {
      tracker = await RoundRobinTracker.create({ currentPosition: 0 });
    }

    // Get all unclaimed coupons sorted by code
    let unclaimedCoupons = await Coupon.find({ isClaimed: false }).sort({ code: 1 });

    if (unclaimedCoupons.length === 0) {
      // Reset all coupons
      await Coupon.updateMany({}, { isClaimed: false });

      // Reset the round-robin tracker position
      await RoundRobinTracker.findByIdAndUpdate(tracker._id, { currentPosition: 0 });

      // Fetch the coupons again
      unclaimedCoupons = await Coupon.find({ isClaimed: false }).sort({ code: 1 });

      if (unclaimedCoupons.length === 0) {
        res.status(500).json({ message: "No coupons available.", success: false });
        return;
      }
    }

    // Select the next coupon in round-robin fashion
    const selectedCoupon = unclaimedCoupons[tracker.currentPosition % unclaimedCoupons.length];

    // Mark the selected coupon as claimed
    await Coupon.findByIdAndUpdate(selectedCoupon._id, { isClaimed: true });

    // Update the round-robin position safely
    const newPosition = (tracker.currentPosition + 1) % unclaimedCoupons.length;
    await RoundRobinTracker.findByIdAndUpdate(tracker._id, { currentPosition: newPosition });

    // Update or create the user claim record
    await UserClaim.findOneAndUpdate(
      { $or: [{ ip: userIp }, { sessionId }] },
      { ip: userIp, sessionId, lastClaimedAt: now },
      { upsert: true, new: true }
    );

    res.cookie("session_id", sessionId, { httpOnly: true });

    res.json({
      message: "Coupon claimed successfully!",
      couponCode: selectedCoupon.code,
      success: true,
    });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    res.status(500).json({ message: "Server error", error, success: false });
  }
};