//yêu cầu sever kêt nối với client
var socket = io();
//lắng nghe sự kiên,nhân lại dữ liệu từ sever gửi về,cùng tên vs tên sự kiên trên server
socket.on("send count to client", (count) => {
  console.log("Đã nhận được count");
  document.getElementById("value-count").innerHTML = count;
  console.log(count);
});
socket.on("send message to client", (message) => {
  console.log("Đã nhận được message");
  console.log(message);
});
document.getElementById("btn-increment").addEventListener("click", () => {
  //gửi sự kiên từ client lên sever
  socket.emit("send increment from client to sever");
});

socket.on("send message from server to client", (messageText) => {
  console.log(messageText);
});
document.getElementById("form-message").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("input-messages").value;
  const acknowledgements = (errors) => {
    if (errors) {
      return alert(errors);
    }
    console.log("Bạn đã gửi tin nhắn thành công");
  };
  socket.emit(
    "send message from client to server",
    messageText,
    acknowledgements
  );
});

//gửi vị trí
document.getElementById("btn-share-location").addEventListener("click", () => {
  //navigator là phương thức có sănx của browser
  if (!navigator.geolocation) return alert("not support");
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("share location from client to server", {
      latitude,
      longitude,
    });
  });
});

socket.on("share location from server to client", (linkLocation) => {
  console.log(
    "🚀 ~ file: client-chat.js ~ line 51 ~ socket.on ~ linkLocation",
    linkLocation
  );
});

// xử lý query String
const queryString = location.search;
const params = Qs.parse(queryString, { ignoreQueryPrefix: true });
const { room, username } = params;
socket.emit("join room from client to server", { room, username });

//xử lý nhân user list
socket.on("send user list from server to client", (userList) => {
  console.log(
    "🚀 ~ file: client-chat.js ~ line 65 ~ socket.on ~ userList",
    userList
  );
});
