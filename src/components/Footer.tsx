import { Twitter, Github, Instagram } from 'lucide-react';
import styles from './Footer.module.css';

interface Props {
    className?: string;
}

export const Footer = ({className}: Props) => {
  const FEEDBACK_URL = "https://forms.gle/oQjbsCwfwCkEcMX96";
  const TWITTER_URL = "https://x.com/power_super_cat?s=21";
  const GITHUB_URL = "https://github.com/super-power-cat/goal-amulet";
  const INSTAGRAM_URL = "https://www.instagram.com/super.power.cat";

  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.content}>
      <a 
          target="_blank"
          rel="noopener noreferrer"
          className={styles.superpowercat}
        >
          @superpowercat
        </a>
      <a className={styles.wall}>|</a>
        <a 
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.feedbackLink}
          onClick={() => {
            window.gtag?.('event', 'click_feedback', {
              'event_category': 'footer',
              'event_label': '피드백 링크 클릭'
            });
          }}
        >
          👉 이곳으로 의견을 주세요! 👈
        </a>
        <a className={styles.wall}>|</a>
        <div className={styles.socialLinks}>
        <a 
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            onClick={() => {
              window.gtag?.('event', 'click_github', {
                'event_category': 'footer',
                'event_label': 'Github 링크 클릭'
              });
            }}
          >
            <Github size={20} />
          </a>
        <a 
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            onClick={() => {
              window.gtag?.('event', 'click_instagram', {
                'event_category': 'footer', 
                'event_label': 'Instagram 링크 클릭'
              });
            }}
          >
            <Instagram size={20} />
          </a>
          <a 
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            onClick={() => {
              window.gtag?.('event', 'click_twitter', {
                'event_category': 'footer',
                'event_label': 'Twitter 링크 클릭'
              });
            }}
          >
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}; 