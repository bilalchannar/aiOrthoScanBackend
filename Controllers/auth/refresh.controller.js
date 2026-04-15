import jsonwebtoken from "jsonwebtoken";
import User from "../../Models/user.js";
import dotenv from "dotenv";
dotenv.config();

export const handleRefresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Refresh token required" });
    }

    try {
        const decoded = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

        const user = await User.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ success: false, message: "Invalid or revoked refresh token" });
        }

        const newAccessToken = jsonwebtoken.sign(
            { _id: user._id, fullName: user.fullName },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: process.env.TOKEN_EXPIRY || "7d" }
        );

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }
};
