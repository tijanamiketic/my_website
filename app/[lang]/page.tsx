import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Blog from "@/components/sections/Blog";
import Interviews from "@/components/sections/Interviews";
import News from "@/components/sections/News";
import Courses from "@/components/sections/Courses";
import Resources from "@/components/sections/Resources";
import Events from "@/components/sections/Events";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Projects />
      <Blog />
      <Interviews />
      <News />
      <Courses />
      <Resources />
      <Events />
      <Contact />
    </main>
  );
}
