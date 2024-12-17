import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Answer } from '../types';

interface QuestionFormProps {
  question: string;
  onSubmit: (answers: Answer[]) => void;
}

export default function QuestionForm({ question, onSubmit }: QuestionFormProps) {
  const [answers, setAnswers] = useState<Answer[]>([{ id: '1', text: '' }]);

  const handleAddAnswer = () => {
    setAnswers([...answers, { id: Date.now().toString(), text: '' }]);
  };

  const handleRemoveAnswer = (id: string) => {
    if (answers.length > 1) {
      setAnswers(answers.filter(answer => answer.id !== id));
    }
  };

  const handleAnswerChange = (id: string, text: string) => {
    setAnswers(answers.map(answer => 
      answer.id === id ? { ...answer, text } : answer
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some(answer => answer.text.trim() === '')) return;
    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{question}</h2>
      
      <div className="space-y-3">
        {answers.map((answer) => (
          <div key={answer.id} className="flex items-center gap-2">
            <input
              type="text"
              value={answer.text}
              onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="답변을 입력하세요..."
            />
            {answers.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveAnswer(answer.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={handleAddAnswer}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <PlusCircle size={20} />
          <span>답변 추가</span>
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다음
        </button>
      </div>
    </form>
  );
}