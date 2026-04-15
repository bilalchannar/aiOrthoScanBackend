import express from "express"
import authroutes from "./auth/index.js"
import userRoutes from "./user/index.js"

const router=express.Router();

router.use("/auth", authroutes);
router.use("/", userRoutes);

export default router;