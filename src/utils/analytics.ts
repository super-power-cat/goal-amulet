import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      params?: {
        page_path?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

export const GA_TRACKING_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

// 페이지 조회 이벤트 전송
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// 사용자 이벤트 전송
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// React Hook for tracking page views
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);
};