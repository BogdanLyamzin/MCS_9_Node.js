import express from "express";

import logger from "./middlewares/logger";
import notFoundHandler from "./middlewares/notFoundHandler";
import errorHandler from "./middlewares/errorHandler";

import notesRouter from "./routes/notesRouter";

const app = express();

app.use(express.json());
app.use(logger);

app.get("/", (request, response)=> {
    console.log(request.method);
    response.send("<h1>Welcome to HTTP-server</h1>");
})

app.use("/api/notes", notesRouter);

app.get("/api/types", async (req, res)=> {
    throw new Error("Something wrong");
})

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, ()=> console.log("Server running on port 3000"));
