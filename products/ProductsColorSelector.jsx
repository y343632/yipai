import { CirclePicker } from 'react-color'
import { useState, useEffect } from 'react'
import axios from 'axios'


function ProductsColorSelector  ()  {
const [product, setProducts] = useState([])
 //product初始值
 const [originalProduct, setOriginalProducts] = useState([])

const [color, setColor] = useState('#fff');
const [visible, setVisible] = useState(false);

const [selectedWork_hue, setSelectedWork_hue] = useState('')

//清除鍵
const handleClear = () => {
    //清空顏色
    setSelectedWork_hue([])
}

useEffect(() => {
    console.log('空陣列的 useEffect');
  }, []);

useEffect(() => {
    // console.log('第二個參數是空陣列');
    // 在 component 初始化的時候跑一次
    // 通常會把去跟後端要資料的動作放在這裡
    async function getProducts() {
      let response = await axios.get(`http://localhost:3001/product`);
      setProducts(response.data);
      console.log(response.data);
      setOriginalProducts(response.data);
    }
    getProducts();
  }, []);  


  const handleClick = (value, type) => {
    //先設定一個filter(符合條件的新陣列)值
    let filtered =[...originalProduct]

    if (type === 'work_hue') {
      // 處理顏色選項
      const work_hue = value  
      //顏色的陣列(重複不出現)
      let newSelectedWork_hue = [...selectedWork_hue]  

      if (newSelectedWork_hue.includes(work_hue)) {
        newSelectedWork_hue = selectedWork_hue.filter ((d) => d !== work_hue)
        setSelectedWork_hue(selectedWork_hue.filter((d) => d !== work_hue))
      } else {
        newSelectedWork_hue = [...selectedWork_hue, work_hue]
        setSelectedWork_hue([...selectedWork_hue, work_hue])
      }
      //filtered=filtered.filter((product)=>product.work_hue===work_hue)

      const newFiltered = filtered.filter((prodcut, i) => {
        let found = false
        for (let i = 0; i < newSelectedWork_hue.length; i++) {
          if (prodcut.work_hue.includes(newSelectedWork_hue[i])) {
            found = true
            break
          }
        }
        return found
      })
      setProducts(newFiltered)

      console.log(filtered.length, newSelectedWork_hue, newFiltered.length)
      console.log('顏色選項：', newSelectedWork_hue)
    }
  }


return (
<>
           <div style={{ position: 'relative', display: 'inline-block', margin: 60 }}>
             <div
               color={color}
               onClick={() => setVisible(!visible)}
               style={{
                 width: 20,
                 height: 20,
                 border: '1px solid #ccc',
                 backgroundColor: color
                }}
               />
              <CirclePicker
               style={{ position: 'absolute' }}
               color={color}
               visible={visible}
               onChange={({ color }) => setColor(color)}
               />
            </div>

            <td>
                    {selectedWork_hue}
                    {['Red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'white' , 'gray'].map(
                    (work_hue) => (
                      <ProductsColorSelector
                          className="Products＿slider-color-item Products＿slider-color-item-red"
                          value={'Red'}
                          onClick={() => handleClick(work_hue, 'work_hue') }
                      />
                    ))}
                    
                    </td>
         </>
        )
    }

export default ProductsColorSelector;