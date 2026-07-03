import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MemoryLayer from "@/components/MemoryLayer";
import WhyTeachDB from "@/components/WhyTeachDB";
import ProofOfConcept from "@/components/ProofOfConcept";
import Architecture from "@/components/Architecture";
import Vision from "@/components/Vision";
import Philosophy from "@/components/Philosophy";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <MemoryLayer />
        <WhyTeachDB />
        <ProofOfConcept />
        <Architecture />
        <Vision />
        <Philosophy />
      </main>
      <Footer />
    </>
  );
}
