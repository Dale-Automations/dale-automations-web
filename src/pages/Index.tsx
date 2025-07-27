import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Benefits from "@/components/Benefits";
import SuccessCases from "@/components/SuccessCases";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Solutions />
      <Benefits />
      <SuccessCases />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
