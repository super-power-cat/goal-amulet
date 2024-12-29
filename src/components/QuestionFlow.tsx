import { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import QuestionSection from '../components/QuestionSection';
import { Question, Answer } from '../types';
import styles from '../App.module.css';

function QuestionFlow() {
  const { questions, loading, error } = useQuestions();
  const [responses, setResponses] = useState<Question[]>(questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswersChange = (questionId: number, answers: Answer[]) => {
    setResponses(prev => prev.map(q =>
      q.id === questionId ? { ...q, answers } : q
    ));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          2024년 회고
        </h1>

        <div className={styles.questionList}>
          {questions.slice(0, currentQuestionIndex + 1).map((question, index) => (
            <QuestionSection
              key={question.id}
              question={question.content}
              initialAnswers={responses.find((q) => q.id === question.id)?.answers}
              onAnswersChange={(answers) => handleAnswersChange(question.id, answers)}
              onNext={handleNextQuestion}
              showNext={index === currentQuestionIndex && currentQuestionIndex < questions.length - 1}
              isLast={index === questions.length - 1}
              isSingleAnswer={question.isSingleAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionFlow;