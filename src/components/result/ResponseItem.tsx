import { Question, BasicQuestion } from '../../types';
import { CommentList } from '../CommentList';
import { saveComment } from '../../services/commentService';
import styles from './Result.module.css';

interface ResponseItemProps {
  question: BasicQuestion;
  reviewId: string;
  onQuestionUpdate: (question: BasicQuestion) => void;
}

export const ResponseItem = ({ question, reviewId, onQuestionUpdate }: ResponseItemProps) => {
  const handleAddComment = async (text: string, author: string) => {
    try {
      const newComment = await saveComment(reviewId, question.id, text, author);
      onQuestionUpdate({
        ...question,
        comments: [...(question.comments || []), newComment]
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 저장에 실패했습니다.');
    }
  };

  return (
    <div className={styles.responseItem}>
      <h3 className={styles.question}>{question.content}</h3>
      <ul className={styles.answerList}>
        {question.answers.map((answer) => (
          <li key={answer.id} className={styles.answer}>
            {answer.text}
          </li>
        ))}
      </ul>
      <CommentList
        comments={question.comments || []}
        onAddComment={handleAddComment}
      />
    </div>
  );
};