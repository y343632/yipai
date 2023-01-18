const express = require('express');

const app = express();

require('dotenv').config();
const mysql2 = require('mysql2/promise');

let pool = mysql2.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    // 限制 pool 連線數的上限
    connectionLimit: 10,
  });
  
  // 允許跨源存取
  // 預設是全部開放
  // 也可以做部分限制，參考 npm cors 的文件
  const cors = require('cors');
  app.use(cors());

app.get('/', (req, res, next) => {
    console.log('這裡是首頁 2', req.mfee31, req.dt);
    res.send('Hello Express 9');
  });

  app.get('/product', async (req, res, next) => {
    console.log('這裡是 /product');
    let [data] = await pool.query('SELECT * FROM product');
    res.json(data);
  });
  
  app.get('/product/:productId', async (req, res, next) => {
    console.log('/product/:productId => ', req.params.productId);
    let [data] = await pool.query('SELECT * FROM product WHERE id=? ', [req.params.productId]);
      res.json(data);
    });

    app.get('/sellers', async (req, res, next) => {
        console.log('這裡是 /sellers');
        let [data] = await pool.query('SELECT * FROM sellers');
        res.json(data);
      });
      
    app.get('/sellers/:sellersId', async (req, res, next) => {
        console.log('/sellers/:sellersId => ', req.params.spaceId);
        let [data] = await pool.query('SELECT * FROM sellers WHERE sellers_id=? ', [req.params.sellersId]);
          res.json(data);
        });
    app.get('/news', async (req, res, next) => {
            console.log('這裡是 /news');
            let [data] = await pool.query('SELECT * FROM news');
            res.json(data);
          });
          
    app.get('/news/:newsId', async (req, res, next) => {
            console.log('/news/:newsId => ', req.params.spaceId);
            let [data] = await pool.query('SELECT * FROM news WHERE news_id=? ', [req.params.newsId]);
              res.json(data);
            });
  

app.listen(3001, () => {
    console.log('Server running at port 3001');
  });