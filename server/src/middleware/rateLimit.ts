import { Request, Response, NextFunction } from "express";
import { UserClaim } from "../models/userClaim";

const CLAIM_COOLDOWN = 60 * 60 * 1000; // 1 hour

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIp = req.ip;
    const sessionId = req.cookies.session_id || "";

    // Check if the user has already claimed a coupon within the cooldown period
    const lastClaim = await UserClaim.findOne({ $or: [{ ip: userIp }, { sessionId }] });

    if (lastClaim) {
      const timeElapsed = new Date().getTime() - lastClaim.lastClaimedAt.getTime();
      const timeLeftMs = CLAIM_COOLDOWN - timeElapsed;

      if (timeLeftMs > 0) {
        const minutes = Math.floor(timeLeftMs / 60000);
        const seconds = Math.ceil((timeLeftMs % 60000) / 1000);

        res.status(429).json({
          message: `Please wait ${minutes} minutes and ${seconds} seconds before claiming again.`,
          success: false,
        });
        return;
      }
    }

    next(); 
  } catch (error) {
    res.status(500).json({ message: "Rate limit error", error, success: false });
    return;
  }
};

