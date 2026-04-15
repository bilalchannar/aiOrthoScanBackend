import PatientRecord from "../../Models/patientRecord.js";
import Diagnosis from "../../Models/diagnosis.js";

// GET /api/main/patientRecords?page=1&limit=10
export const getRecords = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [records, total] = await Promise.all([
            PatientRecord.find({ patientId: req.user._id })
                .select("-imageUrl") // exclude large base64 from list view
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            PatientRecord.countDocuments({ patientId: req.user._id })
        ]);

        return res.status(200).json({
            success: true,
            data: records,
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

// GET /api/main/patientRecords/:id
export const getRecordById = async (req, res, next) => {
    try {
        const record = await PatientRecord.findOne({
            _id: req.params.id,
            patientId: req.user._id
        });

        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        return res.status(200).json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

// PUT /api/main/patientRecords/:id
export const updateRecord = async (req, res, next) => {
    try {
        const allowedUpdates = ["scanType", "scanDate", "medicalDetails"];
        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const record = await PatientRecord.findOneAndUpdate(
            { _id: req.params.id, patientId: req.user._id },
            updates,
            { new: true, runValidators: true }
        );

        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        return res.status(200).json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/main/patientRecords/:id
export const deleteRecord = async (req, res, next) => {
    try {
        const record = await PatientRecord.findOneAndDelete({
            _id: req.params.id,
            patientId: req.user._id
        });

        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        // Also delete linked diagnoses
        await Diagnosis.deleteMany({ patientRecordId: record._id });

        return res.status(200).json({
            success: true,
            message: "Record and associated diagnoses deleted"
        });
    } catch (error) {
        next(error);
    }
};