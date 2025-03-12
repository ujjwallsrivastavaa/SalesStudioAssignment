import { Router } from "express";
import { claimCoupon, getUserCoupons } from "../controllers/CouponController";
import {rateLimit} from "../middleware/rateLimit";


const router = Router();

router.get("/user-coupons",getUserCoupons)
router.post("/claim",rateLimit,claimCoupon)

export default router;