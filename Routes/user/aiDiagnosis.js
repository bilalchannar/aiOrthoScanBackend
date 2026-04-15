import express from "express";
import {handleAiDiagnosis} from "../../Controllers/user/aiDiagnosis.controller.js";
import { verifyToken } from "../../middlewares/auth/verifytoken.js";
import { aiDiagnosisValidationRules, validate } from "../../Validations/user.validation.js";

const router=express.Router();

router.post("/diagnosis/Aidiagnosis", 
    verifyToken,
    aiDiagnosisValidationRules(),
    validate,
    handleAiDiagnosis
);

export default router;