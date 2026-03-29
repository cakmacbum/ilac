import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Globe className="w-4 h-4 text-slate-500" />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-sm text-slate-600 font-medium focus:outline-none cursor-pointer"
      >
        <option value="tr">Türkçe</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
        <option value="es">Español</option>
        <option value="pt">Português</option>
      </select>
    </div>
  );
}
