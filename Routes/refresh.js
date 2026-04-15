import express from "express";
import { handleRefresh } from "../Controllers/auth/refresh.controller.js";

const router = express.Router();

router.post("/refresh", handleRefresh);

export default router;