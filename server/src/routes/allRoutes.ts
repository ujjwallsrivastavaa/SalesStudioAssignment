import { Router } from "express";
import couponsRoute from "./couponsRoute";
const router = Router();

router.use("/coupons",couponsRoute );


export default router;