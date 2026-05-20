import { Button } from '@blinkdotnew/ui';
import { useLanguage } from '../hooks/useLanguage';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="font-medium text-xs tracking-wider uppercase"
    >
      {language === 'en' ? 'FR' : 'EN'}
    </Button>
  );
}
