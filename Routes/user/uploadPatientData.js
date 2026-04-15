import express from "express";
import {uploadPatientData} from "../../Controllers/user/uploadPatientData.controller.js";
import { verifyToken } from "../../middlewares/auth/verifytoken.js";
import { uploadPatientDataValidationRules, validate } from "../../Validations/user.validation.js";
import multer from "multer";

const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
})

const router=express.Router();

router.post("/main/uploadPatientData", 
    verifyToken,
    upload.single("image"),
    uploadPatientDataValidationRules(),
    validate,
    uploadPatientData
);

export default router;