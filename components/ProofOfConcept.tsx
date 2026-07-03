import Reveal from "./Reveal";
import PortraitNetwork from "./PortraitNetwork";

export default function ProofOfConcept() {
  return (
    <section id="poc" className="relative mx-auto max-w-6xl px-6 py-32 sm:px-10 sm:py-40">
      <div className="grid items-center gap-14 sm:grid-cols-2 sm:gap-10">
        <Reveal>
          <p className="eyebrow">Proof of Concept</p>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Gentaku Otsuki
            <br />
            Memory Layer
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            The first Proof of Concept focuses on building the Gentaku Otsuki Memory Layer.
            Instead of relying on general AI knowledge, users interact with accumulated
            historical knowledge preserved inside a dedicated Memory Layer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Rangaku scholar", "Edo period", "First Memory Layer"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <PortraitNetwork />
        </Reveal>
      </div>
    </section>
  );
}
