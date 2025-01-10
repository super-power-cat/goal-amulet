import { useState } from 'react';
import { Download, Share2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { shareToKakao, shareToTwitter } from '../utils/shareUtils';
import { createAmuletImage } from '../utils/imageUtils';
import { ColorKey, getColorInfo } from '../types';
import styles from './Amulet.module.css';
import { ColorPickerButton } from './ColorPickerButton';

interface AmuletProps {
  initialText: string;
}

export const Amulet = ({ initialText }: AmuletProps) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<ColorKey>('YELLOW');
  const [text, setText] = useState(initialText);
  
  const colorInfo = getColorInfo(selectedColor);

  const handleDownload = async (isWallpaper: boolean = false) => {
    try {
      const imageUrl = await createAmuletImage(selectedColor, `/${colorInfo.file}`, text, isWallpaper);
      
      const link = document.createElement('a');
      link.download = isWallpaper ? 'amulet-wallpaper.png' : 'amulet.png';
      link.href = imageUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading amulet:', error);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const title = '나만의 부적';
    navigator.clipboard.writeText(url);
    alert('링크가 복사되었습니다!');
  };

  return (
    <div className={styles.container}>
      

      <div className={styles.colorPicker}>
      <ColorPickerButton
          color="YELLOW" // 파워 부적
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
        <ColorPickerButton
          color="GREEN" // 행운 부적
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
        <ColorPickerButton
          color="RED" // 열정 부적
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      </div>

      <div 
        id="amulet-container" 
        className={styles.amuletContainer} 
        style={{ backgroundColor: colorInfo.code }}
      >
        <img src={`/${colorInfo.file}`} alt="Amulet" className={styles.amuletImage} />
        <div className={styles.amuletTitle}>
          {colorInfo.title}
        </div>
        <div className={styles.amuletText}>
          {text}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button onClick={() => handleDownload(false)} className={styles.downloadButton}>
          <Download size={20} />
          <span>부적 저장하기</span>
        </button>
        <button onClick={() => handleDownload(true)} className={styles.downloadButton}>
          <Download size={20} />
          <span>배경화면용 저장하기</span>
        </button>
      </div>

      <div className={styles.shareButtons}>
        <button onClick={handleShare} className={styles.shareButton}>
          <Share2 size={20} />
          <span>링크 공유</span>
        </button>
        <button onClick={() => shareToKakao(window.location.href, '나만의 부적')} className={styles.shareButton}>
          <img src="/kakao.svg" alt="카카오톡" className={styles.shareIcon} />
          <span>카카오톡 공유</span>
        </button>
        <button onClick={() => shareToTwitter(window.location.href, '나만의 부적')} className={styles.shareButton}>
          <img src="/twitter.svg" alt="트위터" className={styles.shareIcon} />
          <span>트위터 공유</span>
        </button>
      </div>
    </div>
  );
};