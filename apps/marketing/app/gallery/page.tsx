import Navbar from "@/components/ui/navbar";
import BackgroundMusic from "@/components/ui/background-music";
import GalleryScene from "@/components/scenes/gallery-scene";
import PrevNext from "@/components/ui/prev-next";
import { getNeighbours } from "@/lib/scene-nav";

export default function GalleryPage() {
  const n = getNeighbours("gallery");
  return (
    <>
      <Navbar />
      <GalleryScene
        footer={
          <PrevNext
            inline
            prev={n.prev}
            next={n.next}
            step={n.step}
            total={n.total}
          />
        }
      />
      <BackgroundMusic />
    </>
  );
}
