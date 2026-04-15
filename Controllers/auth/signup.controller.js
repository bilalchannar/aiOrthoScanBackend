import {signupService} from "../../Services/auth/signup.service.js"

export const handleSignup= async (req, res, next)=> {
    try{
        console.log(req.body);
        
        const user= await signupService(req.body);
        console.log(user)
        res.status(201).json({
            success: true,
            data: user
        })

    }catch(error){
        // Pass to error handler middleware
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
};
