import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Comment as CommentType } from '../types';
import { Comment } from './Comment';
import styles from './CommentList.module.css';

interface CommentListProps {
  comments: CommentType[];
  onAddComment: (text: string, author: string) => void;
}

export const CommentList: React.FC<CommentListProps> = ({ comments, onAddComment }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && author.trim()) {
      onAddComment(newComment, author);
      setNewComment('');
      setAuthor('');
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>댓글 {comments.length}</h4>
        {!isAdding && comments.length < 5 && (
          <button
            onClick={() => setIsAdding(true)}
            className={styles.addButton}
          >
            <PlusCircle size={20} />
            <span>댓글 추가</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="닉네임을 입력하세요..."
            className={styles.input}
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className={styles.textarea}
          />
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!newComment.trim() || !author.trim()}
              className={styles.submitButton}
            >
              등록
            </button>
          </div>
        </form>
      )}

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};