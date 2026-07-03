import Reveal from "./Reveal";
import FlowDiagram from "./FlowDiagram";

const stages = [
  { label: "User", caption: "Asks a question" },
  { label: "Memory Layer", caption: "Recalls what's preserved" },
  { label: "RAG", caption: "Retrieves the relevant memory" },
  { label: "LLM", caption: "Reasons from what it retrieved" },
  { label: "Insight", caption: "An answer grounded in memory" },
];

export default function Architecture() {
  return (
    <section className="relative border-y border-white/5 bg-navy-deep/60 px-6 py-32 sm:px-10 sm:py-40">
      <Reveal className="mx-auto mb-16 max-w-xl text-center">
        <p className="eyebrow justify-center">Architecture</p>
        <h2 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Simple, by design.
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <FlowDiagram stages={stages} />
      </Reveal>
    </section>
  );
}
