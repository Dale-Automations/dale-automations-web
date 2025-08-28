import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const FloatingChatButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        size="lg"
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-full p-4 shadow-lg hover:scale-105 group"
      >
        <a 
          href="https://creator.voiceflow.com/prototype/687c300e0dde4cc3e9cbab8c" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="hidden sm:inline font-medium">Hablar con un Agente</span>
        </a>
      </Button>
    </div>
  );
};

export default FloatingChatButton;