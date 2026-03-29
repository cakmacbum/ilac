import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, PlusCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Layout() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="w-full bg-white border-b border-slate-200 py-3 px-4 flex justify-between items-center">
        <div className="font-semibold text-slate-800 flex items-center gap-2">
          <img src="/icon.svg" alt="Logo" className="w-6 h-6" />
          {t('app_name')}
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 overflow-y-auto pb-16">
        <div className="max-w-md mx-auto p-4 h-full">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 safe-area-pb">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors',
                isActive ? 'text-sky-500' : 'text-slate-500 hover:text-slate-900'
              )
            }
          >
            <Home className="w-6 h-6 mb-1" />
            {t('nav.today')}
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors',
                isActive ? 'text-sky-500' : 'text-slate-500 hover:text-slate-900'
              )
            }
          >
            <PlusCircle className="w-6 h-6 mb-1" />
            {t('nav.add')}
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors',
                isActive ? 'text-sky-500' : 'text-slate-500 hover:text-slate-900'
              )
            }
          >
            <Clock className="w-6 h-6 mb-1" />
            {t('nav.history')}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
