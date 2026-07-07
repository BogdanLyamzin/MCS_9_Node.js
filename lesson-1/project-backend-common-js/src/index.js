const {getCurrentDay} = require("./dateFunctions");
const axios = require("axios");

console.log(getCurrentDay());

const {data: posts} = await axios.get("https://jsonplaceholder.typicode.com/posts");
// console.log(posts[0])