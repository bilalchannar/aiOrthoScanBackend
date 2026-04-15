import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
    patientRecordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientRecord',
        required: true
    },
    aiResponse: {
        type: String,
        required: true
    },
    promptUsed: {
        type: String,
        required: true
    },
    model: {
        type: String,
        default: 'gemini-2.5-flash'
    }
}, { timestamps: true });

export default mongoose.model("Diagnosis", diagnosisSchema);
