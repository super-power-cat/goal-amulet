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
    const lines = e.target.value.split('\n');
    
    if (lines.length > 3 || !onTextChange) {
      e.preventDefault();
      setShowWarning(true);
      // 3줄까지만 허용
      
      // 경고 메시지 3초 후 사라지게 설정
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return;
    } else {    
        const truncatedText = lines.slice(0, 3).join('\n');
        onTextChange(truncatedText);
        setShowWarning(false);
    }
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
      <textarea className={styles.amuletText} onChange={handleTextChange} 
                rows={3} maxLength={100} value={text}>
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