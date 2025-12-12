// Join room khi vào trang chat
const chat = document.querySelector(".chat");
if (chat) {
  const roomChatId = window.location.pathname.split("/").pop();
  const myId = chat.getAttribute("my-id");

  // Join room ngay khi load trang
  socket.emit("CLIENT_JOIN_ROOM", roomChatId);
}

const formSenData = document.querySelector(".inner-form");
if (formSenData) {
  console.log("Form found, attaching submit listener");

  // Dùng capture phase để chạy trước script.js
  formSenData.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // Ngăn tất cả listeners khác

      console.log("Form submitted via socket");

      const content = e.target.elements.content.value.trim();

      if (!content) return; // Không gửi tin nhắn rỗng

      // Lấy thông tin cần thiết
      const chat = document.querySelector(".chat");
      const roomChatId = window.location.pathname.split("/").pop();
      const myId = chat.getAttribute("my-id");

      // Kiểm tra socket đã sẵn sàng chưa
      if (!socket || !socket.connected) {
        console.error("Socket not connected!");
        alert("Kết nối bị ngắt, vui lòng reload trang");
        return;
      }

      // Gửi content lên server
      socket.emit("CLIENT_SEND_MESSAGE", {
        roomChatId: roomChatId,
        content: content,
        userId: myId,
      });

      e.target.elements.content.value = "";

      // Focus lại vào input
      e.target.elements.content.focus();
    },
    true
  ); // true = capture phase, chạy trước bubble phase
} else {
  console.error("Form .inner-form not found!");
}

// Begin socketio - Server return message
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  // Nhận được data, đưa data vào các thẻ div inner-incoming or inner-outgoing
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const div = document.createElement("div");
  const body = document.querySelector(".inner-body");
  let nameHtml = ``;

  // So sánh chính xác bằng cách convert cả 2 sang string
  if (myId.toString() === data.user_id.toString()) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    nameHtml = `
            <div class="inner-name">
                <i class="fa fa-user-circle" style="margin-right: 5px;"></i>${data.fullName}
            </div>
        `;
  }

  let innerHtml = `
        ${nameHtml}
        <div class="inner-content">${data.content}</div>
    `;

  div.innerHTML = innerHtml;
  body.appendChild(div);

  // Smooth scroll to bottom
  body.scrollTo({
    top: body.scrollHeight,
    behavior: "smooth",
  });

  // Play sound notification (optional)
  if (myId != data.user_id) {
    playNotificationSound();
  }
});

// Scroll to bottom on page load
const body = document.querySelector(".inner-body");
if (body) {
  body.scrollTop = body.scrollHeight;
}

// Emoji picker functionality
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };

  // Close emoji picker when clicking outside
  document.addEventListener("click", (e) => {
    if (!buttonIcon.contains(e.target) && !tooltip.contains(e.target)) {
      tooltip.classList.remove("shown");
    }
  });
}

// Insert emoji to input
const inputChat = document.querySelector(".inner-foot input[name = 'content']");
if (inputChat) {
  document
    .querySelector("emoji-picker")
    .addEventListener("emoji-click", (e) => {
      const cursorPosition = inputChat.selectionStart;
      const textBefore = inputChat.value.substring(0, cursorPosition);
      const textAfter = inputChat.value.substring(cursorPosition);

      inputChat.value = textBefore + e.detail.unicode + textAfter;

      // Set cursor position after emoji
      const newPosition = cursorPosition + e.detail.unicode.length;
      inputChat.setSelectionRange(newPosition, newPosition);
      inputChat.focus();
    });

  // Auto-resize input on type (optional enhancement)
  inputChat.addEventListener("input", () => {
    // Could add auto-resize logic here if needed
  });
}

// Optional: Notification sound function
function playNotificationSound() {
  // You can add an audio element or use Web Audio API
  // const audio = new Audio('/sounds/notification.mp3');
  // audio.play().catch(e => console.log('Sound play failed:', e));
}

// Show typing indicator (optional enhancement)
let typingTimer;
if (inputChat) {
  inputChat.addEventListener("keyup", () => {
    clearTimeout(typingTimer);
    // socket.emit('USER_TYPING', roomId);

    typingTimer = setTimeout(() => {
      // socket.emit('USER_STOPPED_TYPING', roomId);
    }, 1000);
  });
}
