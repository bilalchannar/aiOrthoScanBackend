import express from "express"
import {handleSignup} from "../../Controllers/auth/signup.controller.js"
import { signupValidationRules, validate } from "../../Validations/auth.validation.js"

const router = express.Router();

router.post("/signup", signupValidationRules(), validate, handleSignup)

export default router;