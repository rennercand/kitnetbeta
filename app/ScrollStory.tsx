"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useRef, useState } from "react";

const stories = [
  {
    image: "/media/loft-decorado.jpeg",
    alt: "Loft decorado com cama elevada, mesa de trabalho e iluminação indireta",
    eyebrow: "Loft decorado",
    title: "Cada metro pensado para render mais.",
    text: "Uma referência de como descanso, trabalho e personalidade podem dividir o mesmo espaço sem perder leveza.",
    position: "center",
  },
  {
    image: "/media/kitnet-home-office.jpeg",
    alt: "Cama organizada como espaço de descanso e trabalho com notebook",
    eyebrow: "Rotina flexível",
    title: "Morar, trabalhar e descansar.",
    text: "Um ambiente compacto pode acompanhar diferentes momentos do dia — simples de organizar e fácil de deixar com a sua cara.",
    position: "center 54%",
  },
  {
    image: "/media/kitnet-entrada.jpeg",
    alt: "Interior real da kitnet com cozinha compacta e acesso externo",
    eyebrow: "Espaço real",
    title: "O essencial, bem resolvido.",
    text: "Pia, circulação e entrada reunidas em uma planta prática para quem procura independência sem excesso.",
    position: "center 44%",
  },
  {
    image: "/media/corredor-sem-saco.png",
    alt: "Corredor externo de acesso às Kitnets Beta",
    eyebrow: "Jardim Conceição",
    title: "Chegar também faz parte da experiência.",
    text: "Acesso direto às unidades em São Roque, com uma apresentação clara do espaço antes mesmo da visita.",
    position: "center",
  },
] as const;

export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(stories.length - 1, Math.floor(value * stories.length));
    setActive((current) => current === next ? current : next);
  });

  if (reduceMotion) {
    return (
      <section className="story-fallback" id="unidades" aria-labelledby="story-fallback-title">
        <div className="story-fallback-intro">
          <span className="eyebrow">Espaços possíveis</span>
          <h2 id="story-fallback-title">Veja a kitnet<br/>de outro jeito.</h2>
        </div>
        {stories.map((story, index) => (
          <article className="story-fallback-card" key={story.image}>
            <div className="story-fallback-image">
              <Image src={story.image} alt={story.alt} fill sizes="100vw" style={{ objectPosition: story.position }} />
            </div>
            <div>
              <span>{String(index + 1).padStart(2, "0")} — {story.eyebrow}</span>
              <h3>{story.title}</h3>
              <p>{story.text}</p>
            </div>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="scroll-story" id="unidades" ref={sectionRef} aria-labelledby="story-title">
      <div className="sr-only">
        <h2 id="story-title">Ambientes e possibilidades das Kitnets Beta</h2>
        <ol>{stories.map((story) => <li key={story.image}>{story.eyebrow}: {story.title} {story.text}</li>)}</ol>
      </div>

      <div className="scroll-story-sticky" aria-hidden="true">
        <div className="story-images">
          {stories.map((story, index) => (
            <div className={`story-image ${active === index ? "is-active" : ""}`} key={story.image}>
              <Image
                src={story.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                quality={88}
                style={{ objectPosition: story.position }}
              />
            </div>
          ))}
          <div className="story-shade" />
          <div className="story-grain" />
        </div>

        <div className="story-copy-stage">
          {stories.map((story, index) => (
            <article className={`story-copy ${active === index ? "is-active" : ""}`} key={story.title}>
              <span className="story-eyebrow">{String(index + 1).padStart(2, "0")} — {story.eyebrow}</span>
              <h2>{story.title}</h2>
              <p>{story.text}</p>
            </article>
          ))}
        </div>

        <div className="story-index">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <i><motion.b style={{ scaleX: scrollYProgress }} /></i>
          <span>{String(stories.length).padStart(2, "0")}</span>
        </div>
        <span className="story-scroll-label">Continue rolando</span>
      </div>
    </section>
  );
}
