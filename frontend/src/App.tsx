import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import { IrisAI, Orders, Overview, Products } from './pages';

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/iris-ai" element={<IrisAI />} />
        <Route
          path="/sign-out"
          element={<main className="px-7 py-5">Sign out belum tersedia.</main>}
        />
      </Route>
    </Routes>
  );
}

export default App;