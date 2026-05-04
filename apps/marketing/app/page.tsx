import Navbar from "@/components/ui/navbar";
import HeroScene from "@/components/scenes/hero-scene";
import PrevNext from "@/components/ui/prev-next";
import { getNeighbours } from "@/lib/scene-nav";

export default function Home() {
  const n = getNeighbours("hero");
  return (
    <>
      <Navbar />
      <HeroScene />
      <PrevNext prev={n.prev} next={n.next} step={n.step} total={n.total} />
    </>
  );
}
