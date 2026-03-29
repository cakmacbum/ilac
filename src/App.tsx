import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddMedication } from './pages/AddMedication';
import { History } from './pages/History';
import { useMedicationStore } from './store/useMedicationStore';
import { Toaster } from '@/components/ui/sonner';
import { format } from 'date-fns';

export default function App() {
  const { loadMedications, medications } = useMedicationStore();
  const { i18n, t } = useTranslation();
  const lastTriggeredRef = useRef<Record<string, string>>({});

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Notification and Alarm logic
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentStr = format(now, 'HH:mm');
      const todayStr = format(now, 'yyyy-MM-dd');

      medications.forEach(med => {
        med.times.forEach(time => {
          // Check if it's exactly the time and not already taken/missed
          if (time === currentStr) {
            const hasHistory = med.history.some(h => h.date === todayStr && h.time === time);
            const alarmKey = `${med.id}-${todayStr}-${time}`;
            
            if (!hasHistory && lastTriggeredRef.current[alarmKey] !== currentStr) {
              lastTriggeredRef.current[alarmKey] = currentStr;
              
              // Trigger notification
              if ('Notification' in window && Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(registration => {
                  registration.showNotification(t('app_name'), {
                    body: `${med.name} (${med.dosage})`,
                    icon: '/icon.svg',
                    vibrate: [500, 250, 500, 250],
                    tag: `${med.id}-${time}`, // Prevent duplicate notifications
                  } as any);
                });
              }

              // Vibrate device if supported
              if ('vibrate' in navigator) {
                navigator.vibrate([500, 250, 500, 250]);
              }

              // Play sound
              const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
              audio.play().catch(e => console.log('Audio play failed (user interaction needed):', e));
            }
          }
        });
      });
    };

    // Check every minute at the 0th second
    const now = new Date();
    const delayToNextMinute = (60 - now.getSeconds()) * 1000;
    
    // Initial check just in case
    checkAlarms();

    const timeout = setTimeout(() => {
      checkAlarms();
      const interval = setInterval(checkAlarms, 60000);
      return () => clearInterval(interval);
    }, delayToNextMinute);

    return () => clearTimeout(timeout);
  }, [medications, t]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddMedication />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
      <Toaster position="top-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} />
    </BrowserRouter>
  );
}
