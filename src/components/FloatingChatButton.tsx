import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';

const FloatingChatButton = () => {
  const { t, i18n } = useTranslation();

  const handleWhatsAppClick = () => {
    const phone = i18n.language === 'en' ? '13464929025' : '5491136626658';
    const msg = i18n.language === 'en'
      ? "Hey Pablo! I found you on daleautomations.com"
      : "Hola Pablo! Los encontré por daleautomations.com";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        onClick={handleWhatsAppClick}
        className="bg-green-600 hover:bg-green-700 transition-all duration-300 rounded-full shadow-lg hover:scale-105 group flex items-center gap-2 px-5 py-6"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline font-medium">{t('floating.talkToAgent')}</span>
      </Button>
    </div>
  );
};

export default FloatingChatButton;
