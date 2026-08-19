import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Check, CheckCircle2, ChevronDown, CircleAlert,
  Clock3, Eye, Gift, Home, Loader2, Lock, Map,
  Package, Printer, ShieldCheck, ShoppingBag, Smartphone,
  TimerReset, Users, X, Zap,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type ModalState = 'idle' | 'submitting' | 'success' | 'error';

const guides = [
  'Cozinha', 'Geladeira e despensa', 'Quartos', 'Armários e guarda-roupas',
  'Banheiros', 'Área de serviço', 'Sala de estar', 'Sala de jantar',
  'Home office', 'Áreas externas', 'Crianças e brinquedos', 'Documentos e papéis',
  'Produtos de limpeza', 'Ferramentas e manutenção', 'Decoração e acessórios',
  'Compras e reposição', 'Guardar, doar ou descartar', 'Onde começar hoje',
  'Manutenção semanal', 'Manutenção diária',
];

const bonuses = [
  { number: '01', title: 'Rotina de 15 minutos', description: 'Um plano visual para distribuir pequenas ações ao longo do dia e evitar o acúmulo.', icon: TimerReset },
  { number: '02', title: 'Guia de primeiros passos', description: 'Um roteiro simples para escolher o primeiro ambiente e avançar sem tentar fazer tudo de uma vez.', icon: Zap },
  { number: '03', title: 'Envolvendo a família', description: 'Orientações visuais para deixar claro onde cada item pertence e facilitar a participação de todos.', icon: Users },
];

const demoImages = [
  { src: '/guia-como-usar-kit.png', alt: 'Guia visual explicando como usar o kit de organização da casa' },
  { src: '/mapa-rotina-visual-casa.png', alt: 'Mapa visual da rotina diária, semanal e mensal da casa' },
  { src: '/mapa-cozinha-organizada.png', alt: 'Mapa visual com o fluxo para manter a cozinha organizada' },
];

function LeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<ModalState>('idle');

  useEffect(() => {
    if (!open) return;
    setState('idle');
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState('submitting');
    if (!isSupabaseConfigured || !supabase) { setState('error'); return; }
    const { error } = await supabase.from('leads').insert({ name: name.trim(), email: email.trim(), phone: phone.trim() || null, source: 'sales_page' });
    setState(error ? 'error' : 'success');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="lead-title">
      <button className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-label="Fechar formulário" />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="h-2 bg-[#DFFF04]" />
        <button onClick={onClose} className="absolute right-4 top-5 rounded-full p-2 text-neutral-500 hover:bg-neutral-100" aria-label="Fechar"><X className="h-5 w-5" /></button>
        {state === 'success' ? (
          <div className="px-8 py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-lime-100"><CheckCircle2 className="h-9 w-9 text-lime-700" /></div>
            <h2 id="lead-title" className="text-2xl font-extrabold">Você está na lista!</h2>
            <p className="mt-3 leading-relaxed text-neutral-600">Obrigada, {name.split(' ')[0] || 'visitante'}. Avisaremos quando o checkout estiver disponível.</p>
            <button onClick={onClose} className="mt-7 rounded-xl bg-neutral-900 px-6 py-3 font-bold text-white">Fechar</button>
          </div>
        ) : (
          <div className="p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-lime-700">Lista de interesse</p>
            <h2 id="lead-title" className="mt-2 pr-8 text-2xl font-extrabold">Quero receber o link de lançamento</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">O checkout ainda está sendo preparado. Cadastre-se para receber o aviso.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold">Nome completo<input required value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="Seu nome" /></label>
              <label className="block text-sm font-semibold">E-mail<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="seu@email.com" /></label>
              <label className="block text-sm font-semibold">Telefone <span className="font-normal text-neutral-400">(opcional)</span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" placeholder="(00) 00000-0000" /></label>
              {state === 'error' && <div className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />A lista ainda está sendo configurada. Tente novamente quando a página for publicada.</div>}
              <button type="submit" disabled={state === 'submitting'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-4 font-extrabold text-white hover:bg-neutral-800 disabled:opacity-60">{state === 'submitting' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingBag className="h-5 w-5" />}Quero ser avisada</button>
            </form>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-400"><Lock className="h-3.5 w-3.5" /> Seus dados não serão compartilhados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CtaButton({ onClick, label = 'Quero conhecer o kit' }: { onClick: () => void; label?: string }) {
  return <button onClick={onClick} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#DFFF04] px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-neutral-950 shadow-[0_10px_30px_rgba(223,255,4,.18)] transition hover:bg-[#e8ff55] active:scale-[.98]">{label}<ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></button>;
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: .08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}>{children}</div>;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white"><button className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left" onClick={() => setOpen(!open)} aria-expanded={open}><span className="font-bold">{question}</span><ChevronDown className={`h-5 w-5 shrink-0 transition ${open ? 'rotate-180' : ''}`} /></button><div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><p className="px-5 pb-5 leading-relaxed text-neutral-600">{answer}</p></div></div></div>;
}

function StickyCta({ onClick }: { onClick: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const onScroll = () => setVisible(window.scrollY > 650); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  return <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-neutral-700 bg-neutral-950/95 p-3 backdrop-blur transition-transform md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}><button onClick={onClick} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#DFFF04] px-5 py-3.5 font-extrabold text-neutral-950">Quero acessar os mapas<ArrowRight className="h-5 w-5" /></button></div>;
}

function useCountdown(durationInSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(durationInSeconds);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const countdown = useCountdown(17 * 60);
  const openModal = () => setModalOpen(true);
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <StickyCta onClick={openModal} />

      {/* 1 — VENDA DIRETA */}
      <header className="relative overflow-hidden bg-[#2A2A2A] text-white">
        <div className="relative z-20 border-b border-red-800 bg-red-600 px-4 py-3 text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
            <span className="text-xs font-black uppercase tracking-[.14em] sm:text-sm">Essa oferta irá encerrar em:</span>
            <span className="rounded-lg bg-red-950 px-3 py-1.5 text-lg font-black tabular-nums tracking-wider text-white shadow-sm" aria-live="polite" aria-label={`Tempo restante: ${countdown}`}>
              {countdown}
            </span>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url('/hero-casa-organizada-conforto.png')" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#2A2A2A]/85 via-[#2A2A2A]/70 to-[#2A2A2A]/45"
        />
        <div className="pointer-events-none absolute right-0 top-20 z-[1] h-80 w-80 rounded-full bg-[#DFFF04]/10 blur-[100px]" />
        <div className="relative z-10 mx-auto grid min-h-[720px] max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:py-20">
          <div className="contents md:block">
            <div className="order-1 text-center">
              <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.06] sm:text-5xl md:text-6xl">Sua casa em ordem com um sistema <span className="text-[#DFFF04]">visual e fácil de seguir.</span></h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-300 md:text-xl">20 guias visuais para decidir onde guardar, o que manter e como organizar cada ambiente sem depender de grandes faxinas.</p>
            </div>
            <div className="order-3 flex justify-center md:mt-8"><CtaButton onClick={openModal} label="Quero acessar os mapas" /></div>
          </div>
          <div className="order-2 relative mx-auto w-full max-w-md md:order-none">
            <img
              src="/kit-visual-casa-organizada.png"
              alt="Kit Visual Para Organizar Sua Casa com princípios japoneses, apresentado em computador, celular e guias impressos"
              className="relative block h-auto w-full rounded-3xl"
            />
            <div className="relative mt-4 grid grid-cols-4 overflow-hidden rounded-2xl border border-white/10 bg-[#153D2C] text-white shadow-2xl">
              {[
                { icon: Printer, title: 'Pronto para imprimir ou acessar no celular.' },
                { icon: Eye, title: 'Visual e intuitivo', text: 'Entenda rápido e aplique com facilidade.' },
                { icon: Zap, title: 'Ferramenta prática', text: 'Economize tempo e energia nas decisões.' },
                { icon: Home, title: 'Para toda a casa', text: 'Do quarto à cozinha, tudo no lugar.' },
              ].map((item) => (
                <div key={item.title} className="flex min-w-0 flex-col items-center border-r border-white/10 px-2 py-4 text-center last:border-r-0 sm:px-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DFFF04]/70 text-[#DFFF04]"><item.icon className="h-5 w-5" /></div>
                  <p className="mt-3 text-[9px] font-black uppercase leading-tight tracking-wide sm:text-[10px]">{item.title}</p>
                  {item.text && <p className="mt-1 text-[9px] font-black uppercase leading-tight tracking-wide text-white sm:text-[10px]">{item.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2 — DEMONSTRATIVO */}
      <section className="bg-[#F7F7F7] py-20"><div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center"><p className="eyebrow">Veja o material na prática</p><h2 className="section-title mx-auto max-w-3xl">Não é mais um conteúdo para assistir. É uma referência visual para usar.</h2><p className="section-copy mx-auto max-w-2xl">Cada página transforma uma decisão difícil em um caminho claro: olhar, escolher e aplicar no ambiente.</p></Reveal>
        <Reveal className="mt-12 overflow-hidden py-4">
          <div className="showcase-track flex w-max gap-5">
            {[...demoImages, ...demoImages].map((image, i) => (
              <div key={`${image.src}-${i}`} aria-hidden={i >= demoImages.length} className="w-[72vw] max-w-sm shrink-0 md:w-[340px]">
                <img src={image.src} alt={i < demoImages.length ? image.alt : ''} loading="lazy" className="block h-auto w-full rounded-2xl border border-neutral-200 bg-white shadow-lg" />
              </div>
            ))}
          </div>
        </Reveal>
      </div></section>

      {/* 3 — BENEFÍCIOS */}
      <section className="bg-[#2C2C2C] py-20 text-white"><div className="mx-auto max-w-6xl px-5"><Reveal className="text-center"><p className="eyebrow-light">O que muda na sua rotina</p><h2 className="section-title mx-auto max-w-3xl text-white">Um sistema criado para facilitar a organização — e a manutenção.</h2></Reveal><div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">{[
        { icon: Clock3, title: 'Menos tempo decidindo', desc: 'Os fluxos mostram por onde começar e qual será o próximo passo.' },
        { icon: Map, title: 'Um lugar para cada coisa', desc: 'Crie zonas claras para guardar e devolver cada item.' },
        { icon: Package, title: 'Menos acúmulo', desc: 'Use critérios visuais para manter, doar ou descartar.' },
        { icon: Home, title: 'Casa fácil de manter', desc: 'Transforme organização em pequenas ações recorrentes.' },
      ].map((item) => <article key={item.title} className="bg-[#2C2C2C] p-7"><item.icon className="h-8 w-8 text-[#DFFF04]" /><h3 className="mt-6 text-lg font-black">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-400">{item.desc}</p></article>)}</div></div></section>

      {/* 4 — URGÊNCIA */}
      <section className="bg-red-600 px-5 py-16 text-center text-white"><Reveal><p className="text-xs font-black uppercase tracking-[.2em]">Você não precisa esperar a próxima faxina</p><h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black leading-tight md:text-5xl">Comece pelo ambiente que mais pesa na sua rotina. Um guia, uma decisão, um passo de cada vez.</h2><button onClick={openModal} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-white">Quero começar com clareza<ArrowRight className="h-5 w-5" /></button></Reveal></section>

      {/* 5 — IDEAL PARA */}
      <section className="bg-[#EEEEEE] py-20"><div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center"><h2 className="text-3xl font-black uppercase leading-tight text-red-600 md:text-4xl">Ideal para você que deseja:</h2></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{[
          { icon: Map, title: 'Clareza para começar', text: 'Descubra qual ambiente precisa de atenção primeiro, sem tentar organizar a casa inteira de uma só vez.' },
          { icon: Home, title: 'Um lugar para cada coisa', text: 'Crie posições lógicas para os objetos e evite que eles voltem a ficar espalhados pela casa.' },
          { icon: Clock3, title: 'Mais tempo e leveza', text: 'Reduza o tempo gasto procurando, guardando e reorganizando os mesmos espaços todos os dias.' },
        ].map((item, i) => <Reveal key={item.title} delay={i * 90}><article className="h-full rounded-2xl bg-white p-6 shadow-sm"><item.icon className="h-12 w-12 stroke-[1.8] text-neutral-950" /><h3 className="mt-6 text-lg font-black leading-tight text-red-600">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.text}</p></article></Reveal>)}</div>
        <Reveal className="mt-5"><article className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8"><Users className="h-14 w-14 shrink-0 stroke-[1.8] text-neutral-950" /><div><h3 className="text-lg font-black leading-tight text-red-600">Uma organização prática para toda a casa</h3><p className="mt-3 leading-relaxed text-neutral-600">Crie uma rotina que outras pessoas consigam entender, organize usando o que já possui e consulte as instruções rapidamente pelo celular ou em páginas impressas.</p></div></article></Reveal>
      </div></section>

      {/* 6 — CONFIANÇA */}
      <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-5"><Reveal><div className="grid overflow-hidden rounded-3xl border border-neutral-200 md:grid-cols-[.8fr_1.2fr]"><div className="flex min-h-64 flex-col justify-between bg-neutral-950 p-8 text-white md:p-10"><ShieldCheck className="h-12 w-12 text-[#DFFF04]" /><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#DFFF04]">Transparência primeiro</p><h2 className="mt-3 text-3xl font-black">Produto em lançamento</h2></div></div><div className="p-8 md:p-10"><h3 className="text-2xl font-black">Sem depoimentos inventados.</h3><p className="mt-4 leading-relaxed text-neutral-600">As avaliações serão publicadas somente depois que as primeiras compradoras enviarem relatos reais. Até lá, avalie a proposta pelo que o kit entrega:</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{['20 guias visuais', 'Organização por ambientes', 'Consulta pelo celular', 'Passos simples e objetivos'].map((item) => <div key={item} className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-5 w-5 text-lime-700" />{item}</div>)}</div></div></div></Reveal></div></section>

      {/* 7 — PRODUTO PRINCIPAL */}
      <section className="bg-[#2C2C2C] py-20 text-white"><div className="mx-auto max-w-6xl px-5"><Reveal className="text-center"><p className="eyebrow-light">Produto principal</p><h2 className="section-title text-white">20 Guias Visuais para uma Casa Organizada</h2><p className="section-copy mx-auto max-w-2xl text-neutral-400">Um material separado por ambientes e decisões para você consultar exatamente quando precisar.</p></Reveal><div className="mt-12 grid items-start gap-10 lg:grid-cols-[.85fr_1.15fr]"><Reveal><div className="rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl"><div className="rounded-2xl bg-neutral-100 p-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-[#DFFF04]"><Home className="h-8 w-8" /></div><p className="mt-7 text-sm font-black uppercase tracking-[.22em] text-lime-700">Kit visual</p><h3 className="mt-2 text-4xl font-black">Casa em Ordem</h3><p className="mt-3 text-neutral-600">Sistema 5S adaptado para a vida real</p></div><div className="mt-5 flex items-center justify-around text-center"><div><p className="text-2xl font-black">20</p><p className="text-xs text-neutral-500">guias</p></div><div className="h-10 w-px bg-neutral-200" /><div><Smartphone className="mx-auto h-6 w-6" /><p className="mt-1 text-xs text-neutral-500">digital</p></div><div className="h-10 w-px bg-neutral-200" /><div><Printer className="mx-auto h-6 w-6" /><p className="mt-1 text-xs text-neutral-500">imprimível</p></div></div></div></Reveal><div className="grid gap-3 sm:grid-cols-2">{guides.map((guide, i) => <div key={guide} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DFFF04] text-xs font-black text-neutral-950">{String(i + 1).padStart(2, '0')}</span><span className="text-sm font-semibold text-neutral-200">Guia visual: {guide}</span></div>)}</div></div></div></section>

      {/* 8 — BÔNUS */}
      <section className="bg-[#2C2C2C] pb-20 text-white"><div className="mx-auto max-w-6xl border-t border-white/10 px-5 pt-20"><Reveal className="text-center"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#DFFF04] px-4 py-2 text-xs font-black uppercase tracking-widest text-neutral-950"><Gift className="h-4 w-4" />Plano completo</div><h2 className="section-title text-white">Além dos 20 guias, você recebe 3 bônus.</h2></Reveal><div className="mt-12 grid gap-5 md:grid-cols-3">{bonuses.map((bonus, i) => <Reveal key={bonus.title} delay={i * 100}><article className="h-full rounded-2xl border border-white/10 bg-white/5 p-6"><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DFFF04] text-neutral-950"><bonus.icon className="h-6 w-6" /></div><span className="text-4xl font-black text-white/10">{bonus.number}</span></div><h3 className="mt-7 text-xl font-black">{bonus.title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-400">{bonus.description}</p></article></Reveal>)}</div></div></section>

      {/* 9 — OFERTA */}
      <section id="oferta" className="bg-[#EEEEEE] py-20"><div className="mx-auto max-w-6xl px-5"><Reveal className="text-center"><p className="eyebrow">Escolha a melhor opção</p><h2 className="section-title">Comece com os guias ou leve a experiência completa.</h2><p className="section-copy mx-auto max-w-2xl">Como o checkout ainda não está disponível, o botão cadastra seu interesse para receber o link de lançamento.</p></Reveal><div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <Reveal><article className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm"><p className="text-xs font-black uppercase tracking-[.2em] text-neutral-500">Plano básico</p><h3 className="mt-3 text-2xl font-black">Kit Visual</h3><p className="mt-2 text-neutral-500">Para começar com os 20 guias principais.</p><div className="my-7"><span className="text-5xl font-black">R$ 17,90</span><p className="mt-1 text-sm text-neutral-500">pagamento único</p></div><div className="mb-8 space-y-3">{['20 guias visuais', 'Material 100% digital', 'Consulta pelo celular', 'Arquivos para impressão'].map((item) => <p key={item} className="flex items-center gap-2 font-semibold"><Check className="h-5 w-5 text-lime-700" />{item}</p>)}</div><CtaButton onClick={openModal} label="Quero o plano básico" /></article></Reveal>
        <Reveal delay={120}><article className="relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-neutral-950 bg-neutral-950 p-7 text-white shadow-2xl"><div className="absolute right-0 top-0 rounded-bl-2xl bg-[#DFFF04] px-4 py-2 text-xs font-black uppercase tracking-widest text-neutral-950">Mais completo</div><p className="text-xs font-black uppercase tracking-[.2em] text-[#DFFF04]">Plano completo</p><h3 className="mt-3 text-2xl font-black">Kit + 3 bônus</h3><p className="mt-2 text-neutral-400">Para aplicar e manter o sistema com mais apoio.</p><div className="my-7"><span className="text-5xl font-black">R$ 27,90</span><p className="mt-1 text-sm text-neutral-400">pagamento único</p></div><div className="mb-8 space-y-3">{['Tudo do plano básico', 'Rotina de 15 minutos', 'Guia de primeiros passos', 'Envolvendo a família'].map((item) => <p key={item} className="flex items-center gap-2 font-semibold"><Check className="h-5 w-5 text-[#DFFF04]" />{item}</p>)}</div><CtaButton onClick={openModal} label="Quero o plano completo" /></article></Reveal>
      </div></div></section>

      {/* 10 — FAQ */}
      <section className="bg-white py-20"><div className="mx-auto max-w-3xl px-5"><Reveal className="text-center"><p className="eyebrow">Perguntas frequentes</p><h2 className="section-title">Antes de escolher seu plano</h2></Reveal><div className="mt-10 space-y-3">{[
        { q: 'O material funciona em casas pequenas?', a: 'Sim. Os princípios de classificação, definição de lugares e manutenção podem ser adaptados a casas e apartamentos de diferentes tamanhos.' },
        { q: 'Preciso comprar organizadores?', a: 'Não. A proposta é avaliar e organizar primeiro o que você já possui. Depois, você decide se algum organizador realmente é necessário.' },
        { q: 'Como vou receber o kit?', a: 'O kit será digital. Quando o checkout estiver pronto, os detalhes de acesso e entrega serão informados claramente antes da compra.' },
        { q: 'Posso usar pelo celular?', a: 'Sim. Os guias foram pensados para consulta digital e também poderão ser impressos.' },
        { q: 'Qual é a diferença entre os planos?', a: 'O básico inclui os 20 guias. O completo reúne os mesmos guias e mais os três bônus apresentados nesta página.' },
        { q: 'O checkout já está disponível?', a: 'Ainda não. Por enquanto, entre na lista de interesse para receber o aviso assim que a compra for liberada.' },
      ].map((item) => <FaqItem key={item.q} question={item.q} answer={item.a} />)}</div></div></section>

      {/* 11 — RODAPÉ */}
      <footer className="bg-black py-12 text-white"><div className="mx-auto max-w-6xl px-5"><div className="flex flex-col items-center justify-between gap-6 border-b border-white/10 pb-8 md:flex-row"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DFFF04] text-neutral-950"><Home className="h-5 w-5" /></div><div><p className="font-black">Casa em Ordem</p><p className="text-xs text-neutral-500">Kit visual de organização</p></div></div><button onClick={openModal} className="flex items-center gap-2 text-sm font-bold text-[#DFFF04]">Entrar na lista de interesse<ArrowRight className="h-4 w-4" /></button></div><div className="flex flex-col items-center justify-between gap-3 pt-8 text-center text-xs text-neutral-500 md:flex-row md:text-left"><p>© 2026 Casa em Ordem. Todos os direitos reservados.</p><p>Resultados variam conforme a rotina e a aplicação do material.</p></div></div></footer>
    </div>
  );
}
