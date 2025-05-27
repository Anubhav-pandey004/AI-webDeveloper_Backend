
const generateResult = require('../google_ai')
// const generateResult = require("../openai")
// const generateResult = require("../llama")
module.exports = async(req,res) =>{
    try {
        const prompt = req.body.prompt;
        const result = await generateResult(prompt);
        res.send(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error" 
        });
    }
}