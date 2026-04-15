import express from "express";
import {
    handleAiDiagnosis,
    getDiagnosesByRecord,
    deleteDiagnosis
} from "../../Controllers/user/aiDiagnosis.controller.js";
import { verifyToken } from "../../middlewares/auth/verifytoken.js";
import { aiDiagnosisValidationRules, validate } from "../../Validations/user.validation.js";

const router = express.Router();

// Run AI diagnosis and save result
router.post(
    "/diagnosis/Aidiagnosis",
    verifyToken,
    aiDiagnosisValidationRules(),
    validate,
    handleAiDiagnosis
);

// Get all diagnoses for a patient record (paginated)
router.get("/diagnosis/:patientRecordId", verifyToken, getDiagnosesByRecord);

// Delete a specific diagnosis
router.delete("/diagnosis/:id", verifyToken, deleteDiagnosis);

export default router;