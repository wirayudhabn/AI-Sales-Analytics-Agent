import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Overview } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;