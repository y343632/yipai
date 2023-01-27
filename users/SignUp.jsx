import React from "react";
import { Link } from "react-router-dom";
import "./signup.css";



const SignUp = () => (
    <div id='SignUp'>
        
        <div className='_SignUp_flex-ab _SignUp_flex-col'>
            <div className='_SignUp_box _SignUp_flex'>
                <div className='_SignUp_buyerIcon'></div>
                <Link to='/users/Register' className='_SignUp_h3'>
                    買家註冊
                </Link>
            </div>
            <div className='_SignUp_box2 _SignUp_flex'>
                <div className='_SignUp_sellerIcon'></div>
                <Link to='/users/SellRegister' className='_SignUp_h3'>
                    賣家註冊
                </Link>
            </div>
        </div>
        <div className='_SignUp_BG'></div>   

    </div>
);

export default SignUp;