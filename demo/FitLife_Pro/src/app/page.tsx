import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Classes from "@/components/Classes";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Faqs from "@/components/Faqs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-lime-400 selection:text-neutral-900">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Classes />
        <Pricing />
        <Testimonials />
        <Faqs />
      </main>
      <Footer />
    </div>
  );
}
