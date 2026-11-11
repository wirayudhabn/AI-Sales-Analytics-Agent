// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IrisAI, Orders, Overview, Products } from './pages';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/iris-ai" element={<IrisAI />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
