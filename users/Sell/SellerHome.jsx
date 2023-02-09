import "./sellerhome.css";
import { Link } from "react-router-dom";
import logo1 from '../../../logo1.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import SellerButton from './SellerButton'
import axios from "axios";
import React, { useState,useEffect } from 'react'


import {
    SellerFrontPage,
    SellerPage,
    SellerUpload,
    SellerProduct,
    SellerOrder,
} from "./SellerOnclick";


// icon
import buyerImg from "../image/buyHead.png";
import sellerHouseIcon from "../image/sellerHouseIcon.svg";
import sellerpageIcon from "../image/sellerpageIcon.svg";
import sellerupIcon from "../image/sellerupIcon.svg";
import sellerlistIcon from "../image/sellerlistIcon.svg";
import sellerorderIcon from "../image/sellerorderIcon.svg";



function SellerHome() {
  let [UserData, setUserData] = useState(); //記錄數值
  let [UserOldDatas, setUserOldDatas] = useState(); //原本的數據
  let [UserOrders,setUserOrders] = useState(); //記錄使用者訂單
  // 只執行一次
  useEffect(() => {
      async function getMember2() {
          
          let response2 = await axios.get(
              `http://localhost:3001/api/members/artistData`,
              {
                  withCredentials: true,
              }
          );
          setUserData(response2.data[0].users_id);
          console.log(response2.data[0]); 
          setUserOldDatas(response2.data[0]);
          let responseOrder = await axios.get(
              `http://localhost:3001/api/members/orders`,
              {
                  withCredentials: true,
              }
          );
          setUserOrders(responseOrder.data[0]);
      }
      getMember2();
  }, []);




  //  記錄輸入的數值
  const [UserInputData, setUserInputData] = useState({
      username: "",
      account: "",
      // email: "",
      phone: "",
  });
  const [UserIntroduce, setUserIntroduce] = useState({
      users_introduce:''
  });
  // 每次輸入後更新使用者資料
  useEffect(() => {
      console.log(UserInputData);
  }, [UserInputData]);
  const handleChange = (event) => {
      setUserInputData({
          ...UserInputData,
          [event.target.name]: event.target.value,
      });
  };
  // 每次輸入後更畫廊資料
  useEffect(() => {
      console.log(UserIntroduce);
  }, [UserIntroduce]);
  const handleChange2 = (event) => {
      setUserIntroduce({
          ...UserIntroduce,
          [event.target.name]: event.target.value,
      });
  };
  // 送出輸入資料
  const handleSubmit = (event) => {
      event.preventDefault();
      axios
          .put(`http://localhost:3001/api/members`, {
              username: UserInputData.username,
              account: UserInputData.account,
              // email: UserInputData.email,
              phone: UserInputData.phone,
              usersId: UserData,
          })
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
  };
  console.log(UserOldDatas);
  console.log(UserOrders);


  return (
    <>
      <div className="d-flex">
        <div className="sellerhome__main" id="sellerhome__main">
          {/* <div className="sellerhome__main__section__news">
            <h2>最新消息</h2>
            <p>這是第一則重要消息！！看的到代表一切正常不用擔心，看不到代表要去客服反應！</p>
          </div>
          <div className="sellerhome__main__section__todolist">
            <h2>待辦事項</h2>
            <div>
              <ul className="list-unstyled">
                <li>
                  <Link><h1>0</h1></Link>
                  <h3>未出貨</h3>
                </li>
                <li>
                  <Link><h1>0</h1></Link>
                  <h3>待處理</h3>
                </li>
                <li>
                  <Link><h1>0</h1></Link>
                  <h3>已處理</h3>
                </li>
                <li>
                  <Link><h1>0</h1></Link>
                  <h3>待取消</h3>
                </li>
                <li>
                  <Link><h1>0</h1></Link>
                  <h3>待退貨</h3>
                </li>
                <li>
                  <Link><h1>0</h1></Link>
                  <h3>已售完</h3>
                </li>
              </ul>
            </div>
          </div>
          <div></div> */}
        </div>
        <div className="_sellerhome__pic_414 m-3">
              <img src={buyerImg} alt="sellerHead" className="_sellerhome_headImg" />
              <label className='sellerhome__headIcon_414'>
                {/* 增加檔案 */}
              <input type="file" style={{ display: "none" }}></input>
              </label>
        </div>
        <div className="sellerhome__sidebar">
          <div className="sellerhome__sidebar__center">
            <Link to="/">
              <img className="sellerhome__sidebar__center_logo" src={logo1} />
            </Link>
            <div className="_sellerhome__pic_1920 m-3">
              <img src={buyerImg} alt="sellerHead" className="_sellerhome_headImg" />
              <label className='sellerhome__headIcon'>
                {/* 增加檔案 */}
              <input type="file" style={{ display: "none" }}></input>
              </label>
            </div>
            <div>
            <ul className="list-unstyled sellerhome__icon">
              <li className="d-flex">
              
                <SellerButton
                  className="sellerhome__icon_botton"
                  src={sellerHouseIcon}
                  onClick={SellerFrontPage}
                />
               <p className="sellerhome__icon_text" >首頁</p>
              </li>
              <li className="d-flex">
                <SellerButton 
                  className="sellerhome__icon_botton"
                  src={sellerpageIcon}
                  onClick={SellerPage}
                />
                <p className="sellerhome__icon_text">個人頁面</p>
              </li>
              <li className="d-flex">
                <SellerButton
                  className="sellerhome__icon_botton"
                  src={sellerupIcon}
                  onClick={SellerUpload}
                />
                <p className="sellerhome__icon_text">上架商品</p>
              </li>
              <li className="d-flex">
                <SellerButton 
                  className="sellerhome__icon_botton"
                  src={sellerlistIcon}
                  onClick={SellerProduct}
                />
              <p className="sellerhome__icon_text">商品管理</p>  
              </li>
              <li className="d-flex">
                <SellerButton
                  className="sellerhome__icon_botton"
                  src={sellerorderIcon}
                  onClick={SellerOrder}
                />
                <p className="sellerhome__icon_text">訂單資訊</p>
              </li>
            </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SellerHome;