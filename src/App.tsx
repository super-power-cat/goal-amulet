
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Result from './components/Result';
import QuestionFlow from './components/QuestionFlow';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionFlow />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;