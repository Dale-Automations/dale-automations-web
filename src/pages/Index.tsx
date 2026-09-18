import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import SuccessCases from "@/components/SuccessCases";
import Benefits from "@/components/Benefits";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { hash } = useLocation();

  // Llegada con /#seccion (por ejemplo desde el footer de /cv): bajar a la seccion una vez montado el home.
  useEffect(() => {
    const id = hash.replace("#", "");
    if (!id) return;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Solutions />
      <SuccessCases />
      <Benefits />
      <ContactForm />
      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default Index;
