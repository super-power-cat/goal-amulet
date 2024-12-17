import React, { useState } from 'react';
import QuestionSection from './components/QuestionSection';
import { Question, Answer } from './types';

const questions: Question[] = [
  { id: 1, text: '이름이 뭐예요?', answers: [] },
  { id: 2, text: '24년 회고를 해볼까요?', answers: [] },
  { id: 3, text: '올해의 가장 큰 성과는 무엇인가요?', answers: [] },
  { id: 4, text: '내년의 목표는 무엇인가요?', answers: [] },
  { id: 5, text: '나에게 하고 싶은 말이 있다면?', answers: [] },
];

function App() {
  const [responses, setResponses] = useState<Question[]>(questions);

  const handleAnswersChange = (questionId: number, answers: Answer[]) => {
    setResponses(prev => prev.map(q => 
      q.id === questionId ? { ...q, answers } : q
    ));
  };

  const isComplete = responses.every(q => q.answers.length > 0 && 
    q.answers.every(a => a.text.trim() !== ''));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          2024년 회고
        </h1>
        
        <div className="space-y-6">
          {questions.map((question) => (
            <QuestionSection
              key={question.id}
              question={question.text}
              initialAnswers={responses.find(q => q.id === question.id)?.answers}
              onAnswersChange={(answers) => handleAnswersChange(question.id, answers)}
            />
          ))}
        </div>

        {isComplete && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">회고 완료!</h3>
            <div className="space-y-6">
              {responses.map((q) => (
                <div key={q.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <p className="font-medium text-gray-700 mb-2">{q.text}</p>
                  <ul className="ml-4 space-y-1">
                    {q.answers.map((answer, idx) => (
                      <li key={idx} className="text-gray-600">• {answer.text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;