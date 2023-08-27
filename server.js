const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express'); // Thêm Express.js

const app = express(); // Khởi tạo Express.js

// Phục vụ các tệp tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Tạo máy chủ HTTP để phục vụ trang web và kết nối WebSocket
const server = http.createServer(app);

// Tạo máy chủ WebSocket
const wss = new WebSocket.Server({ server });
var str,tm,hm;
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    // console.log(`Received: ${message}`);    
    // Trả lại tin nhắn cho tất cả các kết nối khác
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message+"");
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});