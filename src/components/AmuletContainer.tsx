import { ColorKey, getColorInfo } from '../types';
import styles from './AmuletContainer.module.css';
import { useState } from 'react';

interface AmuletContainerProps {
  selectedColor: ColorKey;
  text: string;
  onTextChange?: (text: string) => void;
}

export const AmuletContainer = ({ selectedColor, text, onTextChange }: AmuletContainerProps) => {
  const colorInfo = getColorInfo(selectedColor);
  const [showWarning, setShowWarning] = useState(false);


  // 이럴 경우 쭉 입력했을때 줄바꿈 되는 걸 방어 못함
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const text = textarea.value;
    if (text.length < (textarea.defaultValue || '').length) {
        onTextChange?.(text);
        setShowWarning(false);
        return;
      }
      
    // 실제 화면에 표시되는 줄 수 계산
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight)+2;
    const actualLines = Math.ceil(textarea.scrollHeight / lineHeight);
    
    if (actualLines > 3 || !onTextChange) {
      e.preventDefault();
      setShowWarning(true);
      
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return;
    }
    
    console.log(text);
    onTextChange(text);
    setShowWarning(false);
  };
  

  return (
    <div 
      id="amulet-container" 
      className={styles.amuletContainer} 
      style={{ backgroundColor: colorInfo.code }}
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
        className={`${styles.amuletText} ${text.length <= 16 ? styles.largeFont : styles.smallFont}`} 
        onChange={handleTextChange} 
        rows={3} 
        maxLength={100} 
        value={text}>
        </textarea>
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