import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beta Kitnets | Aluguel direto com o proprietário",
  description:
    "Kitnets práticas, bem cuidadas e com negociação direta com o proprietário.",
};

const whatsappLink =
  "https://wa.me/?text=Ol%C3%A1%21%20Vi%20as%20kitnets%20no%20site%20e%20gostaria%20de%20saber%20sobre%20a%20disponibilidade.";

const homes = [
  {
    tag: "Mais procurada",
    title: "Kitnet compacta",
    description: "Um espaço prático e bem distribuído para morar sozinho.",
    image:
      "https://images.squarespace-cdn.com/content/v1/58b99e0df5e2317b7d5778d0/1539970727137-NV16UHDY1X002M74KI1F/studio%2Bag%2Bvitacon%2B09.jpg",
    features: ["Ambiente integrado", "Boa iluminação", "Fácil de manter"],
  },
  {
    tag: "Conforto extra",
    title: "Kitnet ampla",
    description: "Mais espaço para criar seu cantinho de descanso e trabalho.",
    image:
      "https://www.arqbrunaferri.com/projetos/interiores/apartamento-studio/apartamento-studio-01.webp",
    features: ["Planta funcional", "Cozinha privativa", "Ventilação natural"],
  },
  {
    tag: "Pronta para morar",
    title: "Kitnet mobiliada",
    description: "Uma opção simples para quem quer mudar sem complicação.",
    image:
      "https://img.imageboss.me/production-yuca-real-estate-assets/width/1350/compression%3Afalse/noon_vm_b1_noon_vila_madalena_2078/df51dc6f-6d29-40af-a1d2-cfc1f732d06e.jpg",
    features: ["Móveis essenciais", "Espaço otimizado", "Mudança rápida"],
  },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Beta Kitnets, início">
          <span className="brand-mark">B</span>
          <span>Beta Kitnets</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#kitnets">Kitnets</a>
          <a href="#vantagens">Vantagens</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="button button-small" href={whatsappLink} target="_blank" rel="noreferrer">
          Falar no WhatsApp
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">Aluguel sem intermediários</span>
          <h1>Seu espaço.<br />Do seu jeito.</h1>
          <p>
            Kitnets práticas, bem cuidadas e com atendimento direto de quem é
            responsável pelo imóvel.
          </p>
          <div className="hero-actions">
            <a className="button" href="#kitnets">Ver kitnets</a>
            <a className="text-link" href={whatsappLink} target="_blank" rel="noreferrer">
              Consultar disponibilidade <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="trust-row" aria-label="Diferenciais">
            <span><b>✓</b> Direto com o proprietário</span>
            <span><b>✓</b> Atendimento rápido</span>
          </div>
        </div>
        <div className="hero-photo" role="img" aria-label="Interior claro de uma kitnet moderna">
          <div className="availability-card">
            <span className="status-dot" />
            <div><strong>Unidades disponíveis</strong><small>Consulte valores e condições</small></div>
          </div>
        </div>
      </section>

      <section className="intro" id="kitnets">
        <div>
          <span className="eyebrow">Encontre a sua</span>
          <h2>Um cantinho para<br />cada momento.</h2>
        </div>
        <p>
          Opções para diferentes rotinas, sempre com praticidade, privacidade e
          o cuidado de uma negociação direta.
        </p>
      </section>

      <section className="homes-grid" aria-label="Tipos de kitnets">
        {homes.map((home, index) => (
          <article className="home-card" key={home.title}>
            <div className="home-image-wrap">
              <img src={home.image} alt={`Interior da ${home.title.toLowerCase()}`} />
              <span className="home-tag">{home.tag}</span>
              <span className="card-number">0{index + 1}</span>
            </div>
            <div className="home-content">
              <h3>{home.title}</h3>
              <p>{home.description}</p>
              <ul>{home.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <a href={whatsappLink} target="_blank" rel="noreferrer">Tenho interesse <span>↗</span></a>
            </div>
          </article>
        ))}
      </section>

      <section className="benefits" id="vantagens">
        <div className="benefits-photo" role="img" aria-label="Kitnet acolhedora e bem iluminada" />
        <div className="benefits-copy">
          <span className="eyebrow light">Mais simples de verdade</span>
          <h2>Menos burocracia.<br />Mais tranquilidade.</h2>
          <p>
            Você conversa diretamente com o proprietário, tira suas dúvidas e
            combina cada detalhe com transparência.
          </p>
          <div className="benefit-list">
            <div><span>01</span><h3>Contato direto</h3><p>Respostas claras, sem ruído ou repasse de informações.</p></div>
            <div><span>02</span><h3>Visita combinada</h3><p>Escolha o melhor horário para conhecer pessoalmente.</p></div>
            <div><span>03</span><h3>Acordo transparente</h3><p>Valores e condições apresentados antes de decidir.</p></div>
          </div>
        </div>
      </section>

      <section className="owner-note">
        <span className="quote-mark">“</span>
        <blockquote>
          Cuido pessoalmente de cada espaço para que você encontre uma kitnet
          limpa, funcional e pronta para chamar de casa.
        </blockquote>
        <p>— Atendimento direto com o proprietário</p>
      </section>

      <section className="contact" id="contato">
        <div>
          <span className="eyebrow light">Vamos conversar?</span>
          <h2>Sua próxima casa<br />pode estar aqui.</h2>
        </div>
        <div className="contact-action">
          <p>Fale agora, consulte as unidades disponíveis e combine uma visita.</p>
          <a className="button button-light" href={whatsappLink} target="_blank" rel="noreferrer">
            Chamar no WhatsApp <span>→</span>
          </a>
        </div>
      </section>

      <footer>
        <a className="brand" href="#inicio"><span className="brand-mark">B</span><span>Beta Kitnets</span></a>
        <p>Kitnets para alugar direto com o proprietário.</p>
        <a href="#inicio">Voltar ao topo ↑</a>
      </footer>
    </main>
  );
}
