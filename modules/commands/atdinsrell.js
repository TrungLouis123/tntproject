const axios = require("axios");
const moment = require("moment-timezone");

const linkapi = "https://apitntxtrick.onlitegix.com/downall";

module.exports = {
    config: {
        name: "atd",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },

    run: ({ api, event, args }) => {
        // Command logic if any can be added here
    },
    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;

        if (!body || (!body.includes('https://www.instagram.com/reel/') && !body.includes('https://www.instagram.com/reel/')) || senderID === api.getCurrentUserID() || senderID === '') return;

        try {
            const response = await axios.get(`${linkapi}?link=${body}`);

            const { title, author, medias } = response.data;

            if (medias && medias.length > 0) {
                const mediaUrl = medias[0].url;
                const mediaResponse = await axios.get(mediaUrl, { responseType: "stream" });

                api.sendMessage({
                    body: `📝 Tiêu đề: ${title}\n👤 Tác giả: ${author}`,
                    attachment: mediaResponse.data
                }, event.threadID, event.messageID);
            } else {
                api.sendMessage("No media found for the provided link.", event.threadID, event.messageID);
            }
        } catch (error) {
            console.error("Error fetching video information or media stream:", error);
            api.sendMessage("An error occurred while processing the video. Please try again later.", event.threadID, event.messageID);
        }
    }
};
