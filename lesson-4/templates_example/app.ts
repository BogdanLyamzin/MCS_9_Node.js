import express from "express";
import {resolve} from "node:path";
import expressLayouts from "express-ejs-layouts";

import {user, posts} from "./data/db.ts";

const templatesPath = resolve("templates");
const publicPath = resolve("public");

const app = express();

app.use(express.static(publicPath));
app.use(expressLayouts);
app.use(express.urlencoded());

app.set("view engine", "ejs");
app.set("views", templatesPath);
app.set("layout", "layout");

app.get("/", (req, res)=> {
  res.render("index", {
    title: "Main page",
    currentPage: "home",
    user,
  });
})

app.get("/blog", (req, res)=> {
  res.render("blog", {
    title: "Blog page",
    currentPage: "blog",
    posts,
  });
})

app.get("/contact", (req, res)=> {
  res.render("contact", {
    title: "Contact page",
    currentPage: "contact",
    message: null,
  });
})

app.post("/contact", (req, res)=> {
  const {username} = req.body;

  res.render("contact", {
    title: "Contact page",
    currentPage: "contact",
    message: `Дякуємо за звернення, ${username}.`,
  });
})

app.use((req, res)=> {
  res.status(404).render("404", {
    title: `Not found ${req.url}`,
    currentPage: ""
  })
})

app.listen(3000, ()=> console.log("Server running on 3000 port"));