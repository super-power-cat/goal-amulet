import React from "react";
import { useLocation } from 'react-router-dom';
import styles from './Result.module.css';

interface Answer {
  text: string;
}

interface Response {
  id: string | number;
  text: string;
  answers: Answer[];
}

const Result = () => {
  const location = useLocation();
  const responses = location.state?.responses || [];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>회고 완료!</h3>
      <div className={styles.responseList}>
        {responses.map((answer: Response, idx: number) => (
          <div key={idx} className={styles.responseItem}>
            <ul className={styles.answerList}>
              <li className={styles.answerItem}>• {answer.text}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;
