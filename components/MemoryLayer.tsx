import Reveal from "./Reveal";
import FlowDiagram from "./FlowDiagram";

const stages = [
  { label: "Historical Figure", caption: "What one person knew, wrote, believed" },
  { label: "Memory Layer", caption: "Structured, permanent, queryable" },
  { label: "RAG", caption: "Retrieval grounded in that memory" },
  { label: "LLM", caption: "Any model, reasoning from it" },
  { label: "Understanding", caption: "A conversation, not a summary" },
];

export default function MemoryLayer() {
  return (
    <section id="memory-layer" className="relative mx-auto max-w-5xl px-6 py-32 sm:px-10 sm:py-40">
      <Reveal className="mx-auto mb-16 max-w-xl text-center">
        <p className="eyebrow justify-center">What is a Memory Layer?</p>
        <h2 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Knowledge remains.
          <br />
          Reasoning evolves.
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <FlowDiagram stages={stages} />
      </Reveal>

      <Reveal delay={0.2} className="mx-auto mt-16 max-w-lg text-center">
        <p className="text-base leading-relaxed text-muted">
          Memory Layers become permanent knowledge assets — independent of any single model,
          outliving every version of the AI that reasons from them.
        </p>
      </Reveal>
    </section>
  );
}
