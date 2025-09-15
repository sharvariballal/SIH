// js/ai_chat.js

// Send user input to Botpress
document.getElementById('send-btn').addEventListener('click', () => {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (text !== '') {
    window.botpressWebChat.sendEvent({ type: 'text', text });
    input.value = '';
  }
});

// (Optional) subscribe to Botpress messages to display in your own UI
// window.botpressWebChat.onEvent(event => {
//   if (event.type === 'message') {
//     console.log('Botpress says:', event);
//     // You can add code here to render messages in your custom chatbox
//   }
// });
