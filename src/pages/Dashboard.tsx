import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMedicationStore } from '@/src/store/useMedicationStore';
import { format } from 'date-fns';
import { tr, enUS, ar, es, pt } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Pill } from 'lucide-react';
import { toast } from 'sonner';

const locales: Record<string, any> = { tr, en: enUS, ar, es, pt };

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { medications, markAsTaken, isLoaded } = useMedicationStore();
  const [todayStr, setTodayStr] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    setTodayStr(format(now, 'yyyy-MM-dd'));
    
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm'));
    }, 1000);
    
    // Initial set
    setCurrentTime(format(new Date(), 'HH:mm'));
    
    return () => clearInterval(timer);
  }, []);

  if (!isLoaded) return <div className="flex items-center justify-center h-full">...</div>;

  // Flatten medications into individual doses for today
  const todaysDoses = medications.flatMap((med) => {
    return med.times.map((time) => {
      const historyEntry = med.history.find(h => h.date === todayStr && h.time === time);
      return {
        ...med,
        time,
        status: historyEntry?.status || 'pending',
      };
    });
  }).sort((a, b) => a.time.localeCompare(b.time));

  const handleTake = (id: string, time: string) => {
    markAsTaken(id, todayStr, time);
    toast.success(t('dashboard.taken_success'));
    // Vibrate on success
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const currentLocale = locales[i18n.language] || tr;

  return (
    <div className="space-y-6 pb-20">
      <header className="pt-6 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('dashboard.title')}</h1>
        <p className="text-slate-500 mt-1">
          {format(new Date(), 'd MMMM yyyy, EEEE', { locale: currentLocale })}
        </p>
      </header>

      {todaysDoses.length === 0 ? (
        <Card className="bg-slate-50 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Pill className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">{t('dashboard.no_meds')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('dashboard.add_hint')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {todaysDoses.map((dose, idx) => {
            const isTaken = dose.status === 'taken';
            const isPast = currentTime > dose.time && !isTaken;
            
            return (
              <Card key={`${dose.id}-${dose.time}-${idx}`} className={`overflow-hidden transition-all ${isTaken ? 'bg-slate-50 border-slate-200 opacity-75' : isPast ? 'border-red-200 bg-red-50/50' : 'border-sky-100 shadow-sm'}`}>
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                        <Clock className={`w-4 h-4 ${isPast && !isTaken ? 'text-red-500' : 'text-slate-400'}`} />
                        <span className={`font-mono font-medium ${isPast && !isTaken ? 'text-red-600' : 'text-slate-700'}`}>
                          {dose.time}
                        </span>
                      </div>
                      <h3 className={`font-semibold text-lg ${isTaken ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {dose.name}
                      </h3>
                      <p className="text-sm text-slate-500">{dose.dosage}</p>
                    </div>
                    
                    <div className="ms-4">
                      {isTaken ? (
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      ) : (
                        <Button 
                          size="lg" 
                          variant={isPast ? "destructive" : "default"}
                          className={`rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-md ${!isPast ? 'bg-sky-500 hover:bg-sky-600' : ''}`}
                          onClick={() => handleTake(dose.id, dose.time)}
                        >
                          <CheckCircle2 className="w-7 h-7" />
                          <span className="sr-only">{t('dashboard.mark_taken')}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
