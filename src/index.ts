import {WebSocketServer, WebSocket} from "ws";


const wss = new WebSocketServer({port:8080});
interface User {
    socket:WebSocket,
    room:string
}
let userCount = 0;
// let allSockets:WebSocket[] = [];
let allSocket:User[] = [];
wss.on("connection", (socket) => {    
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);
            if(parsedMessage.type === "join") {
                allSocket.push( {
                    socket,
                    room: parsedMessage.payload.roomId
                })
            }

            if(parsedMessage.type === "chat") {
                //first I need to find the room id of current user, which room id it joined
                // const currentUserRoom = allSocket.find((x) => x.socket === socket).room;
                let currentUserRoom = null;
                
                for(let i=0; i<allSocket.length; i++) {
                    if(allSocket[i].socket === socket)
                        currentUserRoom = allSocket[i].room;
                }
                
                //send to the message to all the room members
                for(let i=0; i<allSocket.length; i++) {
                    if(allSocket[i].room == currentUserRoom)
                        allSocket[i].socket.send(parsedMessage.payload.message);
                }
            }
    })  
    
})