// --- Get DOM elements ---
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// --- Functions to create chat messages ---
function addMessage(text, isUser = false) {
  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container ${
    isUser ? "user-message" : "chatbot-message"
  }`;

  if (isUser) {
    messageContainer.innerHTML = `
      <div class="message-bubble user-bubble">
        ${text}
      </div>
    `;
  } else {
    messageContainer.innerHTML = `
      <div class="chatbot-icon">
        <i class="fa-solid fa-seedling"></i>
      </div>
      <div class="message-bubble chatbot-bubble">
        ${text}
      </div>
    `;
  }

  chatBox.appendChild(messageContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// --- Show a loading indicator ---
function showLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading-indicator";
  loadingDiv.className = "message-container chatbot-message";
  loadingDiv.innerHTML = `
    <div class="chatbot-icon">
      <i class="fa-solid fa-seedling"></i>
    </div>
    <div class="message-bubble chatbot-bubble">
      <div class="loader"></div>
    </div>
  `;
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// --- Hide the loading indicator ---
function hideLoading() {
  const loadingDiv = document.getElementById("loading-indicator");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// --- Send a message to your Node.js backend ---
async function sendMessageToGemini(message) {
  try {
    showLoading();
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error calling backend:", error);
    return "I'm sorry, I am currently unable to respond. Please try again later.";
  } finally {
    hideLoading();
  }
}

// --- Main function to handle sending a message ---
async function handleSendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  addMessage(message, true);
  userInput.value = "";

  const aiResponse = await sendMessageToGemini(message);
  addMessage(aiResponse, false);
}

// --- Event listeners ---
sendBtn.addEventListener("click", handleSendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});
