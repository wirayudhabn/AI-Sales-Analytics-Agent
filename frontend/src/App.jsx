// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cashier, History, IrisAI, Login, Orders, Overview, Products } from './pages';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard */}
        <Route index element={<Overview />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/iris-ai" element={<IrisAI />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Cashier */}
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
