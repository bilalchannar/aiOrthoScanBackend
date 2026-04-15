import User from "../../Models/user.js"
import bcrypt from "bcrypt"

export const signupService= async(userData)=>{
        
        if(await User.exists({email : userData.email})){
            throw new Error("User already exists!")
        }

        const hash = bcrypt.hashSync(userData.password, 10);
        userData.password=hash;
        const user = await User.create(userData);
        const {password,...userwithoutpassword}=user._doc;
        return userwithoutpassword;   
}

