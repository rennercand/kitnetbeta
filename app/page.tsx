import VirtualTour from "./VirtualTour";
import { getWhatsappLink, siteConfig } from "./siteConfig";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

function ContactLink({ className = "button" }: { className?: string }) {
  const link = getWhatsappLink();
  return link ? <a className={className} href={link}>Consultar disponibilidade</a> : <span className={`${className} disabled`}>Contato em breve</span>;
}

export default function Home() {
  return (
    <main>
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

      <section className="intro" id="unidades">
        <div><span className="eyebrow">Espaços reais</span><h2>Conheça cada<br/>detalhe.</h2></div>
        <p>Imagens reais das kitnets e das áreas de circulação no Jardim Conceição, em São Roque.</p>
      </section>

      <section className="property-gallery" aria-label="Galeria das Kitnets Beta">
        <figure className="gallery-item gallery-wide">
          <img src="/media/corredor-sem-saco.png" alt="Corredor externo das Kitnets Beta com portas e janelas" />
          <figcaption><span>01</span> Corredor de acesso</figcaption>
        </figure>
        <figure className="gallery-item gallery-portrait">
          <img src="/media/kitnet-cozinha-sem-saco.png" alt="Interior de uma kitnet com pia e porta de entrada" />
          <figcaption><span>02</span> Espaço interno</figcaption>
        </figure>
        <figure className="gallery-item gallery-portrait">
          <img src="/media/kitnet-entrada.jpeg" alt="Interior de uma kitnet visto em direção ao acesso externo" />
          <figcaption><span>03</span> Entrada e cozinha</figcaption>
        </figure>
        <figure className="gallery-item gallery-video">
          <video controls playsInline preload="metadata" aria-label="Vídeo real das Kitnets Beta">
            <source src="/media/tour-real.mp4" type="video/mp4" />
          </video>
          <figcaption><span>04</span> Vídeo do espaço</figcaption>
        </figure>
        <figure className="gallery-item gallery-wide">
          <img src="/media/fachada-projeto.jpeg" alt="Vista do projeto da fachada das Kitnets Beta" />
          <figcaption><span>05</span> Vista do projeto</figcaption>
        </figure>
      </section>

      <section className="owners-location" id="localizacao">
        <div><span className="eyebrow">Onde estamos</span><h2>Jardim Conceição,<br/>São Roque – SP.</h2><p>O endereço exato será informado diretamente aos interessados durante o agendamento.</p></div>
        <div className="owner-card"><span>Atendimento</span><h3>Roni Fagundes<br/>& Barbara Aline</h3><p>Contato direto, sem informações inventadas e com visita combinada.</p><ContactLink /></div>
      </section>

      <section className="contact" id="contato"><div><span className="eyebrow light">Próximo passo</span><h2>Quer conhecer<br/>pessoalmente?</h2></div><div className="contact-action"><p>Assim que o telefone for cadastrado, o botão abrirá uma conversa direta no WhatsApp.</p><ContactLink className="button button-light" /></div></section>
      <footer><a className="brand" href="#inicio"><span className="brand-mark">KB</span><span>{siteConfig.name}</span></a><p>{siteConfig.location}</p><a href="#inicio">Voltar ao topo ↑</a></footer>
    </main>
  );
}
