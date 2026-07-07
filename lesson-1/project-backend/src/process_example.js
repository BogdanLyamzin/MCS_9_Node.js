import fs from "node:fs/promises";
import path from "node:path";

const usersPath = path.join("src", "users2.json");

const usersJson = await fs.readFile(usersPath);
const users = JSON.parse(usersJson);
// console.log(process.cwd());

process.on("uncaughtException", error => {
    console.log(error.message);
    process.exit(1);
})