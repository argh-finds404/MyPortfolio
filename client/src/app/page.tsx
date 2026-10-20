import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import BeforeAfter from "@/components/BeforeAfter";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Process from "@/components/Process";
import Stack from "@/components/Stack";
import Journey from "@/components/Journey";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Preloader />
      <Hero />
      <Marquee />
      <BeforeAfter />
      <About />
      <Stats />
      <Services />
      <Work />
      <Process />
      <Stack />
      <Journey />
      <Testimonials />
      <Contact />
    </main>
  );
}
