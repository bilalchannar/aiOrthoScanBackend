import {aiDiagnosis} from "../../Services/user/aiDiagnosis.service.js";

export const handleAiDiagnosis=async (req,res,next)=>{
    console.log(req.body.promptText);
    try{
        const Data=await aiDiagnosis(req.body);
        res.status(200).json({
            success:true,
            data: Data
        })
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}