import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAmulet } from '../services/amuletService';
import { AmuletContainer } from '../components/AmuletContainer';
import { Download, Share2 } from 'lucide-react';
import { shareToKakao, shareToTwitter } from '../utils/shareUtils';
import { createAmuletImage } from '../utils/imageUtils';
import { ColorKey, getColorInfo } from '../types';
import styles from './AmuletPages.module.css';

export const SharedAmuletPage = () => {
  const { amuletId } = useParams<{ amuletId: string }>();
  const [color, setColor] = useState<ColorKey>('POWER');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAmulet = async () => {
      if (!amuletId) return;
      
      try {
        const amuletData = await getAmulet(amuletId);
        if (amuletData) {
          setColor(amuletData.color);
          setText(amuletData.text);
        } else {
          setError('부적을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('부적을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadAmulet();
  }, [amuletId]);

  const handleDownload = async (isWallpaper: boolean = false) => {
    try {
      const colorInfo = getColorInfo(color);
      const imageUrl = await createAmuletImage(
        color,
        colorInfo.file,
        colorInfo.title,
        text,2,0.83,
        isWallpaper
      );
      
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>나만의 부적</h1>
      
      <AmuletContainer 
        selectedColor={color}
        text={text}
      />

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