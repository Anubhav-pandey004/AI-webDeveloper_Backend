const EnhancedPromptgenerater = require('./MagicPen')
module.exports = enhancePrompt = async(req,res)=>{
    try {
        const prompt = req.body.prompt;
        const result = await EnhancedPromptgenerater(prompt);
        res.status(200).json({
            message: "", 
            data:result,
            success:true,
            error:false
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error" 
        });
    }
}