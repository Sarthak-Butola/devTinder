const express = require("express");
const { authUser } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");
const chatRouter = express();



chatRouter.patch("/chat/unfriend/:targetUserId",authUser, async(req, res)=>{
    const {targetUserId} = req.params;
    const userId = req.user._id;

    try{
        //DELETE CONNECTION BETWEEN LOGGED IN USER AND UNFRIENDED GUY
        let deleteConnection = await ConnectionRequestModel.deleteOne ({
            $or:[
             {
                fromUserId:targetUserId,
                toUserId:userId,
                status:"accepted"
             },   
             {
                fromUserId:userId,
                toUserId:targetUserId,
                status:"accepted"
             }
            ]
        })

        // DELETE CHATS BETWEEN UNFRIENDED PERSON AND LOGGED IN USER
        // DIKKAT AARI HAI PRECISE CHAT DHUNDNE MEIN DEKH KYA SCENE HAI
        // maybe this is right I was giving goku id to searchchat and logged in was him too maybe thats why
        //  it gave all og goku chats as all goku chats had goku id in them 
        
        const deleteChats = await Chat.deleteOne ({
            participants:{
                $all:[userId,targetUserId]
            }
        });

        res.send("connection removed successfully!");
    }catch(err){
        console.log(err);
    }
});


chatRouter.get("/chat/:targetUserId", authUser, async(req, res)=>{
    const userId = req.user._id;
    const {targetUserId} = req.params;
    
    try{
        let chat = await Chat.findOne({
            participants:{$all : [userId, targetUserId]},
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName ",
        });

        if(!chat){  
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }
        res.json(chat);

    }catch(err){
        console.log(err);
    };
});




module.exports = chatRouter;