import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db-config";
import allRoutes from "./routes/allRoutes";
import { Coupon } from "./models/coupons";
dotenv.config();
const PORT = process.env.PORT || 5000;
const FRONTEND_URI = process.env.FRONTEND_URI || "http://localhost:5173";

const app = express();

app.use(cors({ origin: FRONTEND_URI, credentials: true }));
app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
app.use("/api", allRoutes);



export default app;