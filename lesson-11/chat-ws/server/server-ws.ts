import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080});

const clients: Array<WebSocket> = [];

wss.on("connection", (ws)=> {
    // console.log("New frontend connected");
    setTimeout(()=> ws.send(JSON.stringify({
        type: "greeting",
        message: "Welcome to webSocket server"
    })), 1000);
    clients.push(ws);

    ws.on("message", data => {
        const {type, message} = JSON.parse(data);
        clients.forEach(client => {
            const dataSend = JSON.stringify({
                type,
                message,
            });
            client.send(dataSend);
        })
    })

    ws.on("close", (status, message)=> {
        const index = clients.findIndex(item => item === ws);
        if(index === -1) {
            return console.log("Cannot find ws");
        }
        clients.splice(index, 1);
        console.log(clients.length);
    })
})