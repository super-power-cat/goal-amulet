import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useQuestions } from './hooks/useQuestions';
import QuestionSection from './components/QuestionSection';
import Result from './components/Result'; // Result 컴포넌트 가져오기
import { Question, Answer } from './types';

// const questions: Question[] = [
//   { id: 1, text: '이름이 뭐예요?', answers: [], isSingleAnswer: true, isRefresh: false },
//   { id: 2, text: '24년 회고를 해볼까요?', answers: [], isSingleAnswer: false, isRefresh: true },
//   { id: 3, text: '올해의 가장 큰 성과는 무엇인가요?', answers: [], isSingleAnswer: false, isRefresh: true },
//   { id: 4, text: '내년의 목표는 무엇인가요?', answers: [], isSingleAnswer: false, isRefresh: true },
//   { id: 5, text: '나에게 하고 싶은 말이 있다면?', answers: [], isSingleAnswer: false, isRefresh: true },
// ];

function QuestionFlow() {
  const { questions, loading, error } = useQuestions();
  const [responses, setResponses] = useState<Question[]>(questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswersChange = (questionId: number, answers: Answer[]) => {
    setResponses(prev => prev.map(q =>
      q.id === questionId ? { ...q, answers } : q
    ));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // const isComplete = responses.every(q => q.answers.length > 0 &&
  //   q.answers.every(a => a.text.trim() !== ''));
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          2024년 회고
        </h1>

        <div className="space-y-6">
          {questions.slice(0, currentQuestionIndex + 1).map((question, index) => (
            <QuestionSection
              key={question.id}
              question={question.content}
              initialAnswers={responses.find((q) => q.id === question.id)?.answers}
              onAnswersChange={(answers) => handleAnswersChange(question.id, answers)}
              onNext={handleNextQuestion}
              showNext={index === currentQuestionIndex && currentQuestionIndex < questions.length - 1}
              isLast={index === questions.length - 1}
              isSingleAnswer={question.isSingleAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

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