const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs");

const linkapi = "https://apitntxtrick.onlitegix.com/tikmusic";

module.exports = {
    config: {
        name: "tikmp3",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "Down ",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },
    
    run: ({ api, event, args }) => {},    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;
        const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
        
        if (!body || (!body.includes('https://vt.tiktok.com/') && !body.includes('https://vt.tiktok.com/'))) return;

        try {
            const { play, title, author, video_count } = (await axios.get(`${linkapi}?link=${body}`)).data.data; 

            const audioUrl = play;

            const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
            const audioData = Buffer.from(response.data, 'binary');

            const fileName = `${title}.mp3`;
            const filePath = `./${fileName}`;

            fs.writeFileSync(filePath, audioData);

            api.sendMessage({
                body: `📝 Tiêu đề: ${title}\n👤 Tác giả: ${author}\n⚠️ Số lượng video: ${video_count}`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, event.messageID);

            fs.unlinkSync(filePath); 
        } catch (error) {
            console.error(error);
            
        }
    }
};
