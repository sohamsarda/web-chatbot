let contactStage = 0;
let tempName = "";
let tempPhone = "";

function toggleChat() {
  const chat = document.getElementById("chatWidget");
  chat.classList.toggle("active");

  if (chat.classList.contains("active")) {
    const chatBox = document.getElementById("chatBox");

    if (!chatBox.dataset.welcomed) {
      addMessage("bot", "👋 Welcome!");
      chatBox.dataset.welcomed = true;
    }
  }
}

function sendQuickMessage(text) {
  document.getElementById("userInput").value = text;
  sendMessage();
}

function startSupportFlow() {
  const chatBox = document.getElementById("chatBox");
  contactStage = 1;
  tempName = "";
  tempPhone = "";
  addMessage("bot", "👤 Please enter your name:");
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  const chatBox = document.getElementById("chatBox");
  const typingMsg = document.createElement("div");
  typingMsg.className = "bot typing";
  typingMsg.textContent = "Typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Contact Info Flow (only triggered after clicking support button)
  if (contactStage === 1) {
    setTimeout(() => {
      chatBox.removeChild(typingMsg);
      tempName = message;
      addMessage("bot", `Thanks, ${tempName}! Can you also share your phone number?`);
      contactStage = 2;
    }, 600);
    return;
  }

  if (contactStage === 2) {
    setTimeout(() => {
      chatBox.removeChild(typingMsg);
      tempPhone = message;

      // Send name and phone to backend
      fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tempName, phone: tempPhone })
      }).catch(err => console.error("Failed to save contact:", err));

      addMessage("bot", `✅ Great, ${tempName}! We’ll contact you at ${tempPhone}.`);
      contactStage = 0;
    }, 600);
    return;
  }

  // Regular chatbot flow
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
        chatBox.removeChild(typingMsg);
        addMessage("bot", data.reply);
      }, 800);
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

// Support button event listener
document.getElementById("supportBtn").addEventListener("click", function () {
  startSupportFlow();
});
