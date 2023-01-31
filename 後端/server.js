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
    console.log('這裡是首頁', req.my_db2, req.dt);
    res.send('這裡是首頁');
  });

  //藝術品 頁面

  app.get('/product', async (req, res, next) => {
     console.log('這裡是 /product');
    //  let [data] = await pool.query('SELECT * FROM `product`');
    //  res.json(data);

  // 分頁
  // 從前端拿到目前是要第幾頁
  // 通常會放在 query string -> req.query.page
  const page= req.query.page || 1;
  // products/:productId?page=2
  // products/:productId -> 如果 page 沒有寫，預設使用者是要第一頁

   /// 總筆數？
  let [results] = await pool.execute('SELECT COUNT(*) AS total FROM product ');
  //console.log('GET /product/id -> count:', results[0].total);
  const total = results[0].total;

// 總共有幾頁
const perPage = 10; // 一頁有十筆
const totalPage = Math.ceil(total / perPage);

// 計算 offset, limit (一頁有幾筆)
const limit = perPage;
const offset = perPage * (page - 1);

// 根據 offset, limit 去取得資料
let [data] = await pool.execute('SELECT * FROM product ORDER BY id LIMIT ? OFFSET ?',  [limit, offset]);
// 把資料回覆給前端
res.json({
  pagination: {
    total,
    perPage,
    totalPage,
    page,
  },
  data,
});
});


//藝術品細節 頁面
app.get('/product/:productId', async (req, res, next) => {
  console.log('/product/:productId => ', req.params.productId);
  let [data] = await pool.query('SELECT * FROM product WHERE id=? ', [req.params.productId]);
    res.json(data);
  
  });    

  //藝術家 頁面

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
    
  //最新消息news 頁面
        
    app.get('/news', async (req, res, next) => {
            console.log('這裡是 /news');
            // 分頁
            // 從前端拿到目前是要第幾頁
            // 通常會放在 query string -> req.query.page
            const page= req.query.page || 1;

    /// 總筆數？
    let [results] = await pool.execute('SELECT COUNT(*) AS total FROM news');
    //console.log('GET /news -> count:', results[0].total);
    const total = results[0].total;

    // 總共有幾頁
    const perPage = 6; // 一頁有6筆
    const totalPage = Math.ceil(total / perPage);

    // 計算 offset, limit (一頁有幾筆)
    const limit = perPage;
    const offset = perPage * (page - 1);

  // 根據 offset, limit 去取得資料
    let [data] = await pool.execute('SELECT * FROM news ORDER BY news_id LIMIT ? OFFSET ?',  [limit, offset]);
  
    // 把資料回覆給前端
    res.json({
     pagination: {
     total,
     perPage,
     totalPage,
     page,
    },
    data,
   });    
  });
       
    app.get('/news/:newsId', async (req, res, next) => {
    console.log('/news/:newsId => ', req.params.spaceId);
    let [data] = await pool.query('SELECT * FROM news WHERE news_id=? ', [req.params.newsId]);
      res.json(data);
    });
  
   //空間 頁面

   app.get('/space', async (req, res, next) => {
    console.log('這裡是 /space');

    // 分頁
    // 從前端拿到目前是要第幾頁
    // 通常會放在 query string -> req.query.page
     //const page= req.query.page || 1;

    /// 總筆數？
    //  let [results] = await pool.execute('SELECT COUNT(*) AS total FROM space');
    //  console.log('GET /space -> count:', results[0].total);
    //  const total = results[0].total;

   // 總共有幾頁
    //  const perPage = 6; // 一頁有6筆
    //  const totalPage = Math.ceil(total / perPage);

   // 計算 offset, limit (一頁有幾筆)
    //  const limit = perPage;
    //  const offset = perPage * (page - 1);

   // 根據 offset, limit 去取得資料
   let [data] = await pool.query('SELECT * FROM space');

   
     // 把資料回覆給前端
     res.json(
     data,
    );
});        
    app.get('/space/:spaceId', async (req, res, next) => {
              console.log('/space/:spaceId => ', req.params.spaceId);
              let [data] = await pool.query('SELECT * FROM space WHERE space_id=? ', [req.params.spaceId]);
                res.json(data);
              });    
  
app.listen(3001, () => {
    console.log('Server running at port 3001');
  });
