import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import SaveTheDate from "@/components/sections/SaveTheDate";
import OurStory from "@/components/sections/OurStory";
import EventDetails from "@/components/sections/EventDetails";
import RsvpCta from "@/components/sections/RsvpCta";
import Gallery from "@/components/sections/Gallery";
import Gift from "@/components/sections/Gift";
import Footer from "@/components/sections/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* <SaveTheDate /> */}
        <OurStory />
        <Gallery />
        <Gift />
        <EventDetails />
        <RsvpCta />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
