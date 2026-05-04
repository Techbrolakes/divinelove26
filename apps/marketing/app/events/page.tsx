import Navbar from "@/components/ui/navbar";
import EventsScene from "@/components/scenes/events-scene";
import PrevNext from "@/components/ui/prev-next";
import { getNeighbours } from "@/lib/scene-nav";

export default function EventsPage() {
  const n = getNeighbours("events");
  return (
    <>
      <Navbar />
      <EventsScene />
      <PrevNext prev={n.prev} next={n.next} step={n.step} total={n.total} />
    </>
  );
}
