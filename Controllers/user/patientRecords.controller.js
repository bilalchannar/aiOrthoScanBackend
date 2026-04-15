import User from "../../Models/user.js";

export const getRecords= async (req,res)=>{
    const user = await User.findById(req.user._id).select("-password -email");
    res.send({
        success: true,
        user: {
            tokenData: req.user,
            userData: user,
        },
  });
}