const axios = require("axios");
const moment = require("moment-timezone");

const linkapi = "https://apitntxtrick.onlitegix.com/tiktok/downloadvideo";

module.exports = {
    config: {
        name: "tiktok",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "tik",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },
    
    run: ({ api, event, args }) => {},    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;
        const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
        
        if (!body || (!body.includes('https://vt.tiktok.com/') && !body.includes('https://vt.tiktok.com/')) || senderID === api.getCurrentUserID() || senderID === '') return;

        try {
            const { music, title } = (await axios.get(`${linkapi}?url=${body}`)).data.data;
            const stream = (await axios.get(music, { responseType: "stream" })).data;

            api.sendMessage({
                body: `📝 Tiêu đề: ${title}`,
                attachment: stream
            }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
        }
    }
};
