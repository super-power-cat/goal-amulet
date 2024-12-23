import { useState } from 'react';
import AnswerInput from './AnswerInput';
import { Answer } from '../types';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionSection.module.css';

interface QuestionSectionProps {
  question: string;
  initialAnswers?: Answer[];
  onAnswersChange: (answers: Answer[]) => void;
  onNext: () => void;
  showNext: boolean;
  isLast: boolean;
  isSingleAnswer: boolean;
}
export default function QuestionSection({
  question,
  onAnswersChange,
  onNext,
  showNext,
  isLast,
  isSingleAnswer,
}: QuestionSectionProps) {
  const navigate = useNavigate();
  const initialAnswers = [{ id: '1', text: '' }];
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  const handleAddAnswer = () => {
    const newAnswers = [...answers, { id: Date.now().toString(), text: '' }];
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const handleRemoveAnswer = (id: string) => {
    if (answers.length > 1) {
      const newAnswers = answers.filter((answer) => answer.id !== id);
      setAnswers(newAnswers);
      onAnswersChange(newAnswers);
    }
  };

  const handleAnswerChange = (id: string, text: string) => {
    const newAnswers = answers.map((answer) =>
      answer.id === id ? { ...answer, text } : answer
    );
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const canProceed = answers.every((answer) => answer.text.trim() !== '');

  return (
    <div className={styles.container}>
      <h2 className={styles.question}>{question}</h2>
      <AnswerInput
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onAddAnswer={handleAddAnswer}
        onRemoveAnswer={handleRemoveAnswer}
        isSingleAnswer={isSingleAnswer}
      />
      {showNext && (
        <div className={styles.buttonContainer}>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={styles.button}
          >
            다음
          </button>
        </div>
      )}
      {isLast && (
        <div className={styles.buttonContainer}>
          <button
            onClick={() => {
              if (canProceed) {
                navigate('/result', {
                  state: { responses: answers }
                });
              }
            }}
            disabled={!canProceed}
            className={styles.button}
          >
            완료
          </button>
        </div>
      )}
    </div>
  );
}
