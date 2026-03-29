import { useTranslation } from 'react-i18next';
import { useMedicationStore } from '@/src/store/useMedicationStore';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { tr, enUS, ar, es, pt } from 'date-fns/locale';

const locales: Record<string, any> = { tr, en: enUS, ar, es, pt };

export function History() {
  const { t, i18n } = useTranslation();
  const { medications, removeMedication } = useMedicationStore();

  const currentLocale = locales[i18n.language] || tr;

  return (
    <div className="space-y-6 pb-20">
      <header className="pt-6 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('history.title')}</h1>
        <p className="text-slate-500 mt-1">{t('history.subtitle')}</p>
      </header>

      {medications.length === 0 ? (
        <Card className="bg-slate-50 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-slate-500 font-medium">{t('history.no_meds')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {medications.map((med) => (
            <Card key={med.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{med.name}</h3>
                    <p className="text-sm text-slate-500">{med.dosage} • {t('history.times_per_day', { count: med.frequency })}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {med.times.map((t, i) => (
                        <span key={i} className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-mono rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm(t('history.confirm_delete'))) {
                        removeMedication(med.id);
                      }
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                {med.history.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{t('history.recent_activity')}</h4>
                    <div className="space-y-2">
                      {med.history.slice(-3).reverse().map((h, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">
                            {format(parseISO(h.date), 'd MMM', { locale: currentLocale })} - <span className="font-mono">{h.time}</span>
                          </span>
                          {h.status === 'taken' ? (
                            <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3 me-1" /> {t('history.taken')}
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium">
                              <XCircle className="w-3 h-3 me-1" /> {t('history.missed')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
