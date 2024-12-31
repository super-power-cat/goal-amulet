import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './StartButton.module.css';

export const StartButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className={styles.button}
    >
      <span>나도 하러가기</span>
      <ArrowRight size={20} />
    </button>
  );
};