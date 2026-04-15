import mongoose from "mongoose";

const patientRecordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scanType: {
        type: String,
        enum: ['X-ray', 'CBCT', 'Intraoral', 'Extraoral', 'Panoramic', 'Other'],
        required: true
    },
    scanDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    imageUrl: {
        type: String,
        required: true
    },
    medicalDetails: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("PatientRecord", patientRecordSchema);
