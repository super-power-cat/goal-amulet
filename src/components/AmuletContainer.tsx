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
  const [containerHeight, setContainerHeight] = useState(480); // 기본 높이
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
        // 텍스트 높이 자동 조절
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        
        // 컨테이너 높이 조절
        const textHeight = textAreaRef.current.scrollHeight;
        const minHeight = 480;
        const additionalHeight = textHeight > 130 ? textHeight - 130 : 0;
        setContainerHeight(minHeight + additionalHeight);
    }
}, [text]); // text가 변경될 때마다 실행

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const newText = textarea.value;
    
    if (!onTextChange) return;

    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
    
    onTextChange(newText);
    setShowWarning(false);
  };
  
  
  console.log(text);

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
                maxLength={100}
                value={text}
            />
        {showWarning && (
        <div className={`${styles.warningMessage} ${styles.visible}`}>
            최대 3줄까지만 입력할 수 있습니다 ⚠️
        </div>
        )}
    

      {/* <textarea 
        value={text}
        onChange={handleTextChange}
        className={styles.amuletText}
        rows={3}
        maxLength={100}
        // placeholder="이곳에 목표를 입력해주세요!"
        // className={styles.amuletText}
        style={{
          background: 'transparent',
          border: 'none',
          resize: 'none',
          outline: 'none',
          textAlign: 'center',
          width: '100%',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          color: 'inherit'
        }}
      /> */}
    </div>
  );
}; 