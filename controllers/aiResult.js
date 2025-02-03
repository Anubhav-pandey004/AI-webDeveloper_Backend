
const generateResult = require('../google_ai')
module.exports = async(req,res) =>{
    try {
        console.log(req.body);
        
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