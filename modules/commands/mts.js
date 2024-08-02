const coinsup = 5000;
const coinsdown = 20;
const timeUnsend = 1;
const axios = global.nodemodule["axios"];
module.exports.config = {
    name: "mts",
    version: "1.5.0",
    hasPermssion: 0,
    credits: "tnt",
    description: "Ma Trận Số",
    commandCategory: "Game",
    usages: "mts",
    cooldowns: 5
};

module.exports.handleReply = async function ({ args, event, Users, api, handleReply, Currencies }) {
    var { so, suggestions } = handleReply;
    switch (handleReply.type) {
        case "choosee": {
            switch (event.body) {
                case "ss": {
                    api.unsendMessage(handleReply.messageID);
                    const res = await axios.get(`https://apitntxtrick.onlitegix.com/game/mts`);
                    const dataGame = res.data.dataGame;
                    const tukhoadung = dataGame.so;
                    const suggestions = dataGame.suggestions;
                    const fs = global.nodemodule["fs-extra"];
                    const anh1 = dataGame.link;

                    let Avatar = (await axios.get(anh1, { responseType: "arraybuffer" })).data;
                    fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
                    var imglove = [];
                    imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));

                    var msg = {
                        body: `⚠️ Vui lòng reply tin nhắn này để trả lời:\n👉 Reply [ Gợi ý ] - để xem gợi ý\n📌 Số coin bị trừ ${coinsdown}$`,
                        attachment: imglove
                    };
                    return api.sendMessage(msg, event.threadID, (error, info) => {
                        global.client.handleReply.push({
                            type: "reply2",
                            name: this.config.name,
                            author: event.senderID,
                            messageID: info.messageID,
                            so: tukhoadung,
                            suggestions: suggestions
                        });
                    });
                }
            }
            const choose = parseInt(event.body);
            if (isNaN(choose)) return api.sendMessage("⚠️ Vui lòng nhập 'ss' để bắt đầu", event.threadID, event.messageID);
            break;
        }

        case "reply": {
            const dapan = event.body.toLowerCase();
            if (dapan === "gợi ý") {
                let balance = (await Currencies.getData(event.senderID)).money;
                if (coinsdown > balance) return api.sendMessage(`Số dư không đủ ${coinsdown}$ để xem gợi ý!!`, event.threadID, event.messageID);
                await Currencies.decreaseMoney(event.senderID, coinsdown);
                api.sendMessage(`📌 Gợi ý cho bạn là: \n${suggestions} \n⚠️ Số coin bị trừ ${coinsdown}$`, event.threadID, event.messageID);
            } else {
                if (dapan === so) {
                    await Currencies.increaseMoney(event.senderID, coinsup);
                    var name1 = await Users.getData(event.senderID);
                    setTimeout(() => {
                        api.unsendMessage(handleReply.messageID);
                    }, timeUnsend * 1000);
                    return api.sendMessage(`😻${name1.name} đã trả lời chính xác!\n📌 Đáp án: ${so}\n Số coin tăng ${coinsup}$`, event.threadID, event.messageID);
                } else {
                    return api.sendMessage(`Sai rồi nha`, event.threadID, event.messageID);
                }
            }
            break;
        }

        case "reply2": {
            const dapan1 = event.body.toLowerCase();
            if (dapan1 === "gợi ý") {
                let balance = (await Currencies.getData(event.senderID)).money;
                if (coinsdown > balance) return api.sendMessage(`Số dư không đủ ${coinsdown}$ để xem gợi ý!!`, event.threadID, event.messageID);
                await Currencies.decreaseMoney(event.senderID, coinsdown);
                api.sendMessage(`📌Gợi ý cho bạn là: \n${suggestions}\n ⚠️ Số coin bị trừ ${coinsdown}$`, event.threadID, event.messageID);
            } else {
                if (dapan1 === so) {
                    await Currencies.increaseMoney(event.senderID, coinsup);
                    var name1 = await Users.getData(event.senderID);
                    setTimeout(() => {
                        api.unsendMessage(handleReply.messageID);
                    }, timeUnsend * 1000);
                    return api.sendMessage(`😻 ${name1.name} đã trả lời chính xác!\n📌 Đáp án: ${so}\n Số coin tăng ${coinsup}$`, event.threadID, event.messageID);
                } else {
                    return api.sendMessage(`⚠️ Sai rồi nha`, event.threadID, event.messageID);
                }
            }
            break;
        }
        default: break;
    }
};

module.exports.run = async function ({ args, api, event, Users }) {
    if (this.config.credits !== "tnt") {
        return api.sendMessage(`⚠️ Phát hiện credits đã bị thay đổi`, event.threadID, event.messageID);
    }
    if (!args[0]) {
        return api.sendMessage(`⚠️ Vui lòng 'ss' bằng cách reply tin nhắn để bắt đầu chơi`, event.threadID, (error, info) => {
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID
            });
        });
    }
    if (args[0] === 'ss') {
        const res = await axios.get(`https://apitntxtrick.onlitegix.com/game/mts`);
        const dataGame = res.data.dataGame;
        const tukhoadung = dataGame.so;
        const suggestions = dataGame.suggestions;
        const fs = global.nodemodule["fs-extra"];
        const anh1 = dataGame.link;

        let Avatar = (await axios.get(anh1, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
        var imglove = [];
        imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));

        var msg = {
            body: `⚠️ Vui lòng reply tin nhắn này để trả lời:\nReply: Gợi ý - để xem gợi ý \n📌 Số coin bị trừ ${coinsdown}$`,
            attachment: imglove
        };
        return api.sendMessage(msg, event.threadID, (error, info) => {
            global.client.handleReply.push({
                type: "reply2",
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID,
                so: tukhoadung,
                suggestions: suggestions
            });
        });
    }
};
