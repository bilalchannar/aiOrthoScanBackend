import { aiDiagnosis } from "../../Services/user/aiDiagnosis.service.js";
import Diagnosis from "../../Models/diagnosis.js";

// POST /api/diagnosis/Aidiagnosis
export const handleAiDiagnosis = async (req, res, next) => {
    try {
        const { patientRecordId, promptText, imageBase64 } = req.body;

        const aiResponse = await aiDiagnosis({ imageBase64, promptText });

        // Persist diagnosis result to DB
        const diagnosis = await Diagnosis.create({
            patientRecordId,
            aiResponse: typeof aiResponse === "string" ? aiResponse : JSON.stringify(aiResponse),
            promptUsed: promptText,
            model: "gemini-2.5-flash"
        });

        return res.status(201).json({
            success: true,
            data: diagnosis
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/diagnosis/:patientRecordId?page=1&limit=10
export const getDiagnosesByRecord = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [diagnoses, total] = await Promise.all([
            Diagnosis.find({ patientRecordId: req.params.patientRecordId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Diagnosis.countDocuments({ patientRecordId: req.params.patientRecordId })
        ]);

        return res.status(200).json({
            success: true,
            data: diagnoses,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/diagnosis/:id
export const deleteDiagnosis = async (req, res, next) => {
    try {
        const diagnosis = await Diagnosis.findByIdAndDelete(req.params.id);
        if (!diagnosis) {
            return res.status(404).json({ success: false, message: "Diagnosis not found" });
        }
        return res.status(200).json({ success: true, message: "Diagnosis deleted" });
    } catch (error) {
        next(error);
    }
};