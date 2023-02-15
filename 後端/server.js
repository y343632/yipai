// 安裝expressSession套件 https://www.npmjs.com/package/express-session
const expressSession = require("express-session");
// 安裝session-file-store套件 https://www.npmjs.com/package/session-file-store
const FileStore = require("session-file-store")(expressSession);
const multer = require('multer')
const path = require("path");
const { checkLogin } = require("./middlewares/authMiddleware");

const express = require("express");
const app = express();
const uploadsPhoto = require('./routers/photoUplod');
app.use('/uploadsPhoto', uploadsPhoto);

require("dotenv").config();
const pool = require("./utils/db");
// 連線網址 http://localhost:3001
// 允許跨源存取,預設是全部開放,也可以做部分限制，參考 npm cors 的文件
const cors = require("cors");
app.use(
    cors({
        // 必須把 credentails 設定成 true，一定要設定 origin (來源)
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);
// 如果要讓 express 認得 json 資料,需要加上這個中間件
app.use(express.json());

app.use(
    expressSession({
        // 告訴 express-session session 要存sessions資料夾
        store: new FileStore({
            path: path.join(__dirname, "..", "sessions"),
        }),
        secret: process.env.SESSION_SECRET,
        // true: 即使 session 沒有改變也重新儲存一次
        resave: false,
        // true: 還沒有正式初始化的 session 也真的存起來
        saveUninitialized: false,
    })
);

// middleware => pipeline pattern

// 處理使用者註冊時上傳的圖片網址
app.use('/public', express.static('./public'));

// 首頁
app.get("/", async (req, res, next) => {
    console.log("這裡是藝拍首頁,顯示首頁資料");
    console.log('---------------------51',req.session.member)
    let [data] = await pool.query(
        "SELECT * FROM users JOIN user_order ON users.users_id = user_order.user_id JOIN product ON product.id = user_order.product_id LIMIT 1"
    );
    res.json(data);
});
//訂單送出請求
app.post("/submitOrder", async (req, res) => {
    const { userName, productId, orderDate } = req.body;
    try {
      const [result] = await pool.query(
        "INSERT INTO user_order (user_id, product_id, order_date) VALUES ((SELECT users_id FROM users WHERE users_name = ?), ?, ?)",
        [userName, productId, orderDate]
      );
      res.json({ status: "success", result });
    } catch (error) {
      res.json({ status: "error", error });
    }
  });

// 購物車
app.get("/cart", async (req, res, next) => {
    console.log("這裡是 /cart");
    let [data] = await pool.query(
        "SELECT * FROM product JOIN user_order ON product.id = user_order.product_id "
    );
    res.json(data);
});
app.get("/maybelike", async (req, res, next) => {
    console.log("這裡是 /maybelike");
    let [data] = await pool.query("SELECT * FROM product ORDER BY RAND() LIMIT 0,5 ");
    res.json(data);
});
// 商品頁
app.get("/product", async (req, res, next) => {
    console.log("這裡是 /product");
    let [data] = await pool.query("SELECT * FROM product");
    res.json(data);
});

//coupon

app.get('/coupon', async (req, res,next) => {
    console.log('這裡是 /coupon')
  
    let [data] = await pool.query(
      'SELECT * FROM coupon WHERE user_id=?', [req.session.member.users_id]);
    res.json(data);
  })

//coupon Total
  app.get('/couponTotal', async (req, res,next) => {
    console.log('這裡是 /couponTotal')
    if(!req.session.member){
        res.json();
    }else{
        let [data] = await pool.query(
            'SELECT COUNT(user_id) AS total FROM coupon WHERE user_id=?', [req.session.member.users_id]);
          res.json(data);
    }
  })

//user like  
app.get('/userlike', async (req, res,next) => {
    console.log('這裡是 /userlike')
    if(!req.session.member){
        res.json();
    }else{
        let [data] = await pool.query(
            'SELECT user_like.*, product.img_file, product.name, product.width, product.height, product.price FROM user_like JOIN product ON user_like.product_id = product.id  WHERE user_id=?', [req.session.member.users_id]);
          res.json(data);
    }
  })

//產品加入收藏
app.post('/users/user_like_add', async (req, res, next) => {
    // console.log(req.session.user.id, req.body.product_id)
    // 存到資料庫
    if (!req.session.user) {
      res.json([])
    } else {
      let result = await pool.execute(
        'INSERT INTO user_like ( product_id, user_id) VALUES ( ?, ?)',
        [req.body.product_id, req.session.member.users_id ])
  
      console.log('加入收藏', result)
      // 回覆給前端
      res.json({
        msg: '加入收藏',
      })
    }
  })
  
  //產品取消收藏
  app.delete('/users/user_like_delete/:productId', async (req, res, next) => {
    console.log('------------------',req.session.member.users_id, req.params.productId)
    // 存到資料庫
    if (!req.session.user) {
      res.json([])
    } else {
        await pool.execute(
        'DELETE FROM user_like WHERE user_id = ? AND product_id = ?',
        [req.session.member.users_id, req.params.productId]
      )
  
      // 回覆給前端
      res.json({
        msg: '取消收藏',
      })
    }
  })


// const path = require('path');
// 設定註冊上傳圖片存哪裡: 位置跟名稱
const storage = multer.diskStorage({
  // 設定儲存的目的地 -> 檔案夾
  // 先手動建立好檔案夾 public/uploads
  destination: function (req, file, cb) {
    // path.join: 避免不同的作業系統之間 / 或 \
    // __dirname 目前檔案所在的目錄路徑
    cb(null, path.join(__dirname, '.', 'public', 'uploads'));
  },
  // 圖片名稱
  filename: function (req, file, cb) {
    console.log('multer storage', req.file);
    const ext = file.originalname.split('.').pop();
    //使用圖片的名稱套件 uuid
    cb(null, `${Date.now()}.${ext}`);
  },
});
// 真正在處理上傳
const uploader = multer({
  storage: storage,
  // 圖片格式的 validation
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
      cb(new Error('上傳圖片格式不合規定'), false);
    } else {
      cb(null, true);
    }
  },
  // 限制檔案的大小
  limits: {
    // 1k = 1024 => 200k 200x1024
    fileSize: 200 * 1024, // 204800
  },
});

