import { useState, useEffect } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import QuestionSection from './QuestionSection';
import { Question, Answer } from '../types';
import styles from '../App.module.css';

export default function QuestionFlow() {
  const { questions: fetchedQuestions, loading, error } = useQuestions();
  const [responses, setResponses] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (fetchedQuestions) {
      setResponses(fetchedQuestions.map(q => ({
        ...q,
        answers: []
      })));
    }
  }, [fetchedQuestions]);


  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!responses.length) return <div>질문을 불러오는 중...</div>;

  const handleAnswersChange = (questionId: number, answers: Answer[]) => {
    setResponses(prev => prev.map(q =>
      q.id === questionId ? { ...q, answers } : q
    ));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < responses.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleQuestionRefresh = (questionId: number, newContent: string) => {
    setResponses(prev => prev.map(q =>
      q.id === questionId ? { ...q, content: newContent, answers: [] } : q
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          한 해 돌아보기
        </h1>
        <p className={styles.description}>
          오늘 함께 <b>한 해를 돌아보는 시간</b>을 가져요. 편안하게 회고하기 위해 반말로 진행합니다.
          <br/><b>6개의 질문</b>들을 답하면 당신만의 페이지가 완성될 거예요. 공유하여 24년을 함께 돌아봐요.
        </p>
        <div className={styles.questionList}>
          {responses.slice(0, currentQuestionIndex + 1).map((question, index) => (
            <QuestionSection
              key={question.id}
              content={question.content}
              questionId={question.id}
              type={question.type}
              isRefresh={question.isRefresh}
              initialAnswers={responses.find((q) => q.id === question.id)?.answers}
              onAnswersChange={(answers) => handleAnswersChange(question.id, answers)}
              onNext={handleNextQuestion}
              showNext={index === currentQuestionIndex && currentQuestionIndex < responses.length - 1}
              isLast={index === responses.length - 1}
              isSingleAnswer={question.isSingleAnswer}
              allResponses={responses}
              onQuestionRefresh={handleQuestionRefresh}
            />
          ))}
        </div>
      </div>
    </div>
  );
}