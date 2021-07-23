const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const sockerio = require("socket.io");

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
const sever = http.createServer(app);
const io = sockerio(sever);
let count = 1;
const messages = "chào mọi người";

//lắng nghe sự kiện kết nối từ client
//on là lăng nghe sự kiện
io.on("connection", (socket) => {
  console.log("new client connect");
  //truyền count từ sever về client ,tham sô đầu là tên sự kiên tên gì cũng dc
  socket.emit("send count to client", count);
  socket.emit("send message to client", messages);
  //nhận lại sự kiện từ client
  socket.on("send increment from client to sever", () => {
    count++;
    socket.emit("send count to client", count);
  });
  //ngat ket noi
  socket.on("disconnect", () => {
    console.log("client left sever");
  });
});
app.use(express.static(publicPath));
const port = 7000;
sever.listen(port, () => {
  console.log("app run on local host 7000");
});
