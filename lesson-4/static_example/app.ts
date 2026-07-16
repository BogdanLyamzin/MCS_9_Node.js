import express from "express";
import { resolve, join } from "node:path";


const publicPath = resolve("public");

const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static(publicPath));

app.get("/", (req, res)=> {
    const indexPath = join(publicPath, "index.html");
    res.sendFile(indexPath);
})

app.get("/blog", (req, res)=> {
    const blogPath = join(publicPath, "blog.html");
    res.sendFile(blogPath);
})

app.get("/contact", (req, res)=> {
    const contactPath = join(publicPath, "contact.html");
    res.sendFile(contactPath);
})

app.post("/contact", (req, res)=> {
    console.log(req.body);
    res.send(`<p>Дякуємо за зверненя!</p>`);
})

app.use((req, res)=> {
    const notFoundPath = join(publicPath, "404.html");
    res.status(404).sendFile(notFoundPath);
})

app.listen(3000, ()=> console.log("Server running on 3000 port"));