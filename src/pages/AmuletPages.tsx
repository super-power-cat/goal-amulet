import { useLocation } from 'react-router-dom';
import { Amulet } from '../components/Amulet';
import styles from './AmuletPages.module.css';

export const AmuletPage = () => {
  const location = useLocation();
  const initialText = location.state?.lastAnswer || '';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>나만의 부적</h1>
      <Amulet initialText={initialText} />
    </div>
  );
};