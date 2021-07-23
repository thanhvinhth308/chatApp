const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const sockerio = require("socket.io");
const Filter = require("bad-words");

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
const sever = http.createServer(app);
const io = sockerio(sever);

let count = 1;
const messages = "chào mọi người";
//mỗi tab đại diện cho một client
//lắng nghe sự kiện kết nối từ client
//on là lăng nghe sự kiện kết nối
io.on("connection", (socket) => {
  //thông báo cho người vừa kết nối vào đăng nhập thành  công
  socket.emit(
    "send message from server to client",
    "hello,đăng nhập thành công"
  );
  //thông báo cho những người còn lại có người mới đăng nhập
  socket.broadcast.emit(
    "send message from server to client",
    "Có một người mới đăng nhập"
  );
  // phải là connection vì nó là sự kiện thằng client gửi lên
  // console.log("new client connect");
  //truyền count từ sever về client ,tham sô đầu là tên sự kiên tên gì cũng dc
  io.emit("send count to client", count);
  socket.emit("send message to client", messages);
  //nhận lại sự kiện từ client
  socket.on("send increment from client to sever", () => {
    count++;
    io.emit("send count to client", count);
  });

  socket.on("send message from client to server", (messageText, callback) => {
    const filter = new Filter();
    if (filter.isProfane(messageText)) {
      return callback("messageText không hợp lệ vì có từ khoá tục tĩu");
    }
    io.emit("send message from server to client", messageText);
    callback();
  });

  //ngat ket noi
  socket.on("disconnect", () => {
    //phải là disconnect bởi nó quy đinh socket io
    console.log("client left sever");
  });
});
app.use(express.static(publicPath));
const port = 7000;
sever.listen(port, () => {
  console.log("app run on local host 7000");
});
