function toggleChat() {
  const chat = document.getElementById("chatWidget");
  chat.classList.toggle("active");
}

function sendQuickMessage(text) {
  document.getElementById("userInput").value = text;
  sendMessage();
}
function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  // Add "typing..." indicator
  const chatBox = document.getElementById("chatBox");
  const typingMsg = document.createElement("div");
  typingMsg.className = "bot typing";
  typingMsg.textContent = "Typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

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
      // Remove typing indicator
      chatBox.removeChild(typingMsg);
      // Add actual bot reply
      addMessage("bot", data.reply);
    }, 800); // Simulate delay
  })
  .catch(err => {
    console.error("Error:", err);
    chatBox.removeChild(typingMsg);
    addMessage("bot", "Oops! Something went wrong. Please try again.");
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
