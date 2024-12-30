import { Question, BasicQuestion } from '../../types';
import { ResponseItem } from './ResponseItem';
import styles from './Result.module.css';

interface ResponseListProps {
  questions: BasicQuestion[];
  reviewId: string;
  onQuestionsUpdate: (questions: BasicQuestion[]) => void;
}

export const ResponseList = ({ questions, reviewId, onQuestionsUpdate }: ResponseListProps) => (
  <div className={styles.responses}>
    {questions.map((question) => (
      <ResponseItem
        key={question.id}
        question={question}
        reviewId={reviewId}
        onQuestionUpdate={(updatedQuestion) => {
          onQuestionsUpdate(
            questions.map(q => 
              q.id === updatedQuestion.id ? updatedQuestion : q
            )
          );
        }}
      />
    ))}
  </div>
);