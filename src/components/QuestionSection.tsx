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
  
  const navigate = useNavigate();
  const initialAnswers = [{ id: '1', text: '' }];
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

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
        const basicQuestions: BasicQuestion[] = allResponses.map(rs => ({
          id: rs.id,
          content: rs.content,
          answers: rs.answers,
          comments: []
        }));
        const reviewId = await saveUserReview(basicQuestions);
        
        // 마지막 답변을 state로 전달하며 부적 페이지로 이동
        const lastAnswer = answers[0]?.text || '';
        navigate('/amulet', { state: { lastAnswer } });
      } catch (error) {
        console.error('Error saving review:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  

  const canProceed = answers.every((answer) => answer.text.trim() !== '');

  const handleRefreshQuestion = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setRefreshSuccess(false);
    try {
      window.gtag('event', 'refresh_random_question', {
        'event_category': 'Question Interaction',
        'event_label': `Question ${questionId} - Type ${type}`,
        'question_id': questionId,
        'question_content': content,
        'question_type': type
      });

      const newQuestion = await fetchRandomQuestionByType(questionId, type);
      if (newQuestion) {
        onQuestionRefresh(questionId, newQuestion.content);
        setRefreshSuccess(true);
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
          <div className={styles.refreshContainer}>
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
            {refreshSuccess && (
              <div className={styles.checkmark}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.answerInput}>
      <AnswerInput
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onAddAnswer={handleAddAnswer}
        onRemoveAnswer={handleRemoveAnswer}
        isSingleAnswer={isSingleAnswer}
      /></div>
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