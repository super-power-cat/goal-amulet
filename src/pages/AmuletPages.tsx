import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Amulet } from '../components/Amulet';
import { useEffect, useState } from 'react';
import styles from './AmuletPages.module.css';
import { getAmulet } from '../services/amuletService';
import { ColorKey } from '../types';
import { Footer } from '../components/Footer';

export const AmuletPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialText = location.state?.lastAnswer || '';
  const next_icon = ">>";

  const { amuletId } = useParams<{ amuletId: string }>();
  const [color, setColor] = useState<ColorKey>('POWER');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('나만');
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const loadAmulet = async () => {
      if (!amuletId) return;
      
      try {
        const amuletData = await getAmulet(amuletId);
        if (amuletData) {
          setColor(amuletData.color || 'POWER');
          setText(amuletData.text || '이곳에 목표를 입력해주세요!');
          setName(amuletData.name || '나만');
          
          // 이전 페이지 경로 확인
          const referrer = document.referrer;
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


  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <button onClick={() => navigate('/')} className={styles.goToGoalButton}>
          <span>목표 정하러 가기 {next_icon}</span>
        </button>
        <h1 className={styles.title}>✨ {name}의 목표 부적 ✨</h1>
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