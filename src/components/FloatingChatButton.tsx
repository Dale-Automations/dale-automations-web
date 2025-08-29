import { MessageCircle } from "lucide-react";
import CallMeForm from "./CallMeForm";

const FloatingChatButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <CallMeForm
        triggerClassName="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-full p-4 shadow-lg hover:scale-105 group flex items-center gap-2"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline font-medium">Hablar con un Agente</span>
      </CallMeForm>
    </div>
  );
};

export default FloatingChatButton;