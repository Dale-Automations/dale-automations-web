import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useTranslation } from 'react-i18next';

const FloatingChatButton = () => {
  const { t } = useTranslation();
  
  const handleWhatsAppClick = () => {
    const phoneNumber = "+5491131501670";
    const message = encodeURIComponent("Hola, me gustaría hablar con un agente");
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        onClick={handleWhatsAppClick}
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-full p-4 shadow-lg hover:scale-105 group flex items-center gap-2"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="hidden sm:inline font-medium">{t('floating.talkToAgent')}</span>
      </Button>
    </div>
  );
};

export default FloatingChatButton;