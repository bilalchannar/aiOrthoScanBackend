import express, { Router } from "express";
import { getRecords } from "../../Controllers/user/patientRecords.controller.js";
import {verifyToken} from "../../middlewares/auth/verifytoken.js"

const router = express.Router();

router.get("/main/patientRecords", verifyToken, getRecords);

export default router;