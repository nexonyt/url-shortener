import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = (measurementId) => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);

  const trackEvent = (action, params) => {
    if (window.gtag) {
      window.gtag('event', action, params);
    }
  };

  return { trackEvent };
};