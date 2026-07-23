import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Stack from "@/components/Stack";
import MusicPlayer from "@/components/MusicPlayer";
import Stats from "@/components/Stats";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import RevealProvider from "@/components/RevealProvider";

export default function Home() {
  return (
    <RevealProvider>
      <Header />
      <main>
        <Hero />
        <Services />
        <Stack />
        <MusicPlayer />
        <Stats />
        <Skills />
        <Projects />
        <Testimonials />
      </main>
      <Footer />
      <Toast />
    </RevealProvider>
  );
}
