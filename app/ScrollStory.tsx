import Image from "next/image";

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
] as const;

export default function ScrollStory() {
  return (
    <section className="scroll-story" id="unidades" aria-labelledby="story-title">
      <h2 className="sr-only" id="story-title">Ambientes e possibilidades das Kitnets Beta</h2>
      {stories.map((story, index) => (
        <article className="story-panel" data-reveal="up" key={story.image}>
          <Image
            className="story-panel-image"
            src={story.image}
            alt={story.alt}
            fill
            quality={88}
            sizes="100vw"
            style={{ objectPosition: story.position }}
          />
          <div className="story-panel-shade" aria-hidden="true" />
          <div className="story-panel-copy">
            <span>{String(index + 1).padStart(2, "0")} / {story.eyebrow}</span>
            <h3>{story.title}</h3>
            <p>{story.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
