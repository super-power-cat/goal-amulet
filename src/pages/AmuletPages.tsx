import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Amulet } from '../components/Amulet';
import { useEffect, useState } from 'react';
import styles from './AmuletPages.module.css';
import { getAmulet } from '../services/amuletService';
import { ColorKey } from '../types';

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

  useEffect(() => {
    const loadAmulet = async () => {
      if (!amuletId) return;
      
      try {
        const amuletData = await getAmulet(amuletId);
        if (amuletData) {
          setColor(amuletData.color);
          setText(amuletData.text);
          setName(amuletData.name);
        } else {
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

  console.log(name);

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.goToGoalButton}>
        <span>목표 정하러 가기 {next_icon}</span>
        {/* <ArrowRight size={20} /> */}
      </button>
      <h1 className={styles.title}>✨ {name}의 목표 부적 ✨</h1>
      <Amulet initialText={text} initailColor = {color} />
    </div>
  );
};