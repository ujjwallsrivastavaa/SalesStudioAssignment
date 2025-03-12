import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db-config";
import allRoutes from "./routes/allRoutes";
import { Coupon } from "./models/coupons";
dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
app.use("/api", allRoutes);



export default app;