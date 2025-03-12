import { Request, Response, NextFunction } from "express";
import {UserClaim} from "../models/userClaim";

const CLAIM_COOLDOWN = 60 * 60 * 1000; // 1 hour

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIp = req.ip;
    const sessionId = req.cookies.session_id || "";

    // Check if the user has already claimed a coupon within the cooldown period
    const lastClaim = await UserClaim.findOne({ $or: [{ ip: userIp }, { sessionId }] });

    if (lastClaim && new Date().getTime() - lastClaim.lastClaimedAt.getTime() < CLAIM_COOLDOWN) {
      const timeLeft = Math.ceil((CLAIM_COOLDOWN - (new Date().getTime() - lastClaim.lastClaimedAt.getTime())) / 1000);
      res.status(429).json({ message: `Please wait ${timeLeft} seconds before claiming again.`,success:false });
      return;
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ message: "Rate limit error", error,success:false });
    return;
  }
};
