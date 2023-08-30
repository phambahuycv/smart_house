const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express'); // Thêm Express.js
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express(); // Khởi tạo Express.js

// Phục vụ các tệp tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));
///////////////////////////////////////////////////////////////////////////////////////////////////////

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// MySQL
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'n10i'
})
app.get('/get', (req, res) => {
  pool.getConnection((err, connection) => {
      if(err) throw err
      console.log('connected as id ' + connection.threadId)
      connection.query('SELECT date, led1, led2, temperature, humidity FROM dbiot', (err, rows) => {
          connection.release() // return the connection to pool

          if (!err) {
              res.send(rows)
          } else {
              console.log(err)
          }

          // if(err) throw err
          console.log('The data from database table are: \n', rows)
      })
  })
});

// app.post('/insert', (req, res) => {

//   pool.getConnection((err, connection) => {
//       if(err) throw err
      
//       const params = req.body;
//       connection.query('INSERT INTO dbiot SET ?', params, (err, rows) => {
//       connection.release();
//       if (!err) {
//           res.send(`dbiot with the record ID  has been added.`);
//       } else {
//           console.log(err);
//       }    
//       console.log('The data from dbiot table are:11 \n', rows);
//       })
//   })
// });

app.get('/:date', (req, res) => {
  pool.getConnection((err, connection) => {
      const date = req.params.date;
      if(err) throw err
      connection.query('SELECT * FROM dbiot WHERE date LIKE ?',[date + '%'], (err, rows) => {
          connection.release() // return the connection to pool
          if (!err) {
              res.send(rows)
          } else {
              console.log(err)
          }
          //console.log('aaaa: \n', rows)
      })
  })
});

app.get('/index', function(req, res) {
  res.render('index.html');
});
///////////////////////////////////////////////////////////////////////////////////////////////////////
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