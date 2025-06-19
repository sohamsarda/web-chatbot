const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serves index.html

// ✅ Correct POST route
app.post("/chat", (req, res) => {
  const msg = req.body.message || "";
  const replies = [];

  if (/\b(price|cost|charges|fees|how much|quote|quotation|silver|multi)\b/i.test(msg)) {
    replies.push("Thank you for your interest. Our pricing starts at Tally Silver: Rs. 24,500 + GST and Tally Multi: Rs. 67,500 + GST. Please let us know if you would like a formal quotation.");
  }

  if (/\b(hours|timing|open|working hours|when are you open|availability)\b/i.test(msg)) {
    replies.push("Our working hours are Monday to Saturday, from 9:00 AM to 8:00 PM.");
  }

  if (/\b(product|service|solution|offerings|software|tally)\b/i.test(msg)) {
    replies.push("We offer a range of Tally solutions including Silver, Multi-user, and custom modules. Let us know your requirement.");
  }

  if (/\b(range|customization|addon|tdl|addons)\b/i.test(msg)) {
    replies.push("We offer wide range of Tally Customization as per your requirement.");
  }

  if (/\b(support|issue|problem|help|error|not working|bug|trouble|glitch)\b/i.test(msg)) {
    replies.push("Your support request has been noted. Our technical team will reach out to you shortly.");
  }

  if (/\b(branch|office|location|where|address|located)\b/i.test(msg)) {
    replies.push("Our Head Office is located in Jamnagar, with branch offices in Rajkot and Gandhidham.");
  }

  if (/\b(hi|hello|hey|good morning|good evening|greetings)\b/i.test(msg)) {
    replies.push("Hello! How can we assist you today?");
  }

  if (/\b(contact|email|phone|call|reach you|talk to)\b/i.test(msg)) {
    replies.push("You can reach us at sohamsardawork@gmail.com");
  }

  // Default fallback
  if (replies.length === 0) {
    replies.push("Thank you for contacting us. We will get back to you as soon as possible.");
  }

  // Combine all matching replies into one message
  const reply = replies.join(" ");

  res.json({ reply });
});


app.listen(port, () => {
  console.log(`🤖Chatbot server running at http://localhost:${port}`);
});
