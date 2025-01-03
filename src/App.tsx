import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePageTracking } from './utils/analytics';
import QuestionFlow from './components/QuestionFlow';
import { AmuletPage } from './pages/AmuletPages';

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<QuestionFlow />} />
        <Route path="/amulet" element={<AmuletPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// Analytics component to track page views
function Analytics() {
  usePageTracking();
  return null;
}

export default App;