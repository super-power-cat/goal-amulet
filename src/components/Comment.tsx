import React from 'react';
import { Comment as CommentType } from '../types';
import styles from './Comment.module.css';

interface CommentProps {
  comment: CommentType;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className={styles.comment}>
      <p className={styles.text}>{comment.text}</p>
      <div className={styles.footer}>
        <span className={styles.author}>{comment.author}</span>
        <span className={styles.date}>
          {comment.createdAt.toDate().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};