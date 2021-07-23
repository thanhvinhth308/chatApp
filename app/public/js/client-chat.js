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
