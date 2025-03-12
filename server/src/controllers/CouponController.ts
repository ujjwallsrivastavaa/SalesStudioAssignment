import { Request, Response } from "express";
import { Coupon } from "../models/coupons";
import { UserClaim } from "../models/userClaim";
import { RoundRobinTracker } from "../models/roundRobinModel";

const CLAIM_COOLDOWN = 60 * 60 * 1000;

export const getUserCoupons = async (req: Request, res: Response) => {
  try {
    const userIp = req.ip;
    const sessionId = req.cookies.session_id;

    const userClaim = await UserClaim.findOne({ $or: [{ ip: userIp }, { sessionId }] });

    if (!userClaim) {
      res.status(404).json({ message: "No claimed coupons found for this user.", success: false });
      return;
    }

    res.json({
      message: "Claimed coupons retrieved successfully!",
      claimedCoupons: userClaim.claimedCoupons,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving claimed coupons:", error);
    res.status(500).json({ message: "Server error", error, success: false });
  }
};



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

    const totalCoupons = await Coupon.countDocuments();
    if (totalCoupons === 0) {
      res.status(500).json({ message: "No coupons available.", success: false });
      return;
    }
    

    const selectedCoupon = await Coupon.findOne().sort({ code: 1 }).skip(tracker.currentPosition % totalCoupons);

    if (!selectedCoupon) {
      res.status(500).json({ message: "No valid coupon found.", success: false });
      return
    }

    await UserClaim.findOneAndUpdate(
      { $or: [{ ip: userIp }, { sessionId }] },
      {
        ip: userIp,
        sessionId,
        lastClaimedAt: now,
        $push: { claimedCoupons: selectedCoupon.code } 
      },
      { upsert: true, new: true }
    );
    
    const newPosition = (tracker.currentPosition + 1) % totalCoupons;
    await RoundRobinTracker.findByIdAndUpdate(tracker._id, { currentPosition: newPosition });

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