import Navbar from "@/components/layout/Navbar";
import ExperienceCanvas from "@/components/three/ExperienceCanvas";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import FactoryScale from "@/components/sections/FactoryScale";
import GlobalExport from "@/components/sections/GlobalExport";
import Hero from "@/components/sections/Hero";
import Manufacturing from "@/components/sections/Manufacturing";
import Products from "@/components/sections/Products";
import Quality from "@/components/sections/Quality";
import Sustainability from "@/components/sections/Sustainability";
import Uniforms from "@/components/sections/Uniforms";

export default function Home() {
  return (
    <>
      <Navbar />
      <ExperienceCanvas />
      <main>
        <Hero />
        <About />
        <FactoryScale />
        <Manufacturing />
        <Products />
        <Uniforms />
        <Quality />
        <Sustainability />
        <GlobalExport />
        <Contact />
      </main>
    </>
  );
}
