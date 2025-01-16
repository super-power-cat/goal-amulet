import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePageTracking } from './utils/analytics';
import QuestionFlow from './components/QuestionFlow';
import Result from './components/result/Result';
import { AmuletPage } from './pages/AmuletPages';
import { AmuletRedirectPage } from './pages/AmuletRedirectPages';
import { NotFound } from './components/NotFound';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<QuestionFlow />} />
        <Route path="/result/:reviewId" element={<Result />} />
        <Route path="/amulet" element={<AmuletRedirectPage />} />
        <Route path="/amulet/:amuletId" element={<AmuletPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

// Analytics component to track page views
function Analytics() {
  usePageTracking();
  return null;
}

export default App;