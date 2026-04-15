import express, { Router } from "express";
import signupRoute from "./signup.js";
import loginRoute from "./login.js";

const router = express.Router();

router.use("/", signupRoute);
router.use("/",loginRoute);

export default router;
