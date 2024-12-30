import ShareButtons from '../share/ShareButtons';
import styles from './Result.module.css';

interface ResultHeaderProps {
  title: string;
  url: string;
}

export const ResultHeader = ({ title, url }: ResultHeaderProps) => (
  <div className={styles.header}>
    <h1 className={styles.title}>{title}</h1>
    <ShareButtons url={url} title={title} />
  </div>
);