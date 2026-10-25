import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import { Overview, Products, IrisAI } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/products" element={<Products />} />
        <Route element={<DashboardLayout />}>
          <Route path="/iris-ai" element={<IrisAI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;