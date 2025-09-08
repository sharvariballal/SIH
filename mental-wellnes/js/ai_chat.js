// Get DOM elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Gemini API Configuration
const API_KEY = "AIzaSyAm1gNMuGv43eDrUNyOq9FinbToQhctgGs"; // Paste your API key here

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

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

// --- Function to show a loading indicator ---
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

// --- Function to hide the loading indicator ---
function hideLoading() {
  const loadingDiv = document.getElementById("loading-indicator");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// --- Function to send a message to the Gemini API ---
async function sendMessageToGemini(message) {
  const payload = {
    contents: [{ parts: [{ text: message }] }],
    systemInstruction: {
      parts: [
        {
          text: "You are a supportive and empathetic chatbot for a mental health website. Your purpose is to listen, offer general words of encouragement, and remind users that you are not a substitute for professional help. Do not diagnose, give medical advice, or offer solutions to complex problems. Respond in a compassionate and gentle tone.",
        },
      ],
    },
  };

  const body = JSON.stringify(payload);
  const headers = { "Content-Type": "application/json" };

  let response;
  try {
    showLoading();
    response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const aiResponseText = result.candidates[0].content.parts[0].text;
    return aiResponseText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
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

// --- Set up event listeners ---
sendBtn.addEventListener("click", handleSendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});
