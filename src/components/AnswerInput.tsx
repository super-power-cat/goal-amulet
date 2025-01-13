import { PlusCircle, X } from 'lucide-react';
import { Answer } from '../types';
import YesNoAnswer from '../components/YesNoAnswer';
import { useState } from 'react';

interface AnswerInputProps {
  answers: Answer[];
  onAnswerChange: (id: string, text: string, type: string) => void;
  onAddAnswer: () => void;
  onRemoveAnswer: (id: string) => void;
  limitAnswer: number;
  type?: string;
  onNext?: () => void;
}// Update based on your actual icons

const AnswerInputComponent = ({
  type,
  answers,
  onAnswerChange,
  onAddAnswer,
  onRemoveAnswer,
  limitAnswer,
  onNext,
}: {
  type: string;
  answers: { id: string; text: string }[];
  onAnswerChange: (id: string, value: string, type: string) => void;
  onAddAnswer: () => void;
  onRemoveAnswer: (id: string) => void;
  limitAnswer: number;
  onNext?: () => void;
}) => {
  const maxCharLimit = 33;

  const handleInputChange = (id: string, value: string) => {
    const totalLength = answers.reduce((acc, curr) => acc + (curr.id === id ? value.length : curr.text.length), 0);
  
    // 백스페이스 동작은 항상 허용
    const currentAnswer = answers.find((answer) => answer.id === id);
    if (totalLength <= maxCharLimit || value.length < (currentAnswer?.text.length ?? 0)) {
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
              selectedValue={answer.text}
              onAnswerChange={onAnswerChange}
              onNext={onNext || (() => {})}
            />
          ) : (
            <>
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleInputChange(answer.id, e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        {/* 글자수 제한 표시 */}
        <div className="text-gray-500 text-sm">
          {totalCharacters}/{maxCharLimit}
        </div>

        {/* 답변 추가 버튼 */}
        {answers.length < limitAnswer && totalCharacters < maxCharLimit && (
          <button
            type="button"
            onClick={onAddAnswer}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-2"
          >
            <PlusCircle size={20} />
            <span>답변 추가</span>
          </button>
        )}

        {/* 글자수 초과 메시지 */}
        {totalCharacters >= maxCharLimit && (
          <div className="text-red-500 text-sm">
            최대 33글자만 입력할 수 있습니다. 부적이 작아서 미안해요.
          </div>
        )}
      </>
    )}
    </div>
  );
};

export default AnswerInputComponent;
