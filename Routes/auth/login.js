import express from "express";
import { handleLogin } from "../../Controllers/auth/login.controller.js";
import { loginValidationRules, validate } from "../../Validations/auth.validation.js";

const router=express.Router();

router.post("/login", loginValidationRules(), validate, handleLogin);

export default router;