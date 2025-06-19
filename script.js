function toggleChat() {
  const chat = document.getElementById("chatWidget");
  chat.classList.toggle("active");
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    setTimeout(() => {
      addMessage("bot", data.reply);
    }, 400);
  })
  .catch(error => {
    console.error("Error:", error);
    addMessage("bot", "Sorry, something went wrong.");
  });
}


function addMessage(sender, text) {
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
