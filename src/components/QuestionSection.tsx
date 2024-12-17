import React, { useState } from 'react';
import AnswerInput from './AnswerInput';
import { Answer } from '../types';

interface QuestionSectionProps {
  question: string;
  initialAnswers?: Answer[];
  onAnswersChange: (answers: Answer[]) => void;
}

export default function QuestionSection({
  question,
  initialAnswers = [{ id: '1', text: '' }],
  onAnswersChange,
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{question}</h2>
      <AnswerInput
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onAddAnswer={handleAddAnswer}
        onRemoveAnswer={handleRemoveAnswer}
      />
    </div>
  );
}