import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnswerInput from './AnswerInput';
import { Answer, Question, BasicQuestion } from '../types';
import { saveUserReview } from '../services/reviewService';
import styles from './QuestionSection.module.css';
import { RefreshCw } from 'lucide-react';
import { fetchRandomQuestionByType } from '../services/questionService';

interface QuestionSectionProps {
  content: string;
  questionId: number;
  type: string;
  initialAnswers?: Answer[];
  onAnswersChange: (answers: Answer[]) => void;
  onNext: () => void;
  showNext: boolean;
  isLast: boolean;
  isRefresh: boolean;
  isSingleAnswer: boolean;
  allResponses: Question[];
  onQuestionRefresh: (questionId: number, newContent: string) => void;
}

export default function QuestionSection({
  content,
  questionId,
  type,
  onAnswersChange,
  onNext,
  showNext,
  isLast,
  isRefresh,
  isSingleAnswer,
  allResponses,
  onQuestionRefresh,
}: QuestionSectionProps) {
  console.log(isRefresh);
  
  const navigate = useNavigate();
  const initialAnswers = [{ id: '1', text: '' }];
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleComplete = async () => {
    if (canProceed && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // Convert allResponses to BasicQuestion type
        const basicQuestions: BasicQuestion[] = allResponses.map(rs => {
          return {
            id: rs.id,
            content: rs.content,
            answers: rs.answers,
            comments: []
          }
        })
        const reviewId = await saveUserReview(basicQuestions); // Save review
        navigate(`/result/${reviewId}`);
      } catch (error) {
        console.error('Error saving review:', error);
        // Handle error appropriately
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  

  const canProceed = answers.every((answer) => answer.text.trim() !== '');

  const handleRefreshQuestion = async () => {
    if (isRefresh) return;
    
    setIsLoading(true);
    try {
      const newQuestion = await fetchRandomQuestionByType(questionId, type);
      if (newQuestion) {
        onQuestionRefresh(questionId, newQuestion.content);
      }
    } catch (error) {
      console.error('Error refreshing question:', error);
      alert('새로운 질문을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.questionHeader}>
        <h2 className={styles.question}>{content}</h2>
        {isRefresh && (
          <button
            onClick={handleRefreshQuestion}
            disabled={isLoading}
            className={styles.refreshButton}
          >
            <RefreshCw 
              size={20} 
              className={isLoading ? styles.spinning : ''}
            />
          </button>
        )}
      </div>
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
            onClick={handleComplete}
            disabled={!canProceed || isSubmitting}
            className={styles.button}
          >
            {isSubmitting ? '저장 중...' : '완료'}
          </button>
        </div>
      )}
    </div>
  );
}