import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnswerInput from './AnswerInput';
import { Answer, Question, BasicQuestion, NewQuestion } from '../types';
import { saveUserReview } from '../services/reviewService';
import styles from './QuestionSection.module.css';
import { RefreshCw } from 'lucide-react';
import { fetchRandomQuestionByType } from '../services/questionService';
import { saveAmulet } from '../services/amuletService';

interface QuestionSectionProps {
  content: string;
  questionId: number;
  type: string;
  initialAnswers?: Answer[];
  onAnswersChange: (answers: Answer[]) => void;
  onNext: () => void;
  showNext: boolean;
  isLast: boolean;
  limitAnswer: number;
  allResponses: NewQuestion[];
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
  limitAnswer,
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
        const basicQuestions = allResponses.map(rs => ({
          id: rs.id,
          content: rs.content,
          answers: rs.answers,
          comments: []
        }));
        
        const reviewId = await saveUserReview(basicQuestions);
        console.log(answers);
        
        // 마지막 답변으로 부적 생성
        const lastAnswer = answers[0]?.text || '여기를 클릭해 목표를 입력해주세요';
        const amuletId = await saveAmulet('POWER', lastAnswer);
        
        navigate(`/amulet/${amuletId}`);
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
      </div>
      <div className={styles.answerInput}>
      <AnswerInput
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onAddAnswer={handleAddAnswer}
        onRemoveAnswer={handleRemoveAnswer}
        limitAnswer={limitAnswer}
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