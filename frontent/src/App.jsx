import React from 'react'
import AllProduct from './Components/AllProductApi\'s/AllProduct'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Useridproduct from './Components/AllProductApi\'s/useridproduct'
import AddtoCart from './Components/AllProductApi\'s/AddtoCart'
import Userlogin from './Components/User_Registection/Userlogin'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Userlogin/>} />
          <Route path='/product' element={<AllProduct/>} />
          <Route path='/product/:id' element={<Useridproduct/>} />
          <Route path="/cart/:id" element={<AddtoCart />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App