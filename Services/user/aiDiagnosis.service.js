import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiDiagnosis = async (userData) => {
    console.log("Processing user data...");
    
    try {
        const { imageBase64, promptText } = userData;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                mimeType: "image/jpeg", 
                                data: imageBase64,
                            },
                        },
                        { text: promptText },
                    ]
                }
            ]
        });

        console.log(response.text);
        return response.text;

    } catch (error) {
    
        console.error("AI Error:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
}