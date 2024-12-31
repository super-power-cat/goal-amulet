import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePageTracking } from './utils/analytics';
import QuestionFlow from './components/QuestionFlow';
import Result from './components/result/Result';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionFlow />} />
        <Route path="/result/:reviewId" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

function Analytics() {
  usePageTracking();
  return null;
}

export default App;