import {loginService} from "../../Services/auth/login.service.js"

export const handleLogin= async (req, res, next)=> {
    try{
        console.log(req.body);
        
        const user= await loginService(req.body);
        console.log(user)
        res.status(200).json({
            success: true,
            data: user
        })

    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
};
