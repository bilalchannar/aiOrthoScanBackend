import User from "../../Models/user.js";
import bcrypt from "bcrypt";

export const signupService = async (userData) => {
    if (await User.exists({ email: userData.email })) {
        throw new Error("User already exists!");
    }

    // Fix: use async bcrypt.hash instead of blocking bcrypt.hashSync
    const hash = await bcrypt.hash(userData.password, 10);
    userData.password = hash;

    const user = await User.create(userData);
    const { password, refreshToken, ...userWithoutSensitive } = user._doc;
    return userWithoutSensitive;
};
