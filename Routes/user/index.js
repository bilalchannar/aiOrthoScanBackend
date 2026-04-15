import uploadRoutes from "./uploadPatientData.js";
import PatientDetail from "./patientRecords.js";
import aiDiagnosisRoute from "./aiDiagnosis.js"
import express from "express";

const router=express.Router();

router.use("/",uploadRoutes);
router.use("/",PatientDetail);
router.use("/",aiDiagnosisRoute);

export default router;
