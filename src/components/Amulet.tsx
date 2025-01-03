import { useState } from 'react';
import { Download, Share2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { shareToKakao, shareToTwitter } from '../utils/shareUtils';
import { createAmuletImage } from '../utils/imageUtils';
import { ColorOption } from '../types';
import styles from './Amulet.module.css';

interface AmuletProps {
  initialText: string;
}

export const Amulet = ({ initialText }: AmuletProps) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<ColorOption>('#FFFF9F');
  const [text, setText] = useState(initialText);
  const svg: string = '/test4.svg';

  const handleDownload = async (isWallpaper: boolean = false) => {
    try {
      const imageUrl = await createAmuletImage(selectedColor, svg, text, isWallpaper);
      
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
      <button onClick={() => navigate('/')} className={styles.goToGoalButton}>
        <span>목표 정하러 가기</span>
        <ArrowRight size={20} />
      </button>

      <div className={styles.colorPicker}>
        <button
          className={`${styles.colorButton} ${styles.green} ${selectedColor === 'green' ? styles.active : ''}`}
          onClick={() => setSelectedColor('green')}
        />
        <button
          className={`${styles.colorButton} ${styles.red} ${selectedColor === '#FFFF9F' ? styles.active : ''}`}
          onClick={() => setSelectedColor('#FFFF9F')}
        />
        <button
          className={`${styles.colorButton} ${styles.blue} ${selectedColor === 'blue' ? styles.active : ''}`}
          onClick={() => setSelectedColor('blue')}
        />
      </div>

      <div id="amulet-container" className={styles.amuletContainer} style={{ backgroundColor: selectedColor }}>
        <img src={svg} alt="Amulet" className={styles.amuletImage} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.textInput}
          placeholder="목표를 입력해줘!"
          maxLength={60}
          rows={3}
          style={{ resize: 'none', height: '4rem' }}
        />
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