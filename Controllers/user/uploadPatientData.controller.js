import PatientRecord from "../../Models/patientRecord.js";

export const uploadPatientData = async (req, res, next) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        // Parse optional relevant data
        let medicalDetails = null;
        if (req.body.relevantData) {
            try {
                const parsed = JSON.parse(req.body.relevantData);
                medicalDetails = JSON.stringify(parsed);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "relevantData must be valid JSON"
                });
            }
        }

        // Store image as base64 string in imageUrl field
        // (In production you would upload to cloud storage and save the URL)
        const imageBase64 = file.buffer.toString("base64");
        const imageDataUrl = `data:${file.mimetype};base64,${imageBase64}`;

        const record = await PatientRecord.create({
            patientId: req.user._id,
            scanType: req.body.scanType || "Other",
            scanDate: req.body.scanDate ? new Date(req.body.scanDate) : new Date(),
            imageUrl: imageDataUrl,
            medicalDetails: medicalDetails || req.body.medicalDetails || ""
        });

        return res.status(201).json({
            success: true,
            message: "Patient scan uploaded and saved successfully",
            data: {
                recordId: record._id,
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                scanType: record.scanType,
                scanDate: record.scanDate,
                medicalDetails: record.medicalDetails
            }
        });

    } catch (error) {
        next(error);
    }
};