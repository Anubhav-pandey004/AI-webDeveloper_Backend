const Replicate = require("replicate");
const { systemInstruction } = require("./prompt");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Maintain conversation history with token awareness
let chatHistory = [];
let totalTokens = 0;

// Helper function to estimate token count (approximate)
const estimateTokens = (text) => Math.ceil(text.length / 4);

const generateResult = async (userMessage) => {
  
  // Track tokens for new user message
  const userMessageTokens = estimateTokens(userMessage);
  totalTokens += userMessageTokens;
  
  // Add to history
  chatHistory.push({ role: "user", content: userMessage, tokens: userMessageTokens });

  // Build prompt with token awareness
  let promptParts = [
    `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemInstruction}<|eot_id|>`
  ];
  let promptTokens = estimateTokens(promptParts[0]);

  // Manage context window (4096 tokens for Llama 3)
  const MAX_CONTEXT_TOKENS = 4096;
  const RESPONSE_TOKENS = 512; // Reserve space for response
  const SAFETY_MARGIN = 100;
  const AVAILABLE_TOKENS = MAX_CONTEXT_TOKENS - RESPONSE_TOKENS - SAFETY_MARGIN;

  // Trim history if needed (FIFO)
  while (totalTokens > AVAILABLE_TOKENS && chatHistory.length > 1) {
    const removed = chatHistory.shift();
    totalTokens -= removed.tokens;
  }

  // Build final prompt
  for (const msg of chatHistory) {
    const role = msg.role === "user" ? "user" : "assistant";
    const messagePart = `<|start_header_id|>${role}<|end_header_id|>\n\n${msg.content}<|eot_id|>`;
    promptParts.push(messagePart);
    promptTokens += estimateTokens(messagePart);
  }

  promptParts.push(`<|start_header_id|>assistant<|end_header_id|>\n\n`);
  const fullPrompt = promptParts.join('');

  const input = {
    prompt: fullPrompt,
    top_k: 0,
    top_p: 0.95,
    max_tokens: RESPONSE_TOKENS,
    temperature: 0.7,
    length_penalty: 1,
    stop_sequences: "<|end_of_text|>,<|eot_id|>",
    presence_penalty: 0,
    // Removed prompt_template as we're building the full prompt manually
  };

  try {
    let responseText = "";
    const startTime = Date.now();
    
    for await (const event of replicate.stream("meta/meta-llama-3-8b-instruct", { input })) {
      responseText += event.toString();
    }

    // Track response tokens
    const responseTokens = estimateTokens(responseText);
    totalTokens += responseTokens;
    
    chatHistory.push({ 
      role: "assistant", 
      content: responseText,
      tokens: responseTokens
    });
    
    return responseText;
  } catch (error) {
    console.error("LLaMA Error:", error);
    // Revert token count on error
    totalTokens -= userMessageTokens;
    chatHistory.pop();
    throw error;
  }
};

module.exports = generateResult;