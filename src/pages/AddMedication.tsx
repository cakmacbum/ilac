import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMedicationStore } from '@/src/store/useMedicationStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AddMedication() {
  const { t } = useTranslation();
  const { addMedication } = useMedicationStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [times, setTimes] = useState<string[]>(['09:00']);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    const newFreq = Math.min(Math.max(val, 1), 10);
    setFrequency(newFreq);
    
    // Adjust times array length
    if (newFreq > times.length) {
      const additional = Array(newFreq - times.length).fill('12:00');
      setTimes([...times, ...additional]);
    } else if (newFreq < times.length) {
      setTimes(times.slice(0, newFreq));
    }
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('add.error_name'));
      return;
    }

    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }

    addMedication({
      name,
      dosage,
      frequency,
      times: times.sort(),
    });

    toast.success(t('add.success'));
    navigate('/');
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="pt-6 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('add.title')}</h1>
        <p className="text-slate-500 mt-1">{t('add.subtitle')}</p>
      </header>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('add.name_label')}</Label>
              <Input 
                id="name" 
                placeholder={t('add.name_placeholder')} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-lg py-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">{t('add.dosage_label')}</Label>
              <Input 
                id="dosage" 
                placeholder={t('add.dosage_placeholder')} 
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="text-lg py-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">{t('add.freq_label')}</Label>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Input 
                  id="frequency" 
                  type="number" 
                  min="1" 
                  max="10"
                  value={frequency}
                  onChange={handleFrequencyChange}
                  className="text-lg py-6 text-center w-24"
                />
                <span className="text-slate-500">{t('add.freq_unit')}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Label>{t('add.times_label')}</Label>
              <div className="space-y-3">
                {times.map((time, idx) => (
                  <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex-1">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(idx, e.target.value)}
                        required
                        className="text-lg py-6 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full py-6 text-lg bg-sky-500 hover:bg-sky-600">
              {t('add.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
