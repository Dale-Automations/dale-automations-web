import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import SuccessCases from "@/components/SuccessCases";
import Benefits from "@/components/Benefits";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";

const Index = () => {
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
