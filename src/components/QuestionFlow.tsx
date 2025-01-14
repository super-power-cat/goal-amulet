import { useState, useEffect } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import QuestionSection from './QuestionSection';
import { Question, Answer, NewQuestion } from '../types';
import styles from '../App.module.css';
import { useNavigate } from 'react-router-dom';

export default function QuestionFlow() {
  const navigate = useNavigate();
  const { questions: fetchedQuestions, loading, error } = useQuestions();
  const [responses, setResponses] = useState<NewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<NewQuestion[]>([]);
  const next_icon = ">>";

  useEffect(() => {
    if (fetchedQuestions) {
      setResponses(fetchedQuestions.map(q => ({
        ...q,
        answers: []
      })));
      setFilteredQuestions(fetchedQuestions);
    }
  }, [fetchedQuestions]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>✨</div>
          <p>목표를 정할 준비를 하고 있어요</p>
        </div>
      </div>
    );
  }
  if (error) return <div>{error} \n 에러가 발생했어요 instagram으로 알려주시면 빠르게 해결해드릴게요</div>;
  if (!responses.length) return <div>질문을 불러오는 중...</div>;

  const handleAnswersChange = (questionId: number, answers: Answer[]) => {
    setResponses(prev => prev.map(q =>
      q.id === questionId ? { ...q, answers } : q
    ));

    // YN 질문에 대한 답변 처리
    const currentQuestion = responses.find(q => q.id === questionId);
    if (currentQuestion?.type === 'YN') {
      const answer = answers[0]?.text;
      if (answer === 'YES') {
        // GOAL-1 타입의 질문만 보여주기
        const goal1Questions = fetchedQuestions.filter(q => 
          q.type === 'GOAL-1' || q.id <= questionId
        );
        setFilteredQuestions(goal1Questions);
      } else if (answer === 'NO') {
        // GOAL-1 타입을 제외한 나머지 질문 보여주기
        const nonGoal1Questions = fetchedQuestions.filter(q => 
          q.type !== 'GOAL-1' || q.id <= questionId
        );
        setFilteredQuestions(nonGoal1Questions);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
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
        <button onClick={() => navigate('/amulet')} className={styles.goToAmuletButton}>
        <span>바로 부적 만들러 가기 {next_icon}</span>
        {/* <ArrowRight size={20} /> */}
      </button>
        <div className={styles.questionList}>
          {filteredQuestions.slice(0, currentQuestionIndex + 1).map((question, index) => (
            <QuestionSection
              key={question.id}
              content={question.content}
              tip={question.tip}
              questionId={question.id}
              type={question.type}
              initialAnswers={responses.find((q) => q.id === question.id)?.answers}
              onAnswersChange={(answers) => handleAnswersChange(question.id, answers)}
              onNext={handleNextQuestion}
              showNext={index === currentQuestionIndex && currentQuestionIndex < filteredQuestions.length - 1}
              isLast={index === filteredQuestions.length - 1}
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