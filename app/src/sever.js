const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const sockerio = require("socket.io");
const Filter = require("bad-words");
const { createMessage } = require("./utils/create-message");
const { getUserList, addUser, removeUser } = require("./utils/users");

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
  // phải là connection vì nó là sự kiện thằng client gửi lên
  // console.log("new client connect");
  // socket.emit(
  //   "send message from server to client",
  //   "hello,đăng nhập thành công"
  // );
  // //thông báo cho những người còn lại có người mới đăng nhập
  // socket.broadcast.emit(
  //   "send message from server to client",
  //   createMessage("Có một người mới đăng nhập")
  // );

  //separate room,socket.join
  socket.on("join room from client to server", ({ room, username }) => {
    socket.join(room);

    //gửi cho người mới đăng nhập,không cần chia phòng
    socket.emit(
      "send message from server to client",
      "hello,đăng nhập thành công"
    );

    //thông báo cho những người còn lại có người mới đăng nhập
    socket.broadcast
      .to(room)
      .emit(
        "send message from server to client",
        createMessage(`${username}mới đăng nhập vào phòng ${room}`)
      );
    //chat
    socket.on("send message from client to server", (messageText, callback) => {
      const filter = new Filter();
      if (filter.isProfane(messageText)) {
        return callback("messageText không hợp lệ vì có từ khoá tục tĩu");
      }
      const messages = createMessage(messageText);
      io.to(room).emit("send message from server to client", messages);
      callback();
    });

    //location
    socket.on(
      "share location from client to server",
      ({ latitude, longitude }) => {
        const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
        io.emit("share location from server to client", linkLocation);
      }
    );

    //xử lý userlist
    const newUser = {
      id: socket.id,
      username,
      room,
    };
    addUser(newUser);
    io.to(room).emit("send user list from server to client", getUserList(room));
    socket.on("disconnect", () => {
      //phải là disconnect bởi nó quy đinh socket io
      removeUser(socket.id);
      io.to(room).emit(
        "send user list from server to client",
        getUserList(room)
      );
      console.log("client left sever");
    });
  });

  // //truyền count từ sever về client ,tham sô đầu là tên sự kiên tên gì cũng dc
  // io.emit("send count to client", count);
  // socket.emit("send message to client", messages);
  // //nhận lại sự kiện từ client
  // socket.on("send increment from client to sever", () => {
  //   count++;
  //   io.emit("send count to client", count);
  // });
  // //chat
  // socket.on("send message from client to server", (messageText, callback) => {
  //   const filter = new Filter();
  //   if (filter.isProfane(messageText)) {
  //     return callback("messageText không hợp lệ vì có từ khoá tục tĩu");
  //   }
  //   const messages = createMessage(messageText);
  //   io.emit("send message from server to client", messages);
  //   callback();
  // });

  // //location
  // socket.on(
  //   "share location from client to server",
  //   ({ latitude, longitude }) => {
  //     const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
  //     io.emit("share location from server to client", linkLocation);
  //   }
  // );

  //ngat ket noi
  // socket.on("disconnect", () => {
  //   //phải là disconnect bởi nó quy đinh socket io
  //   removeUser(socket.id);
  //   io.to(room).emit("send user list from server to client", getUserList(room));
  //   console.log("client left sever");
  // });
});
app.use(express.static(publicPath));
const port = 7000;
sever.listen(port, () => {
  console.log("app run on local host 7000");
});
