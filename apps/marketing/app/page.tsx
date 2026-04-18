import Navbar from "@/components/ui/navbar";
import Hero from "@/components/sections/hero";
import OurStory from "@/components/sections/our-story";
import EventDetails from "@/components/sections/event-details";
import RsvpCta from "@/components/sections/rsvp-cta";
import Gallery from "@/components/sections/gallery";
import Gift from "@/components/sections/gift";
import Footer from "@/components/sections/footer";
import BackgroundMusic from "@/components/ui/background-music";

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
      <BackgroundMusic />
    </>
  );
}
