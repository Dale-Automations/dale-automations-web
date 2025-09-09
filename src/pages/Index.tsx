import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Benefits from "@/components/Benefits";
import SuccessCases from "@/components/SuccessCases";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const Index = () => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Mostrar el contenido después de la animación del logo
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <div className={`transition-opacity duration-800 ${showContent ? 'page-intro' : 'opacity-0'}`}>
        <Hero />
        <Solutions />
        <Benefits />
        <SuccessCases />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
