import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Amulet } from '../components/Amulet';
import { useEffect, useState } from 'react';
import styles from './AmuletPages.module.css';
import { getAmulet } from '../services/amuletService';
import { ColorKey } from '../types';
import { Footer } from '../components/Footer';
import { addCheer, addCheerMessage } from '../services/cheerService';
import Confetti from 'react-confetti';

export const AmuletPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialText = location.state?.lastAnswer || '';
  const next_icon = ">>";
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [cheerMessage, setCheerMessage] = useState('');

  const { amuletId } = useParams<{ amuletId: string }>();
  const [color, setColor] = useState<ColorKey>('POWER');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('나만');
  const [isEditable, setIsEditable] = useState(false);
  const [hasAlreadyCheered, setHasAlreadyCheered] = useState(false);

  useEffect(() => {
    const loadAmulet = async () => {
      if (!amuletId) return;
      
      try {
        const amuletData = await getAmulet(amuletId);
        if (amuletData) {
          console.log(amuletData.color + "color");
          setColor(amuletData.color || 'POWER');
          setText(amuletData.text || '이곳에 목표를 입력해주세요!');
          setName(amuletData.name || '나만');
          
          const referrer = location.state?.referrer || 'unknown';
          const isFromRedirect = referrer.includes('/amulet') && !referrer.includes('/amulet/');
          const isFromQuestionFlow = referrer.includes('/');
          
          // localStorage에서 방문 기록 확인
          const visitedAmulets = localStorage.getItem('visitedAmulets') || '[]';
          const visited = JSON.parse(visitedAmulets).includes(amuletId);

          // isEditable 조건 설정
          const shouldBeEditable = (isFromRedirect || isFromQuestionFlow) && !visited;
          setIsEditable(shouldBeEditable);
          
          // 방문 기록 저장
          if (shouldBeEditable) {
            const newVisited = [...JSON.parse(visitedAmulets), amuletId];
            localStorage.setItem('visitedAmulets', JSON.stringify(newVisited));
          }

          // 응원 여부 확인
          const cheeredAmulets = localStorage.getItem('cheeredAmulets') || '[]';
          const hasAlreadyCheered = JSON.parse(cheeredAmulets).includes(amuletId);
          setHasAlreadyCheered(hasAlreadyCheered);
        } else {
          setName('나만');
          setColor('POWER');
          setText('이곳에 목표를 입력해주세요!');
        }
      } catch (err) {
        setError('부적을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadAmulet();
  }, [amuletId]);

  const handleCheer = async () => {
    try {
      if (amuletId) {
        await addCheer(amuletId);
        setShowConfetti(true);
        
        // 응원 기록 저장
        const cheeredAmulets = localStorage.getItem('cheeredAmulets') || '[]';
        const newCheered = [...JSON.parse(cheeredAmulets), amuletId];
        localStorage.setItem('cheeredAmulets', JSON.stringify(newCheered));
        setHasAlreadyCheered(true);
        
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error('Error adding cheer:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      if (amuletId && cheerMessage.trim()) {
        await addCheerMessage(amuletId, cheerMessage);
        setCheerMessage('');
        setShowMessageModal(false);
        setTimeout(() => setShowConfetti(false), 3000);
        // handleCheer();
        setShowConfetti(true);
        // alert('응원 메시지가 전달되었어요! 🎉');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={styles.background}>
      {showConfetti && <Confetti />}
      <div className={styles.container}>
        <button 
          onClick={() => {
            window.gtag?.('event', 'click_make_amulet', {
              'event_category': 'go_button_question',
              'event_label': '[부적 페이지] 나도 하러 가기 버튼 클릭'
            });
            navigate('/');
          }} 
          className={styles.goToGoalButton}
        >
          <span>🔥 나도 하러 가기 {next_icon}</span>
        </button>
        <h1 className={styles.title}>✨ {name}의 목표 부적 ✨</h1>

        {!isEditable && (
          <div className={styles.cheerButtonContainer}>
            <button 
              onClick={() => {
                if (hasAlreadyCheered) {
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 5000);
                  // alert('이미 응원을 했어요! 더 응원하고 싶다면 옆의 메시지 버튼을 이용해 응원의 메시지를 보내보는건 어떨까요?');
                } else {
                  handleCheer();
                }
              }}
              className={`${styles.cheerButton} ${hasAlreadyCheered ? styles.cheered : ''}`}
            >
              {hasAlreadyCheered ? '✅ 응원하기' : '👏 응원하기'}
            </button>
            <button
              onClick={() => setShowMessageModal(true)}
              className={styles.messageButton}
            >
              💌
            </button>
          </div>
        )}

        {showMessageModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>응원 메시지 보내기</h2>
              <textarea
                value={cheerMessage}
                onChange={(e) => setCheerMessage(e.target.value)}
                placeholder="응원의 메시지를 입력해주세요!"
                className={styles.messageInput}
              />
              <div className={styles.modalButtons}>
                <button onClick={() => setShowMessageModal(false)}>취소</button>
                <button onClick={handleSendMessage}>보내기</button>
              </div>
            </div>
          </div>
        )}

        
        <Amulet 
          title={name + '의 목표 부적'}
          initialText={text} 
          initailColor={color} 
          isLoading={loading}
          isEditable={isEditable}
        />
      </div>
      <Footer />
    </div>
  );
};