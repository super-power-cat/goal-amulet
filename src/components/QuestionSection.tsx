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
  tip: string;
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
  tip,
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

  // 안되잖아~~!
  const handleAnswerChange = (id: string, text: string) => {
    const currentAnswer = answers.find(answer => answer.id === id);
    const isChangingChoice = currentAnswer?.text && currentAnswer.text !== text;

    const newAnswers = answers.map((answer) =>
      answer.id === id ? { ...answer, text } : answer
    );
    
    // YN 타입에서 다른 선택지를 골랐을 경우
    if (type === "YN" && isChangingChoice) {
      // 현재 질문의 답변만 업데이트하고 다음 질문으로 넘어가기 전에 이후 질문들 초기화
      setAnswers(newAnswers);
      onAnswersChange(newAnswers);
      
      // 이후 질문들 초기화
      allResponses.forEach((response, index) => {
        if (index > questionId) {
          onQuestionRefresh(response.id, '');
        }
      });

      // 초기화 후 다음 질문으로 이동
      setTimeout(() => {
        onNext();
      }, 0);
      return;
    }

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
      <div className={styles.tip}>
        {tip}
      </div>
      <div className={styles.answerInput}>
        <AnswerInput
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onAddAnswer={handleAddAnswer}
          onRemoveAnswer={handleRemoveAnswer}
          limitAnswer={limitAnswer}
          type={type}
          onNext={onNext}
        />
      </div>
      {showNext && type !== "YN" && (
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