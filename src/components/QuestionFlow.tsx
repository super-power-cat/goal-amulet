import { useState, useEffect } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import QuestionSection from './QuestionSection';
import { Question, Answer, NewQuestion } from '../types';
import styles from '../App.module.css';

export default function QuestionFlow() {
  const { questions: fetchedQuestions, loading, error } = useQuestions();
  const [responses, setResponses] = useState<NewQuestion[]>([]);
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
    console.log('1');
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
          ✨ 올해 목표 정하기 ✨
        </h1>
        <p className={styles.description}>
          차근차근 올해 목표를 정해봐요. 만약 이미 정했다면 부적 만들기로 바로 넘어가도 좋아요.
        </p>
        <div className={styles.questionList}>
          {responses.slice(0, currentQuestionIndex + 1).map((question, index) => (
            <QuestionSection
              key={question.id}
              content={question.content}
              questionId={question.id}
              type={question.type}
              initialAnswers={responses.find((q) => q.id === question.id)?.answers}
              onAnswersChange={(answers) => handleAnswersChange(question.id, answers)}
              onNext={handleNextQuestion}
              showNext={index === currentQuestionIndex && currentQuestionIndex < responses.length - 1}
              isLast={index === responses.length - 1}
              limitAnswer={question.limitAnswer}
              allResponses={responses}
              onQuestionRefresh={handleQuestionRefresh}
            />
          ))}
        </div>
      </div>
    </div>
  );
}