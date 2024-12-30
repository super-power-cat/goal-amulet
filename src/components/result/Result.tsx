import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserReview } from '../../services/reviewService';
import { getComments } from '../../services/commentService';
import { BasicQuestion, Question } from '../../types';
import { ResultHeader } from './ResultHeader';
import { ResponseList } from './ResponseResult';
import styles from './Result.module.css';

const Result = () => {
  const { reviewId } = useParams();
  const [questions, setQuestions] = useState<BasicQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReview = async () => {
      if (!reviewId) return;
      
      try {
        const [result, comments] = await Promise.all([
          getUserReview(reviewId),
          getComments(reviewId)
        ]);

        // 각 질문에 해당하는 댓글을 매핑
        const questionsWithComments: BasicQuestion[] = result.questions.map(question => ({
          ...question,
          comments: comments.filter(comment => comment.questionId === question.id)
        }));

        setQuestions(questionsWithComments);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, [reviewId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!questions.length) return <div>회고를 찾을 수 없습니다.</div>;

  const shareUrl = window.location.href;
  const shareTitle = '2024년 회고';

  return (
    <div className={styles.container}>
      <ResultHeader title={shareTitle} url={shareUrl} />
      <ResponseList 
        questions={questions} 
        reviewId={reviewId || ''} 
        onQuestionsUpdate={setQuestions} 
      />
    </div>
  );
};

export default Result;