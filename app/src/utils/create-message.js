const formatTime = require("dateformat");
const createMessage = (messageText) => {
  return {
    messageText,
    createAt: formatTime("dd/MM/yyyy-hh:mm:ss", new Date()),
  };
};
module.exports = {
  createMessage,
};
