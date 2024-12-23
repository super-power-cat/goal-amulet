import React, { useState } from 'react';
import { ReflectionResponse, Comment as CommentType } from '../types';
import { CommentList } from './CommentList';
import styles from './Result.module.css';

// 더미 데이터
const dummyResponses: ReflectionResponse[] = [
  {
    questionId: 1,
    questionText: '이름이 뭐예요?',
    answers: [{ id: '1', text: '김개발' }],
    comments: []
  },
  {
    questionId: 2,
    questionText: '24년 회고를 해볼까요?',
    answers: [
      { id: '1', text: '올해는 정말 많은 것을 배웠어요' },
      { id: '2', text: '새로운 도전을 많이 했던 해였습니다' }
    ],
    comments: []
  },
  {
    questionId: 3,
    questionText: '올해의 가장 큰 성과는 무엇인가요?',
    answers: [
      { id: '1', text: '첫 프로젝트 출시' },
      { id: '2', text: '새로운 기술 스택 습득' }
    ],
    comments: []
  },
  {
    questionId: 4,
    questionText: '내년의 목표는 무엇인가요?',
    answers: [
      { id: '1', text: '오픈소스 프로젝트 기여하기' },
      { id: '2', text: '새로운 언어 배우기' }
    ],
    comments: []
  },
  {
    questionId: 5,
    questionText: '나에게 하고 싶은 말이 있다면?',
    answers: [
      { id: '1', text: '잘하고 있어!' },
      { id: '2', text: '내년에도 화이팅!' }
    ],
    comments: []
  }
];

const Result: React.FC = () => {
  const [responses, setResponses] = useState<ReflectionResponse[]>(dummyResponses);

  const handleAddComment = (questionId: number, text: string, author: string) => {
    const newComment: CommentType = {
      id: Date.now().toString(),
      text,
      author,
      createdAt: new Date().toISOString()
    };

    setResponses(prev =>
      prev.map(response =>
        response.questionId === questionId
          ? {
              ...response,
              comments: [...response.comments, newComment]
            }
          : response
      )
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>2024년 회고</h1>
      <div className={styles.responses}>
        {responses.map((response) => (
          <div key={response.questionId} className={styles.responseItem}>
            <h3 className={styles.question}>{response.questionText}</h3>
            <ul className={styles.answerList}>
              {response.answers.map((answer) => (
                <li key={answer.id} className={styles.answer}>
                  {answer.text}
                </li>
              ))}
            </ul>
            <CommentList
              comments={response.comments}
              onAddComment={(text, author) => handleAddComment(response.questionId, text, author)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;