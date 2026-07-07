import fs from "node:fs";
import path from "node:path";

const filePath = path.join("src", "file.txt");
const usersPath = path.join("src", "users.json");
const sallariesPath = path.join("src", "sallaries.json");
const highSallariesPath = path.join("src", "high-sallaries.json");
const lowSallariesPath = path.join("src", "low-sallaries.json");
// fs.readFile(filePath, "utf-8", (error, text)=> {
//     if(error) {
//         return console.log(error.message);
//     }
//     // const text = buffer.toString();
//     // console.log(text)
//     console.log(text)
// });

// fs.readFile(usersPath, "utf-8", (error, text)=> {
//     if(error) {
//         return console.log(error.message);
//     }
//     const users = JSON.parse(text);
//     console.log(users);
// })
fs.readFile(sallariesPath, "utf-8", (error, text) => {
  if (error) {
    return console.log(error.message);
  }
  const sallaries = JSON.parse(text);
  const hightSallaries = sallaries.filter((sallary) => sallary >= 4000);
  const lowSallaries = sallaries.filter((sallary) => sallary < 4000);
  fs.writeFile(highSallariesPath, JSON.stringify(hightSallaries), (error) => {
    if (error) {
      return console.log(error.message);
    }
    fs.writeFile(lowSallariesPath, JSON.stringify(lowSallaries), (error) => {
      if (error) {
        return console.log(error.message);
      }
    });
  });
});
