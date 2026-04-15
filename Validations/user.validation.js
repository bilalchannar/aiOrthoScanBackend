import { body, validationResult } from 'express-validator';

// Validation rules for upload patient data
export const uploadPatientDataValidationRules = () => {
    return [
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

// Validation rules for AI diagnosis
export const aiDiagnosisValidationRules = () => {
    return [
        body('imageBase64')
            .notEmpty().withMessage('imageBase64 is required')
            .matches(/^[A-Za-z0-9+/=]+$/).withMessage('Invalid base64 format'),
        
        body('promptText')
            .trim()
            .notEmpty().withMessage('promptText is required')
            .isLength({ min: 5 }).withMessage('Prompt text must be at least 5 characters')
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
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};
