import { Button } from "@/components/ui/button";
import { MessageSquare, Bot } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useScroll } from "@/hooks/use-scroll";

const FloatingChatButton = () => {
  const { t } = useTranslation();
  const { scrollY, scrollProgress } = useScroll();
  
  const handleWhatsAppClick = () => {
    const phoneNumber = "+5491131501670";
    const message = encodeURIComponent("Hola, me gustaría hablar con un agente");
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Animaciones del robot basadas en el scroll - solo movimiento vertical
  const robotTransform = {
    y: Math.sin(scrollProgress * Math.PI * 4) * 15, // Movimiento vertical suave
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
      {/* Robot flotante animado */}
      <div 
        className="transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${robotTransform.y}px)`,
        }}
      >
        <Bot className="h-8 w-8 text-brand-blue drop-shadow-lg" />
      </div>
      
      {/* Botón de WhatsApp */}
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