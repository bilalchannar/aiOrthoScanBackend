import User from "../../Models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
dotenv.config();

export const loginService = async (userData) => {
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new Error("User doesn't exist!");
  }

  const isMatch = await bcrypt.compare(userData.password, user.password);

  if (!isMatch) {
    throw new Error("Wrong Password");
  }

  const userObj = user.toObject();

  const accessToken = jsonwebtoken.sign(
    { _id: userObj._id, fullName: userObj.fullName },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: process.env.TOKEN_EXPIRY || "7d" }
  );

  const refreshToken = jsonwebtoken.sign(
    { _id: userObj._id },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d" }
  );

  // Persist refresh token in DB for revocation support
  await User.findByIdAndUpdate(userObj._id, { refreshToken });

  delete userObj.password;
  delete userObj.refreshToken;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};
