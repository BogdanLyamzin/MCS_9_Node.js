import cors from "cors";
import express from "express";
const app = express();
const port = Number(process.env.PORT ?? 4000);
const LONG_POLL_TIMEOUT_MS = 25_000;
const messages = [];
const waitingClients = new Set();
let nextId = 1;
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const messagesAfter = (id) => messages.filter((message) => message.id > id);
function replyToClient(client, newMessages, reason) {
    clearTimeout(client.timeout);
    waitingClients.delete(client);
    if (!client.res.writableEnded)
        client.res.json({ messages: newMessages, reason, serverTime: new Date().toISOString() });
}
// На відміну від GET /messages для звичайного polling, ця відповідь не надсилається одразу.
app.get("/subscribe", (req, res) => {
    const after = Number(req.query.after ?? 0);
    const availableMessages = messagesAfter(after);
    if (availableMessages.length > 0) {
        console.log(`[LONG POLL IMMEDIATE] after=${after}; returned=${availableMessages.length}`);
        res.json({ messages: availableMessages, reason: "message" });
        return;
    }
    const client = {};
    client.after = after;
    client.res = res;
    client.timeout = setTimeout(() => {
        console.log(`[LONG POLL TIMEOUT] after=${after}; waiting=${waitingClients.size - 1}`);
        replyToClient(client, [], "timeout");
    }, LONG_POLL_TIMEOUT_MS);
    waitingClients.add(client);
    console.log(`[LONG POLL OPEN] after=${after}; waiting=${waitingClients.size}`);
    req.on("close", () => {
        if (waitingClients.delete(client)) {
            clearTimeout(client.timeout);
            console.log(`[LONG POLL CANCELLED] waiting=${waitingClients.size}`);
        }
    });
});
app.post("/messages", (req, res) => {
    const { author, text } = req.body;
    if (!author?.trim() || !text?.trim()) {
        res.status(400).json({ error: "author and text are required" });
        return;
    }
    const message = { id: nextId++, author: author.trim(), text: text.trim(), createdAt: new Date().toISOString() };
    messages.push(message);
    console.log(`[POST] message #${message.id}; resolving=${waitingClients.size}`);
    // Один POST завершує всі актуальні довгі запити: простий broadcast-чату.
    for (const client of [...waitingClients]) {
        replyToClient(client, messagesAfter(client.after), "message");
        console.log(`[LONG POLL RESOLVE] message=#${message.id}`);
    }
    res.status(201).json(message);
});
app.listen(port, () => console.log(`Long-polling API: http://localhost:${port}`));
