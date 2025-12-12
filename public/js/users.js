//gửi lời mời kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("btn-add-friend");
      const icon = button.querySelector("i");
      const text = button.querySelector("span");

      // Kiểm tra trạng thái hiện tại
      if (button.hasAttribute("btn-add-friend")) {
        // Đang ở trạng thái "Kết bạn" -> Gửi request và chuyển sang "Hủy"
        socket.emit("CLIENT_ADD_FRIEND", userId);

        // Đổi sang trạng thái "Hủy"
        button.removeAttribute("btn-add-friend");
        button.setAttribute("btn-cancel-friend", userId);
        icon.className = "fa fa-times";
        text.textContent = "Hủy";
        button.style.background = "#6b7280"; // Màu xám
      } else if (button.hasAttribute("btn-cancel-friend")) {
        // Đang ở trạng thái "Hủy" -> Hủy request và chuyển về "Kết bạn"
        socket.emit("CLIENT_CANCEL_FRIEND", userId);

        // Đổi về trạng thái "Kết bạn"
        button.removeAttribute("btn-cancel-friend");
        button.setAttribute("btn-add-friend", userId);
        icon.className = "fa fa-user-plus";
        text.textContent = "Kết bạn";
        button.style.background = ""; // Reset về màu mặc định
      }
    });
  });
}

//lời mời đã gửi - hủy request (cho các button khác)
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("btn-cancel-friend");
      const icon = button.querySelector("i");
      const text = button.querySelector("span");

      // Hủy request và chuyển về "Kết bạn"
      socket.emit("CLIENT_CANCEL_FRIEND", userId);

      // Đổi về trạng thái "Kết bạn"
      button.removeAttribute("btn-cancel-friend");
      button.setAttribute("btn-add-friend", userId);
      icon.className = "fa fa-user-plus";
      text.textContent = "Kết bạn";
      button.style.background = ""; // Reset về màu mặc định
    });
  });
}
//lời mời kết bạn
//xóa lời mời
const listBtnDeleteFriend = document.querySelectorAll("[btn-delete-friend]");
if (listBtnDeleteFriend.length > 0) {
  listBtnDeleteFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-delete-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
//chấp nhận lời mời
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");
      const userId = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}

// SERVER_RETURN_USERS_ACCEPT_LENGTH
socket.on("SERVER_RETURN_USERS_ACCEPT_LENGTH", (data) => {
  const badgeUserAccept = document.querySelector(
    `[badge-users-accept = "${data.UserIdB}"]`
  );
  if (badgeUserAccept) {
    badgeUserAccept.innerHTML = `${data.acceptLength}`;
  }
});
// END SERVER_RETURN_USERS_ACCEPT_LENGTH

// SERVER_RETURN_INFO_ACCEPT
socket.on("SERVER_RETURN_INFO_ACCEPT", (data) => {
  const infoUserAccept = document.querySelector(
    `[info-user-accept = "${data.userIdB}"]`
  );
  if (infoUserAccept) {
    const boxAcceptInfo = document.createElement("div");
    boxAcceptInfo.classList.add("col-6");
    boxAcceptInfo.setAttribute("user-id-accept", data.infoUserA._id);
    boxAcceptInfo.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img 
                        src="${
                          data.infoUserA.avatar
                            ? data.infoUserA.avatar
                            : "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
                        }" 
                        alt="${data.infoUserA.fullName}">
                </div>
                <div class="inner-info">
                    <div class="inner-name">${data.infoUserA.fullName}</div>
                    <div class="inner-buttons">
                        <button 
                            class="btn btn-sm bn-primary mr-1" 
                            btn-accept-friend="${
                              data.infoUserA._id
                            }">Chấp nhận</button>
                        <button 
                            class="btn btn-sm bn-primary mr-1" 
                            btn-delete-friend="${
                              data.infoUserA._id
                            }">Xóa</button>
                        <button 
                            class="btn btn-sm bn-primary mr-1" 
                            btn-accepted-friend="${data.infoUserA._id}" 
                            disabled>Đã chấp nhận</button>
                        <button 
                            class="btn btn-sm bn-primary mr-1" 
                            btn-deleted-friend="${data.infoUserA._id}" 
                            disabled>Đã xóa</button>
                    </div>
                </div>
            </div>
        `;
    infoUserAccept.appendChild(boxAcceptInfo);
    // catch event accept
    const buttonAccept = boxAcceptInfo.querySelector("[btn-accept-friend]");
    buttonAccept.addEventListener("click", () => {
      buttonAccept.closest(".box-user").classList.add("accepted");
      const userId = buttonAccept.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
    // catch event delete
    const buttonDelete = boxAcceptInfo.querySelector("[btn-delete-friend]");
    buttonDelete.addEventListener("click", () => {
      buttonDelete.closest(".box-user").classList.add("refuse");
      const userId = buttonDelete.getAttribute("btn-delete-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  }
});
// END SERVER_RETURN_INFO_ACCEPT

// SERVER_RETURN_ID_ACCEPT
socket.on("SERVER_RETURN_ID_ACCEPT", (data) => {
  const infoUserAccept = document.querySelector(
    `[info-user-accept = "${data.userIdB}"]`
  );
  if (infoUserAccept) {
    //find boxRemove
    const boxRemoveAccept = infoUserAccept.querySelector(
      `[user-id-accept = "${data.userIdA}"]`
    );
    if (boxRemoveAccept) {
      infoUserAccept.removeChild(boxRemoveAccept);
    }
  }
});
// END SERVER_RETURN_ID_ACCEPT

// SERVER_RETURN_ID_REQUEST
socket.on("SERVER_RETURN_ID_REQUEST", (data) => {
  const userNotFriend = document.querySelector(
    `[user-not-friend = "${data.userIdB}"]`
  );
  if (userNotFriend) {
    const boxRemoveUser = userNotFriend.querySelector(
      `[user-id = "${data.userIdA}"]`
    );
    if (boxRemoveUser) {
      userNotFriend.removeChild(boxRemoveUser);
    }
  }
});
// END SERVER_RETURN_ID_REQUEST

// SERVER_RETURN_STATUS_ONLINE
socket.on("SERVER_RETURN_STATUS_ONLINE", (data) => {
  const boxStatusOnline = document.querySelector(
    `[user-id = "${data.userId}"]`
  );
  if (boxStatusOnline) {
    const innerStatus = boxStatusOnline.querySelector(".inner-status");
    if (innerStatus) {
      innerStatus.setAttribute("status-online", data.status);
    }
  }
});
// END SERVER_RETURN_STATUS_ONLINE
