const { GoogleGenerativeAI } = require("@google/generative-ai");
const { systemInstruction } = require("./prompt");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction,
});

// Store chat history
let chatHistory = [];
// chatHistory.unshift({ role: "user", content: systemInstruction });
const generateResult = async (userMessage) => {
  console.log("Generatig response ");
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
    console.log("result :",responseText);
    return responseText;
  } catch (error) {
    chatHistory = [];
  }
};

module.exports = generateResult;
