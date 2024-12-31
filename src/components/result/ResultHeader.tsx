import ShareButtons from '../share/ShareButtons';
import styles from './Result.module.css';

interface ResultHeaderProps {
  title: string;
  url: string;
  resultId: string;
}

export const ResultHeader = ({ title, url, resultId }: ResultHeaderProps) => (
  <div className={styles.header}>
    <h1 className={styles.title}>{title}</h1>
    <div className={styles.shareButtonsContainer}>
      <ShareButtons url={url} title={title} resultId = {resultId} />  
    </div>
  </div>
);