app.post("/product",uploader.single('photo'), async (req, res, next) => {
    console.log("product post", req.body, req.file);
    let [data] = await pool.query(
        `INSERT INTO product (img_file, name, width , height, material, product_style, artist, creation_year, work_hue, price, detail_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); `,
        [
            req.file.filename,
            req.body.name,
            req.body.width,
            req.body.height,
            req.body.material,
            req.body.style,
            req.body.artist,
            req.body.creation_year,
            req.body.work_hue,
            req.body.price,
            req.body.detail_text,
        ]
    );
    console.log(req.body);
      res.json(data);
    });



// 商品頁細節
app.get("/product/:productId", async (req, res, next) => {
    console.log("/product/:productId => ", req.params.productId);
    let [data] = await pool.query("SELECT * FROM product WHERE id=? ", [
        req.params.productId,
    ]);
    res.json(data);
});

//課程收藏
app.get('/productLike/:productId', async (req, res, next) => {
    console.log('------------------175',req.session.member.id)
    if(!req.session.member){
    res.json()
    }else{
        let [data] = await pool.query(
            'SELECT users_like.id, users_like.users_id ,users_like.product_id FROM users_like JOIN users ON users_like.users_id = users.users_id JOIN product ON users_like.product_id = product.id WHERE users_like.product_id = ? AND users_like.users_id = ? ',
            [req.params.productId , req.session.member.id]
          )
          
          res.json(data)
          next()
    }
  })


// 所有使用者資料
app.get("/users", async (req, res, next) => {
    console.log("這裡是 /users");
    let [data] = await pool.query("SELECT * FROM users");
    res.json(data);
});
//
app.get("/news/:newsId", async (req, res, next) => {
    console.log("/news/:newsId => ", req.params.newsId);
    let [data] = await pool.query("SELECT * FROM news WHERE news_id=? ", [
        req.params.newsId,
    ]);
    res.json(data);
});
// 會員部分路由
app.get("/api", checkLogin, async (req, res, next) => {
    // if(req.session.member){
    console.log(req.session.member);
    let [data] = await pool.query("SELECT * FROM users WHERE users_id=? ", [
        req.session.member.id,
    ]);
    res.json(data);
});
// 授權路由
const authRouter = require("./routers/authRouter");
app.use("/api/auth", authRouter);

// 會員登入路由
const memberRouter = require("./routers/memberRouter");
app.use("/api/members", memberRouter);

// 會員資料檢視
app.get("/users/:usersId", async (req, res, next) => {
    console.log("/users/:usersId => ", req.params.usersId);
    let [data] = await pool.query("SELECT * FROM users WHERE users_id=? ", [
        req.params.usersId,
    ]);
    res.json(data);
});
// 更改會員資料
app.put("/users/:usersId", async (req, res, next) => {
    console.log("/users/:usersId TO upload ", req.params.usersId);
    let [data] = await pool.query(
        `UPDATE users SET users_name = ? , users_account = ? , users_email = ? ,users_phone = ? WHERE users_id = ?`,
        [
            req.body.username,
            req.body.account,
            req.body.email,
            req.body.phone,
            req.body.usersId,
        ]
    );
    console.log(req.body);
    res.json(data);
});

// 展覽消息
app.get("/news", async (req, res, next) => {
    console.log("這裡是 /news");
    let [data] = await pool.query("SELECT * FROM news");
    res.json(data);
});
app.get("/news/:newsId", async (req, res, next) => {
    console.log("/news/:newsId => ", req.params.newsId);
    let [data] = await pool.query("SELECT * FROM news WHERE news_id=? ", [
        req.params.newsId,
    ]);
    res.json(data);
});
// 空間
app.get("/space", async (req, res, next) => {
    console.log("這裡是 /space");
    let [data] = await pool.query("SELECT * FROM space");
    res.json(data);
});
app.get("/space/:spaceId", async (req, res, next) => {
    console.log("/space/:spaceId => ", req.params.spaceId);
    let [data] = await pool.query("SELECT * FROM space WHERE space_id=? ", [
        req.params.spaceId,
    ]);
    res.json(data);
});
// 藝術家頁面
app.get("/artist", async (req, res, next) => {
    console.log("這裡是 /artist");
    let [data] = await pool.query(
        "SELECT * FROM users WHERE users_valid_role=1"
    );
    res.json(data);
});
app.get("/artist/:artistId", async (req, res, next) => {
    console.log("/artist/:artistId => ", req.params.artistId);
    let [data] = await pool.query(
        "SELECT * FROM users WHERE users_valid_role=1 AND users_id=? ",
        [req.params.artistId]
    );
    res.json(data);
});

app.use((req, res, next) => {
    console.log("出現404！");
    res.status(404).send("錯誤代號404，請輸入正確的網址");
    const cors = require("cors");
    app.use(cors());
});

app.listen(3001, () => {
    console.log("Server running at port 3001");
});
