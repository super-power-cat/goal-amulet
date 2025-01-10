import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Amulet } from '../components/Amulet';
import styles from './AmuletPages.module.css';

export const AmuletPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialText = location.state?.lastAnswer || '';
  const next_icon = ">>";

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.goToGoalButton}>
        <span>목표 정하러 가기 {next_icon}</span>
        {/* <ArrowRight size={20} /> */}
      </button>
      <h1 className={styles.title}>나만의 목표 부적</h1>
      <Amulet initialText={initialText} />
    </div>
  );
};