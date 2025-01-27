import { useEffect, useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { shareToKakao, shareToTwitter } from '../utils/shareUtils';
import { createAmuletImage } from '../utils/imageUtils';
import { ColorKey, getColorInfo } from '../types';
import styles from './Amulet.module.css';
import { ColorPickerButton } from './ColorPickerButton';
import { AmuletContainer } from './AmuletContainer';
import { updateAmuletColor, updateAmuletText } from '../services/amuletService';

interface AmuletProps {
  title: string;
  initialText: string;
  initailColor: ColorKey;
  isLoading: boolean;
  isEditable: boolean;
}

const preloadImages = () => {
  const svgFiles = ['power_amulet.svg', 'luck_amulet.svg', 'fire_amulet.svg'];
  svgFiles.forEach(file => {
    const img = new Image();
    img.src = `/${file}`;
  });
};

export const Amulet = ({ title, initialText, initailColor, isLoading, isEditable }: AmuletProps) => {
  const { amuletId } = useParams<{ amuletId: string }>();
  const [selectedColor, setSelectedColor] = useState<ColorKey>(initailColor || 'POWER');
  const [text, setText] = useState(initialText || "이곳에 목표를 입력해주세요!");

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    setSelectedColor(initailColor);
  }, [initailColor]);

  useEffect(() => {
    preloadImages();
  }, []);

  const handleDownload = async (isWallpaper: boolean = false) => {
    const colorInfo = getColorInfo(selectedColor);
    try {
      let textSize = 2.5;
      let textTop = 0.92;
      if (text.length > 16) {
        textSize = 1.8;
        textTop = 0.86;
        // textTop = 0.74;
      }
      // text 크기... 위치... 추가 필요할듯
      const imageUrl = await createAmuletImage(
        selectedColor, 
        colorInfo.file, 
        colorInfo.title,
        text,
        textSize,
        textTop,
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
    navigator.clipboard.writeText(url); // '\n\n25년 목표를 귀여운 나만의 부적으로 만들어보세요!\n친구의 목표가 궁금하다면 링크를 클릭해 친구의 목표 부적을 확인해보세요!'
    alert('링크가 복사되었어요, 내 목표를 공유해봐요! \n⚠️ 해당 페이지를 나가면 부적을 수정할 수 없으니 주의해주세요. ⚠️');
  };

  const handleColorSelect = async (color: ColorKey) => {
    setSelectedColor(color);
    if (amuletId) {
      try {
        await updateAmuletColor(amuletId, color);
      } catch (error) {
        console.error('Error updating color:', error);
      }
    }
  };

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (amuletId) {
      try {
        await updateAmuletText(amuletId, newText);
      } catch (error) {
        console.error('Error updating text:', error);
      }
    }
  };

  const shareTitle = `✨ ${title} ✨ \n\n이루고 싶은 목표가 있어? 목표 부적을 만들고 함께 목표를 달성해보자!\n배경화면으로 설정하고 항상 확인해볼 수도 있어!\n#고뮬렛_고고`;

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingAmulet}>
            <span>🍀 부적을 가져오는 중... 🍀</span>
          </div>
        </div>
      ) : (
        <>
          {isEditable && (
            <div className={styles.colorPicker}>
              <ColorPickerButton
                color="POWER"
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
              />
              <ColorPickerButton
                color="LUCK"
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
              />
              <ColorPickerButton
                color="FIRE"
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
              />
            </div>
          )}

          <AmuletContainer 
            selectedColor={selectedColor}
            text={text}
            onTextChange={isEditable ? (newText) => handleTextChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>) : undefined}
            isEditable={isEditable}
          />

          <div className={styles.buttonGroup}>
            <button onClick={() => {
              window.gtag?.('event', 'click_download_amulet', {
                'event_category': 'download',
                'event_label': '부적 저장하기'
              });
              handleDownload(false);
            }} className={styles.downloadButton}>
              <Download size={20} />
              <span>부적 저장하기</span>
            </button>
            <button onClick={() => {
              window.gtag?.('event', 'click_download_wallpaper', {
                'event_category': 'download',
                'event_label': '배경화면용 저장하기'
              });
              handleDownload(true);
            }} className={styles.downloadButton}>
              <Download size={20} />
              <span>배경화면용 저장하기</span>
            </button>
          </div>

          <div className={styles.shareButtons}>
            <button onClick={() => {
              window.gtag?.('event', 'click_share_link', {
                'event_category': 'share',
                'event_label': '링크 공유'
              });
              handleShare();
            }} className={styles.shareButton}>
              <Share2 size={20} />
              <span>링크 공유</span>
            </button>
            <button onClick={() => {
              window.gtag?.('event', 'click_share_kakao', {
                'event_category': 'share', 
                'event_label': '카카오톡 공유'
              });
              shareToKakao(amuletId || '', shareTitle);
            }} className={styles.shareButton}>
              <img src="/kakao.svg" alt="카카오톡" className={styles.shareIcon} />
              <span>카카오톡 공유</span>
            </button>
            <button onClick={() => {
              window.gtag?.('event', 'click_share_twitter', {
                'event_category': 'share',
                'event_label': '트위터 공유'
              });
              shareToTwitter(window.location.href, shareTitle);
            }} className={styles.shareButton}>
              <img src="/twitter.svg" alt="트위터" className={styles.shareIcon} />
              <span>트위터 공유</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};