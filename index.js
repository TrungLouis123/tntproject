const http = require("http");
const path = require('path');
const express = require('express');
const logger = require("./utils/log");
const port = process.env.PORT || 2007;
const moment = require("moment-timezone");
const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");

moment.locale("vi");

const app = express();

const startTime = new Date();

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/utils/index.html'));
});

app.listen(port, () => {
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
    var ngayKhoiDong = moment(startTime).format("dddd, DD [tháng] MM [năm] YYYY");

    console.log('Máy chủ đã bắt đầu hoạt động trên cổng ' + port + ', Giờ hiện tại: ' + gio + ', Ngày khởi động: ' + ngayKhoiDong + "\n\n");
});

function startBot(message) {
    (message) ? logger(message, "BOT Loading") : "";
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "tntxtrick.js"], {
        cwd: __dirname,stdio: "inherit",shell: true
    });
   child.on("close",async (codeExit) => {
      var x = 'codeExit'.replace('codeExit',codeExit);
        if (codeExit == 1) return startBot("BOT Loading");
         else if (x.indexOf(2) == 0) {
           await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2,'')) * 1000));
                 startBot("Bot đã hoạt động, vui lòng chờ trong giây lát!");
       }
         else return; 
    });
    child.on("error", function (error) {
        logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ Starting ]");
    });
};

startBot();
