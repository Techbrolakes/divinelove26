import Navbar from "@/components/ui/navbar";
import BackgroundMusic from "@/components/ui/background-music";
import GiftsScene from "@/components/scenes/gifts-scene";
import PrevNext from "@/components/ui/prev-next";
import { getNeighbours } from "@/lib/scene-nav";

export default function GiftsPage() {
  const n = getNeighbours("gifts");
  return (
    <>
      <Navbar />
      <GiftsScene />
      <PrevNext prev={n.prev} next={n.next} step={n.step} total={n.total} />
      <BackgroundMusic />
    </>
  );
}
