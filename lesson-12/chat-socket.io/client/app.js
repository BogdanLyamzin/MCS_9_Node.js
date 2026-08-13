let socket = null;
let myId = null;
let myName = null;

const login = document.getElementById("login");
const loginErrorBox = document.getElementById("loginError");
const nameForm = document.getElementById("nameForm");
const chat = document.getElementById("chat");
const userList = document.getElementById("usersList");

socket = io("http://localhost:3000");

const showLoginError = (text) => {
  loginErrorBox.textContent = text;
  loginErrorBox.classList.toggle("hidden", !text);
};

const enterChat = () => {
  login.classList.add("hidden");
  chat.classList.remove("hidden");
};

socket.on("connect", () => {
  myId = socket.id;
  showLoginError();
});

socket.on("disconnect", () => {
  myId = null;
  showLoginError("Connect faild. Reload page");
});

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { value: name } = e.target.elements.name;
  if (!socket.connected) {
    return showLoginError("Connect faild. Reload page");
  }
  myName = name;
  socket.emit("change:name", name);
  e.target.reset();
  enterChat();
});

socket.on("users", users => {
    userList.innerHTML = "";
    Object.entries(users).forEach(([id, name])=> {
        userList.insertAdjacentHTML("beforeend", `
            <li id=${id} class=${id === myId ? "is-me" : ""}>${name}</li>
            `)
    })
})
