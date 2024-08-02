const axios = require('axios');
const fs = require('fs');
const request = require('request');
const FormData = require('form-data');
const path = require('path');

module.exports.config = {
  name: "test",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "tnt",
  description: "TXT",
  commandCategory: "Tien ich",
  usages: "reply",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, type, messageReply, messageID } = event;

  if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("Bạn phải reply một audio nào đó", threadID, messageID);
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== "audio") {
    return api.sendMessage("Bạn phải reply một file audio", threadID, messageID);
  }

  const tempDir = './temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const audioUrl = attachment.url;
  const audioPath = path.join(tempDir, attachment.filename);

  const writeStream = fs.createWriteStream(audioPath);
  writeStream.on('error', (error) => {
    console.error("Error creating write stream:", error);
    return api.sendMessage("Có lỗi xảy ra khi tải file.", threadID);
  });

  request(audioUrl).pipe(writeStream).on('close', async () => {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(audioPath));

      const response = await axios.post('https://txtupload.onlitegix.com/api/upload', form, {
        headers: {
          ...form.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const { data } = response;
      let msg = "Upload thành công:\n";
      msg += `URL: ${data.url}\n`;
      msg += `Name: ${data.name}\n`;
      msg += `MIME Type: ${data.mimeType}\n`;
      msg += `Extension: ${data.ext}\n`;
      msg += `Size: ${data.size} bytes`;

      api.sendMessage(msg, threadID);
    } catch (error) {
      console.error("Error uploading file:", error);
      api.sendMessage("Có lỗi xảy ra khi upload file.", threadID);
    } finally {
      fs.unlinkSync(audioPath);
    }
  });
};
