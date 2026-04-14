import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import OurStory from "@/components/sections/OurStory";
import EventDetails from "@/components/sections/EventDetails";
import RsvpSection from "@/components/sections/RsvpSection";
import Gallery from "@/components/sections/Gallery";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <OurStory />
        <EventDetails />
        <RsvpSection />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
