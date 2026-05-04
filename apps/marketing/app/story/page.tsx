import Navbar from "@/components/ui/navbar";
import StoryScene from "@/components/scenes/story-scene";
import PrevNext from "@/components/ui/prev-next";
import { getNeighbours } from "@/lib/scene-nav";

export default function StoryPage() {
  const n = getNeighbours("story");
  return (
    <>
      <Navbar />
      <StoryScene
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
    </>
  );
}
