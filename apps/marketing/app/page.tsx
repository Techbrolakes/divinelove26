import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import SaveTheDate from "@/components/sections/SaveTheDate";
import OurStory from "@/components/sections/OurStory";
import EventDetails from "@/components/sections/EventDetails";
import RsvpCta from "@/components/sections/RsvpCta";
import Gallery from "@/components/sections/Gallery";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SaveTheDate />
        <OurStory />
        <EventDetails />
        <Gallery />
        <RsvpCta />
      </main>
      <Footer />
    </>
  );
}
