import React, { useState } from 'react';

interface YesNoAnswerProps {
  answerId: string;
  selectedValue: string;
  onAnswerChange: (id: string, text: string, type: string) => void;
  onNext: () => void;
  questionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
}

export default function YesNoAnswer({ answerId, selectedValue, onAnswerChange, onNext, questionIndex, setCurrentQuestionIndex }: YesNoAnswerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const type = "YN";

  const handleSelection = (value: string, type: string) => {
    // 이미 선택된 값이거나 처리 중일 때는 무시
    if (selectedValue === value || isProcessing) return;
    
    // setIsProcessing(true);
    onAnswerChange(answerId, value, type);
    setCurrentQuestionIndex(questionIndex + 1);
    
    // 다음 질문으로 전환 후 처리 상태 초기화
    // setIsProcessing(false)
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => handleSelection("YES", type)}
        disabled={isProcessing}
        className={`px-4 py-2 rounded-lg ${
          selectedValue === "YES" 
            ? "bg-blue-500 text-white" 
            : "bg-gray-200 text-gray-700"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        네, 정했어요
      </button>
      <button
        type="button"
        onClick={() => handleSelection("NO", type)}
        disabled={isProcessing}
        className={`px-4 py-2 rounded-lg ${
          selectedValue === "NO" 
            ? "bg-blue-500 text-white" 
            : "bg-gray-200 text-gray-700"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        함께 정하고 싶어요
      </button>
    </div>
  );
} 