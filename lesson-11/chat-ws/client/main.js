const connectResultBox = document.getElementById("connect-result");
const subscribeBox = document.getElementById("subscribe");
const formChat = document.getElementById("formChat");

const ws = new WebSocket("ws://localhost:8080");

// ws.onopen = ()=> {
//     connectResultBox.innerHTML = "Successfully connect";
// }

ws.addEventListener("open", () => {
  connectResultBox.innerHTML = "Successfully connect";
});

// ws.onmessage = e => {
//     const {data} = e;
//     subscribeBox.insertAdjacentHTML("beforeEnd", `<div>${data}</div>`);
// }

ws.addEventListener("message", (e) => {
  const { type, message } = JSON.parse(e.data);
  switch (type) {
    case "greeting":
      return subscribeBox.insertAdjacentHTML(
        "beforeEnd",
        `<p class="greeting-message">${message}</p>`,
      );
    case "chat-message":
      return subscribeBox.insertAdjacentHTML(
        "beforeEnd",
        `<p class="chat-message">${message}</p>`,
      );
  }
});

formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.textField.value;
  const data = JSON.stringify({
    type: "chat-message",
    message,
  });
  ws.send(data);
  e.target.reset();
});
