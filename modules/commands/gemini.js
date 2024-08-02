const axios = require('axios');
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "gemini",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "tnt",
  description: "Chat gemini",
  commandCategory: "Tiện ích",
  usages: "gemini",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const text = args.join(" ");
  if (!text) return api.sendMessage("Thiếu câu hỏi", event.threadID);
  try {
    const response = await axios.get(`https://apitntxtrick.onlitegix.com/gemini?q=${text}`);
    const { parts } = response.data.candidates[0].content;

    const body = `Chat Gemini: ${parts.map(part => part.text).join("")} `;
    api.sendMessage(body, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("Đã xảy ra lỗb.", event.threadID, event.messageID);
  }
};
