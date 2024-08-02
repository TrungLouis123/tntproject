const axios = require('axios');
const fs = require('fs');
const request = require('request');
const FormData = require('form-data');
const path = require('path');

module.exports.config = {
  name: "txt",
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

  // Check if the message is a reply and contains attachments
  if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("Bạn phải reply một audio nào đó", threadID, messageID);
  }

  // Check if the attachment is an audio file
  const attachment = messageReply.attachments[0];
  if (attachment.type !== "audio") {
    return api.sendMessage("Bạn phải reply một file audio", threadID, messageID);
  }

  // Ensure temp directory exists
  const tempDir = './temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Download the audio file
  const audioUrl = attachment.url;
  const audioPath = path.join(tempDir, attachment.filename);

  // Create a write stream to save the file
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
        }
      });

      // Handle response from the server
      const { data } = response;
      let msg = "Upload thành công:\n";
      msg += `${data.url}\n`;
      
      api.sendMessage(msg, threadID);
    } catch (error) {
      console.error("Error uploading file:", error);
      api.sendMessage("Có lỗi xảy ra khi upload file.", threadID);
    } finally {
      // Clean up temporary file
      fs.unlinkSync(audioPath);
    }
  });
};
