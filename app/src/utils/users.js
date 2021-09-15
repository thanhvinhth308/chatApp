let userList = [
  {
    id: "1",
    username: "peter",
    room: "fe02",
  },
  {
    id: "2",
    username: "david",
    room: "fe01",
  },
];

const addUser = (newUser) => (userList = [...userList, newUser]);
//  {
//   console.log([...userList, newUser]);
//   userList.push(newUser);
// };

const removeUser = (id) =>
  (userList = userList.filter((user) => user.id !== id));

const getUserList = (room) => userList.filter((user) => user.room === room);
module.exports = {
  getUserList,
  addUser,
  removeUser,
};
