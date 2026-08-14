import VirtualTour from "./VirtualTour";
import { getWhatsappLink, siteConfig } from "./siteConfig";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

const units = ["Kitnet 01", "Kitnet 02", "Kitnet 03"];

function ContactLink({ className = "button" }: { className?: string }) {
  const link = getWhatsappLink();
  return link ? <a className={className} href={link}>Consultar disponibilidade</a> : <span className={`${className} disabled`}>Contato em breve</span>;
}

export default function Home() {
  return (
    <main>
      <AnimatedNavFramer />

      <section className="new-hero" id="inicio">
        <div className="blueprint" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="entrance-preview" aria-label="Representação demonstrativa da entrada de uma kitnet">
          <div className="entrance-ceiling" />
          <div className="entrance-wall left" />
          <div className="entrance-door"><span>KB</span></div>
          <div className="entrance-wall right" />
          <div className="entrance-floor"><i/><i/><i/><i/></div>
          <small>Entrada demonstrativa</small>
        </div>
        <div className="hero-center">
          <div className="hero-kicker">Jardim Conceição · São Roque</div>
          <h1>Kitnets<br/><em>do seu jeito.</em></h1>
          <div className="hero-actions"><a className="button monochrome" href="#tour">Explorar em 3D <span>↗</span></a></div>
        </div>
        <a className="scroll-cue" href="#unidades" aria-label="Continuar para as unidades"><span>Role para explorar</span><i/></a>
      </section>

      <section className="intro" id="unidades">
        <div><span className="eyebrow">Unidades</span><h2>Uma base pronta<br/>para receber você.</h2></div>
        <p>As informações, medidas, valores e fotos reais serão adicionados após o levantamento das unidades. Até lá, nada é apresentado como definitivo.</p>
      </section>

      <section className="placeholder-grid">
        {units.map((unit, index) => (
          <article className="unit-card" key={unit}>
            <div className="unit-visual"><span>0{index + 1}</span><div className="floorplan"><i/><i/><i/></div><small>Imagem demonstrativa — foto real em breve</small></div>
            <div className="unit-body"><p>A confirmar</p><h3>{unit}</h3><dl><div><dt>Valor</dt><dd>A confirmar</dd></div><div><dt>Medidas</dt><dd>A confirmar</dd></div><div><dt>Status</dt><dd>A confirmar</dd></div></dl></div>
          </article>
        ))}
      </section>

      <section className="tour-section" id="tour">
        <div className="tour-heading"><span className="eyebrow light">Experiência 3D</span><h2>Caminhe pela sua<br/>futura kitnet.</h2><p>Use o tour guiado ou explore livremente com teclado, mouse e controles na tela.</p></div>
        <VirtualTour />
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
