import React from 'react';
import './ProductsDetail.css';
import 'bootstrap';
import { products01, demo} from './imports';
import { Link } from 'react-router-dom';
import Slider from "react-slick";


const settings = {
  dots: true,
  speed: 500,
  slidesToShow: 1,  // 一次顯示幾張
  slidesToScroll: 1, // 按下一頁的時候，要跑幾張
};

const ProductsDetail = () =>  {
  return (
    <>
<div>
       <div className="container-xxl">
    <section id="page">
        <nav>
          <div className="d-inline flex-column">
            <div className="d-inline">
                <h2 className="card-title fw-bold">海報, 放輕鬆</h2>
                <h4 className='card-text'>BILD</h4>
                <h4>荷蘭</h4>
            </div>   
              <div className="d-inline">
              媒介
              <hr/>
              <span>電繪</span>
              </div>
              <div className="d-inline">
              風格
              <span>印象派</span>
              </div>
              <div className="d-inline">
              年份
              <span>2022</span>
              </div>
              <div className="d-inline">
              尺寸(CM)
              <span>40X50</span>
              </div>
              <div className="d-inline">
              色系
              <span>#</span>
              </div>
              <button>加入購物車</button>
              </div>

        </nav>
        <main>
            <Slider className="box" {...settings}>
          <div >
            <img className="slider-pic" src={products01} />
          </div>
          <div >
            <img className="slider-pic" src={products01} />
          </div>
          <div >
            <img className="slider-pic" src={products01} />
          </div>
          <div >
            <img className="slider-pic" src={products01} />
          </div>
          <div >
            <img className="slider-pic" src={products01} />
          </div>
            </Slider>      
        </main>
        <footer>
        <p className="card-title">這是一隻綠色的可愛樹懶。其移動速度非常地慢，只有每分鐘4米（0.24km/h）的速度，在地面上是只有每分鐘2米（0.12km/h）的速度。如果不慎掉到地面，容易成為其他肉食性動物的獵物。</p>
        <div className="demo">
        <img src= {demo} alt=""/>
        </div>
        </footer>
        <main2>
          
       </main2>
    
    </section>
    </div>
   

</div>
</>
    );
};

export default ProductsDetail;