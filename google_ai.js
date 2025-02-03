const { GoogleGenerativeAI } = require("@google/generative-ai");
const { systemInstruction } = require("./prompt");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction,
});

// Store chat history
let chatHistory = [];

const generateResult = async (userMessage) => {
  // Add user message to history
  try {
    chatHistory.push({ role: "user", content: userMessage });

    // Prepare the conversation history
    const messages = chatHistory.map((message) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));

    const result = await model.generateContent({
      contents: messages,
    });

    const responseText = result.response.text();

    // Add model response to history
    chatHistory.push({ role: "model", content: responseText });

    return responseText;
  } catch (error) {
    console.log(error);
    
  }
};

module.exports = generateResult;
