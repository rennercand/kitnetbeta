import VirtualTour from "./VirtualTour";
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

      <section className="new-hero hero-tour-card" id="inicio">
        <div className="blueprint" aria-hidden="true"><i/><i/><i/><i/></div>
        <VirtualTour mode="hero" />
        <div className="hero-center">
          <div className="hero-kicker">Explore por dentro</div>
          <h1>Kitnets<br/><em>do seu jeito.</em></h1>
        </div>
        <a className="scroll-cue" href="#unidades" aria-label="Continuar para as unidades"><span>Role para explorar</span><i/></a>
      </section>

      <ScrollStory />

      <section className="owners-location" id="localizacao">
        <div data-reveal="left"><span className="eyebrow">Onde estamos</span><h2>Jardim Conceição,<br/>São Roque – SP.</h2><p>O endereço exato será informado diretamente aos interessados durante o agendamento.</p></div>
        <div className="owner-card" data-reveal="right"><span>Atendimento</span><h3>Roni Fagundes<br/>& Barbara Aline</h3><p>Contato direto, sem informações inventadas e com visita combinada.</p><ContactLink /></div>
      </section>

      <section className="contact" id="contato"><div data-reveal="up"><span className="eyebrow light">Próximo passo</span><h2>Quer conhecer<br/>pessoalmente?</h2></div><div className="contact-action" data-reveal="up" data-delay="1"><p>Assim que o telefone for cadastrado, o botão abrirá uma conversa direta no WhatsApp.</p><ContactLink className="button button-light" /></div></section>
      <footer data-reveal="up"><a className="brand" href="#inicio"><span className="brand-mark">KB</span><span>{siteConfig.name}</span></a><p>{siteConfig.location}</p><a href="#inicio">Voltar ao topo ↑</a></footer>
    </main>
  );
}
