import { Router } from "express";
import { claimCoupon } from "../controllers/CouponController";
import {rateLimit} from "../middleware/rateLimit";


const router = Router();

router.post("/claim",rateLimit,claimCoupon)

export default router;