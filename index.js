// https://www.npmjs.com/package/ws#server-broadcast
import express from 'express';
import WebSocket, {WebSocketServer} from 'ws';
const app = express();
const log = console.log;
// STATIC FOLDER
app.use(express.static('public'));

// WS SERVER
const wss = new WebSocketServer({port:8080});
// SERVER EVENTS
wss.on('connection', (ws, req)=>{
    let ip = req.socket.remoteAddress;
    log(`Ip ${ip}`);
    // ON CLIENT MESSAGE EVENT
    ws.on('message', data =>{
        log('received: %s', data.toString());
        console.log(data.toString());
        // BROADCAST MESSAGE TO CONNECTED CLIENTS
        wss.clients.forEach(c =>{
            if(c !== ws && c.readyState === WebSocket.OPEN){
                c.send(data.toString());
            };
        });
    });
    
    // WELCOME MESSAGE
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = ('⌚' + date + ' ' + time).toString();
    ws.send(JSON.stringify({time: datetime, message:`💬 Welcome from the Server 🎉.`}));
});

// SERVER LISTENER
const PORT = 8000;
app.listen(PORT, log(`Server Listening on port ${PORT}`));