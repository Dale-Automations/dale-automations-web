import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import './i18n';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingChatButton from "@/components/FloatingChatButton";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Index from "./pages/Index";
import Cobros from "./pages/Cobros";
import NotFound from "./pages/NotFound";


const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <CustomCursor />
    <ScrollProgress />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cobros" element={<Cobros />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingChatButton />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
