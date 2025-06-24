let contactStage = 0;
let tempName = "";
let tempPhone = "";

// ✅ Dynamically set base API URL based on environment
const BASE_URL = location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://web-chatbot-cmmc.onrender.com";

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
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = "flex";
  chatBox.scrollTop = chatBox.scrollHeight;

  // 👉 Step 1: Ask for name
  if (contactStage === 1) {
    setTimeout(() => {
      spinner.style.display = "none";
      tempName = message;
      addMessage("bot", `Thanks, ${tempName}! Can you also share your phone number?`);
      contactStage = 2;
    }, 600);
    return;
  }

  // 👉 Step 2: Ask for phone, then submit to backend
  if (contactStage === 2) {
    setTimeout(() => {
      spinner.style.display = "none";
      tempPhone = message;

      fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tempName, phone: tempPhone })
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to save contact info.");
        })
        .catch(err => {
          console.error("❌ Failed to save contact:", err);
          addMessage("bot", "⚠️ There was a problem saving your details. Please try again later.");
        });

      addMessage("bot", `✅ Great, ${tempName}! We'll contact you at ${tempPhone}.`);
      contactStage = 0;
    }, 600);
    return;
  }

  // 👉 Regular chatbot conversation
  fetch(`${BASE_URL}/chat`, {
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
        spinner.style.display = "none";
        addMessage("bot", data.reply);
      }, 800);
    })
    .catch(err => {
      console.error("💥 Error:", err);
      spinner.style.display = "none";
      addMessage("bot", "⚠️ Oops! Something went wrong. Please try again.");
    });
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chatBox");
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = sender === "user" ? "🧑" : "🤖";
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;
  bubble.textContent = text;
  if (sender === "user") {
    row.appendChild(bubble);
    row.appendChild(avatar);
  } else {
    row.appendChild(avatar);
    row.appendChild(bubble);
  }
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 👇 Support button event
document.getElementById("supportBtn").addEventListener("click", startSupportFlow);
