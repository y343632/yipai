<h1>前端</h1>

#product slider

    npm install @mui/material @emotion/react @emotion/styled

    npm install @mui/base

    npm install @mui/system @emotion/react @emotion/styled

    npm install @mui/material @mui/styled-engine-sc styled-components

用法請參考

https://mui.com/material-ui/react-slider/

https://github.com/mui/material-ui/tree/v5.11.4

<h1>後端</h1>

建立一個全新的後端資料夾，拉進 VSCode 中。

在 VSCode 中建立一個為 server.js 的檔案，做為伺服器用。

初始化專案
  
    npm init
  
完成初步的專案建立。

請先安裝以下套件

1.為了快速搭建一個網站，需要 express

    npm i express
  
2.為了讓不同 port 中的程式可以讀到跨 port 的內容(跨網域)，需要 cors

      npm i cors
  
  
3.為了讀取 mySQL，需要 mysql2

      npm i mysql2
  
  
4.想要讓 index.js 只要一修改，伺服器就自動 reload，需要中介軟體(middleware)，nodemon

      npm i nodemon
  
5.連接資料庫之前先建立好evn檔存放資料庫使用者帳密

    npm i dotenv
  
