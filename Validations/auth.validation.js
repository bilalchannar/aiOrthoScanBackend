import { body, validationResult } from 'express-validator';

// Validation rules for signup
export const signupValidationRules = () => {
    return [
        body('fullName')
            .trim()
            .notEmpty().withMessage('Full name is required')
            .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
        
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email format'),
        
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        
        body('age')
            .notEmpty().withMessage('Age is required')
            .isNumeric().withMessage('Age must be a valid number')
            .custom(value => value >= 1 && value <= 150).withMessage('Age must be between 1 and 150'),
        
        body('gender')
            .notEmpty().withMessage('Gender is required')
            .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other')
    ];
};

// Validation rules for login
export const loginValidationRules = () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email format'),
        
        body('password')
            .notEmpty().withMessage('Password is required')
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
