const axios = require('axios');
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "accaov",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "tnt",
  description: "Acc cộng đồng AOV",
  commandCategory: "game",
  usages: "accaov",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const response = await axios.get(`https://apitntxtrick.onlitegix.com/10tracclq?apikey=acclq`);
    //https://apitntxtrick.onlitegix.com/accaov?apikey=acclq api này ít acc lên nhanh hơn(nhiều acc bị khóa)
    const { account } = response.data;

    const body = `${account}`;
    api.sendMessage(body, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("Đã xảy ra lỗi khi lấy thông tin tài khoản.", event.threadID, event.messageID);
  }
};
