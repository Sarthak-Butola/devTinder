const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const initializeSocket = (server)=>{

    //THIS SHI IS NOT SHOWING CHATS ON FRONTEND FOR SOME REASON
    //now showing, used in both sendMessage and joinChat
const getSecretRoomId = (userId, targetUserId)=>{
    return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

    const io = socket(server, {
        cors:{
            origin:("http://localhost:5173")
        },
    });
    
    io.on("connection",(socket)=>{
        //handle events, errors
        socket.on("joinChat", ({firstName, userId, targetUserId})=>{
            // let roomId = [userId, targetUserId].sort().join("_");
              let roomId = getSecretRoomId(userId, targetUserId);
           
            // console.log(firstName + " joining room: " + roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage",async({firstName, userId, targetUserId, text})=>{
            // const roomId = [userId, targetUserId].sort().join("_");
             let roomId = getSecretRoomId(userId, targetUserId);
            // console.log(firstName + ": " + text);

            try{
                let chat = await Chat.findOne({
                    participants: {$all: [userId, targetUserId]},
                });

                if(!chat){
                    chat = new Chat({
                        participants:[userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId:userId,
                    text,
                });
                
                await chat.save();

              io.to(roomId).emit("messageReceived", {firstName, text});
            }
            catch(err){
                console.log(err);
            }

        });

        socket.on("disconnect",()=>{

        });
        
    });
};
module.exports = initializeSocket;