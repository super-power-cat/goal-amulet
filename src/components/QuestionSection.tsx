import React, { useState } from 'react';
import AnswerInput from './AnswerInput';
import { Answer } from '../types';
import s from './QuestionSection.module.css';

interface QuestionSectionProps {
  question: string;
  initialAnswers?: Answer[];
  onAnswersChange: (answers: Answer[]) => void;
  onNext: () => void;
  showNext: boolean;
}

export default function QuestionSection({
  question,
  initialAnswers = [{ id: '1', text: '' }],
  onAnswersChange,
  onNext,
  showNext,
}: QuestionSectionProps) {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  const handleAddAnswer = () => {
    const newAnswers = [...answers, { id: Date.now().toString(), text: '' }];
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const handleRemoveAnswer = (id: string) => {
    if (answers.length > 1) {
      const newAnswers = answers.filter(answer => answer.id !== id);
      setAnswers(newAnswers);
      onAnswersChange(newAnswers);
    }
  };

  const handleAnswerChange = (id: string, text: string) => {
    const newAnswers = answers.map(answer => 
      answer.id === id ? { ...answer, text } : answer
    );
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const canProceed = answers.every(answer => answer.text.trim() !== '');

  return (
    <div className={'bg-white rounded-lg shadow-sm p-6 mb-6'}>
      <p className={s.text}>1</p>
      <h2 className="text-xl font-bold text-gray-800 mb-4">{question}</h2>
      <AnswerInput
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onAddAnswer={handleAddAnswer}
        onRemoveAnswer={handleRemoveAnswer}
      />
      {showNext && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onNext}
            disabled={!answers.some(answer => answer.text.trim().length > 0)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              answers.some(answer => answer.text.trim().length > 0)
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}