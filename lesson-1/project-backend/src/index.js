import { getCurrentDay } from "./dateFunctions.js";
import axios from "axios";

console.log(getCurrentDay());
const {data: posts} = await axios.get("https://jsonplaceholder.typicode.com/posts");
console.log(posts[0])