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

      <div className={styles.commentList}>
        {isAdding && (
          <div className={`${styles.comment} ${styles.newComment}`}>
            <form onSubmit={handleSubmit} className={styles.commentForm}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="메모를 남겨보세요..."
                className={styles.commentInput}
              />
              <div className={styles.commentFooter}>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="닉네임"
                  className={styles.authorInput}
                />
                <div className={styles.buttonGroup}>
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
                    저장
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};