import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import { saveAmulet } from "../services/amuletService";
import styles from './AmuletPages.module.css';

export const AmuletRedirectPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createAndRedirect = async () => {
      try {
        const defaultAnswer = '이곳에 목표를 입력해주세요!';
        const defaultName = '나만';
        const amuletId = await saveAmulet('POWER', defaultAnswer, defaultName);
        navigate(`/amulet/${amuletId}`);
      } catch (error) {
        console.error('Error creating amulet:', error);
        setIsLoading(false);
      }
    };

    createAndRedirect();
  }, [navigate]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}>✨</div>
        <p>부적을 만들고 있어요...</p>
      </div>
    </div>
  );
};