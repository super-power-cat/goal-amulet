import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';
import { Footer } from './Footer';

export const NotFound = () => {
  const navigate = useNavigate();
  const next_icon = ">>";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>앗, 길을 잘못 든 것 같아요.</h1>
      <h1 className={styles.description}>페이지가 존재하지 않습니다. 아래 버튼을 눌러 올바른 페이지로 찾아갈 수 있어요.</h1>
      <div className={styles.buttonContainer}>
        <button 
          onClick={() => navigate('/amulet')} 
          className={styles.button}
        >
          <span>부적 만들러 가기 {next_icon}</span>
        </button>
        <button 
          onClick={() => navigate('/')} 
          className={styles.button}
        >
          <span>목표 정하러 가기 {next_icon}</span>
        </button>
      </div>
      <Footer className={styles.questionFlowFooter} />
    </div>
  );
}; 