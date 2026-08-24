import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { getWhatsappLink, siteConfig } from "./siteConfig";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";
import ScrollStory from "./ScrollStory";

function ContactLink({ className = "button" }: { className?: string }) {
  const link = getWhatsappLink();
  return link ? <a className={className} href={link}>Consultar disponibilidade</a> : <span className={`${className} disabled`}>Contato em breve</span>;
}

export default function Home() {
  return (
    <main>
      <ScrollReveal />
      <AnimatedNavFramer />

      <section className="hero-minimal" id="inicio">
        <Image
          className="hero-minimal-image"
          src="/media/loft-decorado.jpeg"
          alt="Loft decorado das Kitnets Beta"
          fill
          priority
          quality={88}
          sizes="100vw"
        />
        <div className="hero-minimal-shade" aria-hidden="true" />
        <div className="hero-minimal-copy">
          <p>Jardim Conceição · São Roque</p>
          <h1>Kitnets<br/><span>do seu jeito.</span></h1>
        </div>
        <a className="hero-scroll" href="#unidades" aria-label="Conhecer os ambientes">
          <span>Conheça os ambientes</span><i />
        </a>
      </section>

      <ScrollStory />

      <section className="location-minimal" id="localizacao">
        <span className="section-number" data-reveal="up">04</span>
        <div data-reveal="up">
          <span className="eyebrow">Localização</span>
          <h2>Jardim Conceição,<br/>São Roque.</h2>
        </div>
        <p data-reveal="up" data-delay="1">Um endereço tranquilo e prático. A localização completa é informada durante o agendamento da visita.</p>
      </section>

      <section className="contact-minimal" id="contato">
        <div data-reveal="up"><span className="eyebrow light">Visitas</span><h2>Venha conhecer.</h2></div>
        <div className="contact-minimal-action" data-reveal="up" data-delay="1"><p>Consulte a disponibilidade e combine uma visita.</p><ContactLink className="button button-light" /></div>
      </section>
      <footer><a className="brand" href="#inicio"><span className="brand-mark">KB</span><span>{siteConfig.name}</span></a><p>{siteConfig.location}</p><a href="#inicio">Topo</a></footer>
    </main>
  );
}
