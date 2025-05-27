const { GoogleGenerativeAI } = require("@google/generative-ai");
const { systemInstruction } = require("../promptEnc");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY_FOR_MAGIC_PEN);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction,
});


const EnhancedPromptgenerater = async (userMessage) => {
    try {
      const result = await model.generateContent(userMessage);
      const responseText = result.response.text();  
      return responseText;
    } catch (error) {
      console.log(error);
    }
  };
  
  module.exports = EnhancedPromptgenerater;
  