import { ColorKey, getColorInfo } from '../types';
import styles from './AmuletContainer.module.css';

interface AmuletContainerProps {
  selectedColor: ColorKey;
  text: string;
  onTextChange?: (text: string) => void;
}

export const AmuletContainer = ({ selectedColor, text, onTextChange }: AmuletContainerProps) => {
  const colorInfo = getColorInfo(selectedColor);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onTextChange) {
      onTextChange(e.target.value);
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