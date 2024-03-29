let userName = "";

const messagesSection = document.querySelector("#messages-section"); //referencja do sekcji z wiadomościami.
const messagesList = document.querySelector("#messages-list"); //referencja do samej listy wiadomości.
const addMessageForm = document.querySelector("#add-messages-form"); //referencja do formularza dodawania wiadomości.
const userNameInput = document.querySelector("#username"); //referencja do pola tekstowego z formularza logowania.
const messageContentInput = document.querySelector("#message-content"); //referencja do pola tekstowego z formularza do wysyłania wiadomości.
const userNameForm = document.querySelector("#welcome-form"); //referencja do formularza z podaniem imienia

messageContentInput.autocomplete = "off";

function userLogin(event) {
  event.preventDefault();
  userName = userNameInput.value;
  if (userName) {
    messagesSection.classList.add("show");
    userNameForm.classList.remove("show");
    socket.emit("join", userName);
  } else {
    alert("Fill in the name field!");
  }
}

function sendMessage(event) {
  event.preventDefault();
  let msg = messageContentInput.value;
  if (msg) {
    addMessage(userName, msg);
    socket.emit("message", { userName, msg });
    messageContentInput.value = "";
  } else {
    alert("Type your message!");
  }
}

function addMessage(user, msg) {
  console.log(user, " wpisał: ", msg);
  const messageLi = document.createElement("li");
  messageLi.classList.add("message");
  messageLi.classList.add("message--received");
  if (user === userName) messageLi.classList.add("message--self");
  if (user === "Chatbot") messageLi.classList.add("message--bot");
  messageLi.innerHTML = `
    <h3 class="message__author">${user === userName ? "You" : user}</h3>
    <div class="message__content">
      ${msg}
    </div>
  `;
  messagesList.appendChild(messageLi);
}

userNameForm.addEventListener("submit", userLogin);
addMessageForm.addEventListener("submit", sendMessage);

const socket = io();
socket.on("message", ({ userName, msg }) => addMessage(userName, msg));

socket.on("userJoin", (userName) => {
  const botMsg = userName + " has joined the conversation!";
  addMessage("Chatbot", botMsg);
});
socket.on("userLeft", (userName) => {
  const botMsg = userName + " has left the conversation... :(";
  addMessage("Chatbot", botMsg);
});
