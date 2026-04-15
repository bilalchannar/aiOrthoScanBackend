import express from "express";
import {
    getRecords,
    getRecordById,
    updateRecord,
    deleteRecord
} from "../../Controllers/user/patientRecords.controller.js";
import { verifyToken } from "../../middlewares/auth/verifytoken.js";
import {
    updatePatientRecordValidationRules,
    paginationValidationRules,
    validate
} from "../../Validations/user.validation.js";

const router = express.Router();

// GET all records with pagination
router.get(
    "/main/patientRecords",
    verifyToken,
    paginationValidationRules(),
    validate,
    getRecords
);

// GET single record by ID
router.get("/main/patientRecords/:id", verifyToken, getRecordById);

// UPDATE a record
router.put(
    "/main/patientRecords/:id",
    verifyToken,
    updatePatientRecordValidationRules(),
    validate,
    updateRecord
);

// DELETE a record (also removes linked diagnoses)
router.delete("/main/patientRecords/:id", verifyToken, deleteRecord);

export default router;