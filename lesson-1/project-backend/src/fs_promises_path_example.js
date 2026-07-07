import fs from "node:fs/promises";
import path from "node:path";

const filePath = path.join("src", "file.txt");
const usersPath = path.join("src", "users.json");
const sallariesPath = path.join("src", "sallaries.json");
const highSallariesPath = path.join("src", "high-sallaries.json");
const lowSallariesPath = path.join("src", "low-sallaries.json");
// fs.readFile(filePath, "utf-8")
//   .then(text => console.log(text))
//   .catch(error => console.log(error));

// const usersJson = await fs.readFile(usersPath);
// const users = JSON.parse(usersJson);
// console.log(users);

const splitSallaries = async () => {
  const sallaries = JSON.parse(await fs.readFile(sallariesPath));
  const hightSallaries = sallaries.filter((sallary) => sallary >= 4000);
  const lowSallaries = sallaries.filter((sallary) => sallary < 4000);
  await fs.writeFile(highSallariesPath, JSON.stringify(hightSallaries, null, 2));
  await fs.writeFile(lowSallariesPath, JSON.stringify(lowSallaries, null, 2));
};
splitSallaries();

