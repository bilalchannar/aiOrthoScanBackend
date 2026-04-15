import express from "express"
import authroutes from "./auth/index.js"
import userRoutes from "./user/index.js"
import refreshRoute from "./refresh.js"

const router=express.Router();

router.use("/auth", authroutes);
router.use("/", userRoutes);
router.use("/auth", refreshRoute);

export default router;