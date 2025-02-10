import ChooseStreamSection from "./ChooseStreamSection";
import JoinStreamSection from "./JoinStreamSection";

function EmptyStreamSection() {
  return (
    <section className=" border-zinc-800 h-[500px] grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChooseStreamSection />
      <JoinStreamSection />
    </section>
  );
}

export default EmptyStreamSection;
