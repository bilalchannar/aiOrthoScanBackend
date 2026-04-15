import { body, param, query, validationResult } from 'express-validator';

const SCAN_TYPES = ['X-ray', 'CBCT', 'Intraoral', 'Extraoral', 'Panoramic', 'Other'];

// Validation rules for upload patient data
export const uploadPatientDataValidationRules = () => {
    return [
        body('scanType')
            .optional()
            .isIn(SCAN_TYPES).withMessage(`scanType must be one of: ${SCAN_TYPES.join(', ')}`),

        body('scanDate')
            .optional()
            .isISO8601().withMessage('scanDate must be a valid ISO 8601 date'),

        body('medicalDetails')
            .optional()
            .isString().withMessage('medicalDetails must be a string')
            .isLength({ max: 2000 }).withMessage('medicalDetails must be under 2000 characters'),

        body('relevantData')
            .optional()
            .custom(value => {
                if (typeof value === 'string') {
                    try {
                        JSON.parse(value);
                        return true;
                    } catch {
                        throw new Error('relevantData must be valid JSON');
                    }
                }
                return true;
            })
    ];
};

// Validation rules for update patient record
export const updatePatientRecordValidationRules = () => {
    return [
        body('scanType')
            .optional()
            .isIn(SCAN_TYPES).withMessage(`scanType must be one of: ${SCAN_TYPES.join(', ')}`),

        body('scanDate')
            .optional()
            .isISO8601().withMessage('scanDate must be a valid ISO 8601 date'),

        body('medicalDetails')
            .optional()
            .isString().withMessage('medicalDetails must be a string')
            .isLength({ max: 2000 }).withMessage('medicalDetails must be under 2000 characters')
    ];
};

// Validation rules for AI diagnosis
export const aiDiagnosisValidationRules = () => {
    return [
        body('patientRecordId')
            .notEmpty().withMessage('patientRecordId is required')
            .isMongoId().withMessage('patientRecordId must be a valid MongoDB ID'),

        body('imageBase64')
            .notEmpty().withMessage('imageBase64 is required')
            .matches(/^[A-Za-z0-9+/=]+$/).withMessage('Invalid base64 format'),

        body('promptText')
            .trim()
            .notEmpty().withMessage('promptText is required')
            .isLength({ min: 5 }).withMessage('Prompt text must be at least 5 characters')
    ];
};

// Pagination query validation
export const paginationValidationRules = () => {
    return [
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
    ];
};

// Middleware to handle validation errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        });
    }
    next();
};
