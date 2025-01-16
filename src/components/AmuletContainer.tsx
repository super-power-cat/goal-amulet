import { ColorKey, getColorInfo } from '../types';
import styles from './AmuletContainer.module.css';
import { useState, useEffect, useRef } from 'react';

interface AmuletContainerProps {
  selectedColor: ColorKey;
  text: string;
  onTextChange?: (text: string) => void;
}

export const AmuletContainer = ({ selectedColor, text, onTextChange }: AmuletContainerProps) => {
  const colorInfo = getColorInfo(selectedColor);
  const [showWarning, setShowWarning] = useState(false);
  const [containerHeight, setContainerHeight] = useState(480);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CONTAINER_HEIGHT = 570;

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      
      const textHeight = textAreaRef.current.scrollHeight;
      const minHeight = 480;
      const additionalHeight = textHeight > 130 ? textHeight - 130 : 0;
      const newContainerHeight = minHeight + additionalHeight;
      
      if (newContainerHeight > MAX_CONTAINER_HEIGHT) {
        setShowWarning(true);
      } else {
        setContainerHeight(newContainerHeight);
        setShowWarning(false);
      }
    }
  };

  // 컴포넌트 마운트 시 높이 조절
  useEffect(() => {
    adjustHeight();
  }, []);

  // text 변경 시 높이 조절
  useEffect(() => {
    adjustHeight();
  }, [text]);

  // 윈도우 리사이즈 시 높이 재조절
  useEffect(() => {
    const handleResize = () => {
      adjustHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const newText = textarea.value;
    
    if (!onTextChange) return;

    const potentialHeight = 480 + (textarea.scrollHeight > 130 ? textarea.scrollHeight - 130 : 0);
    
    const isDeleting = newText.length < text.length;
    
    if (potentialHeight <= MAX_CONTAINER_HEIGHT || isDeleting) {
      adjustHeight();
      onTextChange(newText);
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div
      id="amulet-container"
      className={styles.amuletContainer}
      style={{ backgroundColor: colorInfo.code, height: `${containerHeight}px` }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={`/${colorInfo.file}`}
          alt="Amulet"
          className={styles.amuletImage}
        />
      </div>
      <div className={styles.amuletTitle}>
        {colorInfo.title}
      </div>
      <textarea
        ref={textAreaRef}
        className={`${styles.amuletText} ${text.length <= 16 ? styles.largeFont : styles.smallFont}`} 
        onChange={handleTextChange}
        rows={1}
        // maxLength={100}
        value={text}
      />
      {showWarning && (
        <div className={`${styles.warningMessage} ${styles.visible}`}>
          영차... 부적을 더 늘릴 수 없어요 ⚠️
        </div>
      )}
    </div>
  );
}; 