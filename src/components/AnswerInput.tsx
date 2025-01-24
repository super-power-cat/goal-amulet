import { PlusCircle, X } from 'lucide-react';
import { Answer } from '../types';
import YesNoAnswer from '../components/YesNoAnswer';
import { useState } from 'react';
import styles from './AnswerInput.module.css';

interface AnswerInputProps {
  answers: Answer[];
  onAnswerChange: (id: string, text: string, type: string) => void;
  onAddAnswer: () => void;
  onRemoveAnswer: (id: string) => void;
  limitAnswer: number;
  type?: string;
  onNext?: () => void;
  setCurrentQuestionIndex: (index: number) => void;
}// Update based on your actual icons

const AnswerInputComponent = ({
  questionIndex,
  type,
  answers,
  onAnswerChange,
  onAddAnswer,
  onRemoveAnswer,
  limitAnswer,
  onNext,
  setCurrentQuestionIndex,
}: {
  questionIndex: number;
  type: string;
  answers: { id: string; text: string }[];
  onAnswerChange: (id: string, value: string, type: string) => void;
  onAddAnswer: () => void;
  onRemoveAnswer: (id: string) => void;
  limitAnswer: number;
  onNext?: () => void;
  setCurrentQuestionIndex: (index: number) => void;
}) => {
  const maxCharLimit = 44;
  const isGoalType = type?.includes("GOAL");

  const handleInputChange = (id: string, value: string) => {
    const totalLength = answers.reduce((acc, curr) => acc + (curr.id === id ? value.length : curr.text.length), 0);
  
    // GOAL 타입일 때만 글자수 제한 적용
    if (!isGoalType || totalLength <= maxCharLimit || value.length < (answers.find(answer => answer.id === id)?.text.length ?? 0)) {
      onAnswerChange(id, value, type);
    }
  };
  

  const totalCharacters = answers.reduce((acc, curr) => acc + curr.text.length, 0);

  return (
    <div className="space-y-3">
      {answers.map((answer) => (
        <div key={answer.id} className="flex items-center gap-2">
          {type === "YN" ? (
            <YesNoAnswer
              answerId={answer.id}
              questionIndex={questionIndex}
              selectedValue={answer.text}
              onAnswerChange={onAnswerChange}
              onNext={onNext || (() => {})}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
          ) : (
            <>
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleInputChange(answer.id, e.target.value)}
                className={styles.answerInput}
                placeholder="답변을 입력하세요..."
              />
              {answers.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveAnswer(answer.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </>
          )}
        </div>
      ))}

    {!type?.includes("YN") && limitAnswer != 1 && (
      <>
        {/* GOAL 타입일 때만 글자수 제한 표시 */}
        {isGoalType && (
          <div className={styles.characterCount}>
            {totalCharacters}/{maxCharLimit}
          </div>
        )}

        {/* 답변 추가 버튼 */}
        {answers.length < limitAnswer && (!isGoalType || totalCharacters < maxCharLimit) && (
          <button
            type="button"
            onClick={onAddAnswer}
            className={styles.addAnswerButton}
          >
            <PlusCircle size={20} />
            <span>답변 추가</span>
          </button>
        )}

        {/* 글자수 초과 메시지 */}
        {isGoalType && totalCharacters >= maxCharLimit && (
          <div className={styles.errorMessage}>
            최대 {maxCharLimit}글자만 입력할 수 있습니다. 부적이 작아서 미안해요.
          </div>
        )}
      </>
    )}
    </div>
  );
};

export default AnswerInputComponent;
