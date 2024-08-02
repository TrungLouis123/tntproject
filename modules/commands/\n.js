const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "\n",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "tnt",
  description: "Kiểm tra dấu lệnh",
  commandCategory: "Tiện ích",
  usages: "",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const response = await axios.get('https://apitntxtrick.onlitegix.com/image_anime', { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const imagePath = path.resolve(__dirname, 'anime_image.jpg');

    await fs.writeFile(imagePath, imageBuffer);
    api.sendMessage({
      body: "Gọi tao có gì không?",
      attachment: fs.createReadStream(imagePath)
    }, event.threadID, () => {
      
      fs.unlinkSync(imagePath);
    }, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("Đã xảy ra lỗi", event.threadID, event.messageID);
  }
};
