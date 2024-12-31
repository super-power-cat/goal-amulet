import { Copy, Share2 } from 'lucide-react';
import { shareToKakao, shareToFacebook, shareToTwitter, shareToLinkedIn } from '../../utils/shareUtils';
import styles from './ShareButtons.module.css';

interface ShareButtonsProps {
  url: string;
  title: string;
  resultId: string;
}

export default function ShareButtons({ url, title, resultId }: ShareButtonsProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleCopyLink}
        className={styles.button}
        aria-label="링크 복사"
      >
        <Copy size={20} />
        <span>링크 복사</span>
      </button>
      
      <div className={styles.divider} />
      
      <div className={styles.socialButtons}>
        <button
          onClick={() => shareToKakao(resultId, title)}
          className={`${styles.socialButton} ${styles.kakao}`}
          aria-label="카카오톡 공유"
        >
          <img src="/kakao.svg" alt="카카오톡" className={styles.icon} />
        </button>
        
        <button
          onClick={() => shareToFacebook(url)}
          className={`${styles.socialButton} ${styles.facebook}`}
          aria-label="페이스북 공유"
        >
          <img src="/facebook.svg" alt="페이스북" className={styles.icon} />
        </button>
        
        <button
          onClick={() => shareToTwitter(url, title)}
          className={`${styles.socialButton} ${styles.twitter}`}
          aria-label="트위터 공유"
        >
          <img src="/twitter.svg" alt="트위터" className={styles.icon} />
        </button>
        
        <button
          onClick={() => shareToLinkedIn(url, title)}
          className={`${styles.socialButton} ${styles.linkedin}`}
          aria-label="링크드인 공유"
        >
          <img src="/linkedin.svg" alt="링크드인" className={styles.icon} />
        </button>
      </div>
    </div>
  );
}