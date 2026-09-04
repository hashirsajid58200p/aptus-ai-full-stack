const mongoose=require('mongoose');

const messageSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true,
    },
    sessionId:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
    },
    sender:{
        type: String,
        enum: ["user", "ai", "human_agent"],
        default: "user",
    },
    tokensUsed:{
        type: Number,
        default: 0,
    },
    chatbotId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

const Message=mongoose.model("Message",messageSchema);

module.exports=Message;
