
import express from "express";
import {Server} from "socket.io";
import { createServer } from "node:http";

const app = express();
const httpServer = createServer(app);

const users: Record<string, string> = {};

const emitUsers = () => {
    wsServer.emit("users", users);
};

const wsServer = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

wsServer.on("connection", socket => {
    users[socket.id] = "Anonim";
    emitUsers();

    socket.on("change:name", name => {
        users[socket.id] = name;
        emitUsers();
    });

    socket.on("disconnect", reason => {
        delete users[socket.id];
        emitUsers();
    });
})

httpServer.listen(3000, ()=> console.log("Server running on 3000 port"));
