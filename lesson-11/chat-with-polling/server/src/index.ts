import cors from "cors";
import express, { type Request, type Response } from "express";

const app = express();
const port = Number(process.env.PORT ?? 4000);

type ChatMessage = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
};

const messages: ChatMessage[] = [];
let nextId = 1;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Клієнт викликає цей маршрут регулярно, навіть якщо нових повідомлень немає.
app.get("/messages", (req: Request, res: Response) => {
  const after = Number(req.query.after ?? 0);
  const newMessages = messages.filter((message) => message.id > after);

  console.log(
    `[POLL] after=${after}; returned=${newMessages.length}; total=${messages.length}`,
  );

  res.json({ messages: newMessages, serverTime: new Date().toISOString() });
});

app.post("/messages", (req: Request, res: Response) => {
  const { author, text } = req.body as { author?: string; text?: string };

  if (!author?.trim() || !text?.trim()) {
    res.status(400).json({ error: "author and text are required" });
    return;
  }

  const message: ChatMessage = {
    id: nextId++,
    author: author.trim(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  console.log(`[POST] message #${message.id} from ${message.author}`);
  res.status(201).json(message);
});

// Лише для повторного запуску демонстрації без рестарту сервера.
app.delete("/messages", (_req: Request, res: Response) => {
  messages.length = 0;
  nextId = 1;
  console.log("[RESET] messages cleared");
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Polling API is listening on http://localhost:${port}`);
});
