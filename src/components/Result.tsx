import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserReview } from '../services/reviewService';
import { Question, Comment as CommentType } from '../types';
import { CommentList } from './CommentList';
import styles from './Result.module.css';

const Result = () => {
  const { reviewId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReview = async () => {
      if (!reviewId) return;
      
      try {
        const result = await getUserReview(reviewId);
        setQuestions(result.questions);
      } catch (err) {
        setError('회고를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, [reviewId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!questions.length) return <div>회고를 찾을 수 없습니다.</div>;

  const handleAddComment = (questionId: number, text: string, author: string) => {
    const newComment: CommentType = {
      id: Date.now().toString(),
      text,
      author,
      createdAt: new Date().toISOString()
    };

    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId
          ? {
              ...question,
              comments: [...(question.comments || []), newComment]
            }
          : question
      )
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>2024년 회고</h1>
      <div className={styles.responses}>
        {questions.map((question) => (
          <div key={question.id} className={styles.responseItem}>
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
              onAddComment={(text, author) => handleAddComment(question.id, text, author)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;