import { ColorKey, getColorInfo } from '../types';
import styles from './AmuletContainer.module.css';

interface AmuletContainerProps {
  selectedColor: ColorKey;
  text: string;
}

export const AmuletContainer = ({ selectedColor, text }: AmuletContainerProps) => {
  const colorInfo = getColorInfo(selectedColor);

  return (
    <div 
      id="amulet-container" 
      className={styles.amuletContainer} 
      style={{ backgroundColor: colorInfo.code }}
    >
      {/* 이미지를 감싸는 wrapper div로 크기 제어 */}
      
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
      <div className={styles.amuletText}>
        {text}
      </div>
    </div>
  );
}; 