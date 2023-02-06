import { CirclePicker } from 'react-color'
import  { useState } from 'react'
import React from 'react'

function ProductsColorSelector(){
const [color, setColor] = useState('#fff');
  const [visible, setVisible] = useState(false);

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

         </>
        )
    }
    
export default ProductsColorSelector;