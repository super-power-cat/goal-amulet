import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuestionFlow from './components/QuestionFlow';
import Result from './components/Result';

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

export default App;