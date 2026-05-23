import Navbar from "../components/landing/navbar";
import Hero from "../components/landing/hero";
import Stats from "../components/landing/stats";
import Footer from "../components/landing/footer";
import Diagnostics from "../components/landing/diagnostics";
import CTA from  "../components/landing/cta";
import Security from "../components/landing/security";

export default function Home() {
  return (
    <main className="bg-[#0a1016] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Diagnostics />
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}