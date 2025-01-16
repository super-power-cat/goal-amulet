import { ColorKey, getColorInfo } from '../types';
import styles from './AmuletContainer.module.css';
import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface AmuletContainerProps {
  selectedColor: ColorKey;
  text: string;
  onTextChange?: (text: string) => void;
  isEditable?: boolean;
}

export const AmuletContainer = ({ selectedColor, text, onTextChange, isEditable = true }: AmuletContainerProps) => {
  const colorInfo = getColorInfo(selectedColor);
  const [showWarning, setShowWarning] = useState(false);
  const [containerHeight, setContainerHeight] = useState(480);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CONTAINER_HEIGHT = 570;
  const [showTooltip, setShowTooltip] = useState(false);

  const adjustHeight = () => {
    if (textAreaRef.current) {
      requestAnimationFrame(() => {
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
      });
    }
  };

  // 컴포넌트 마운트 시 높이 조절 - setTimeout 추가
  useEffect(() => {
    const timer = setTimeout(() => {
      adjustHeight();
    }, 100);

    return () => clearTimeout(timer);
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
      {isEditable && (
        <div className={styles.tooltipContainer}>
          <Info
            className={styles.tooltipIcon}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
          />
          <div className={`${styles.tooltip} ${showTooltip ? styles.tooltipVisible : ''}`}>
            해당 페이지를 나갈 시 부적을 수정할 수 없으니 주의해주세요.
          </div>
        </div>
      )}
      
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
        value={text}
        readOnly={!isEditable}
      />
      {showWarning && (
        <div className={`${styles.warningMessage} ${styles.visible}`}>
          영차... 부적을 더 늘릴 수 없어요 ⚠️
        </div>
      )}
    </div>
  );
}; 