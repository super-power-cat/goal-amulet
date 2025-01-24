import React, { useState } from 'react';
import styles from './YesNoAnswer.module.css';

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
    if (selectedValue === value || isProcessing) return;
    onAnswerChange(answerId, value, type);
    setCurrentQuestionIndex(questionIndex + 1);
  };

  return (
    <div className={styles.buttonContainer}>
      <button
        type="button"
        onClick={() => handleSelection("YES", type)}
        disabled={isProcessing}
        className={`${styles.button} ${
          selectedValue === "YES" ? styles.selected : styles.unselected
        }`}
      >
        네, 정했어요
      </button>
      <button
        type="button"
        onClick={() => handleSelection("NO", type)}
        disabled={isProcessing}
        className={`${styles.button} ${
          selectedValue === "NO" ? styles.selected : styles.unselected
        }`}
      >
        아니요, 함께 정하고 싶어요
      </button>
    </div>
  );
} 