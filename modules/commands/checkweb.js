const axios = require('axios');
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "checkweb",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "tnt",
  description: "Kiểm tra uy tín web",
  commandCategory: "Tiện ích",
  usages: "checkweb",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const link = args.join("");
  if (!link) return api.sendMessage("Thiếu Url websites", event.threadID);
  try {
    const response = await axios.get(`https://apitntxtrick.onlitegix.com/checkweb?url=${link}`);
    const { date, dislike, like, ut } = response.data;

    const body = `===[ CHECK WEB ]===\n🗓 Ngày tạo web: ${date}\n👎 Dislike: ${dislike} \n👍 Like: ${like}\n✅ ${ut}`;
    api.sendMessage(body, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("Đã xảy ra lỗi khi kiểm tra web.", event.threadID, event.messageID);
  }
};
