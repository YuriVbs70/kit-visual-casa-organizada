import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Check, CheckCircle2, ChevronDown, CircleAlert,
  Clock3, Eye, Facebook, Home, Instagram, Loader2, Lock, Map,
  Package, Printer, Quote, ShoppingBag,
  TimerReset, Users, X, Zap,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type ModalState = 'idle' | 'submitting' | 'success' | 'error';

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

const testimonials = [
  { name: 'Marina G.', location: 'Curitiba — PR', comment: 'Eu nunca arrumei tudo tão rápido.', source: 'Instagram', photo: '/cliente-marina.jpg' },
  { name: 'Fernanda S.', location: 'Guarulhos — SP', comment: 'Meu marido chegou do trabalho e ficou chocado com a casa. Me ajudou muito.', source: 'Instagram', photo: '/cliente-fernanda.jpg' },
  { name: 'Vanilda C.', location: 'Sinop — MT', comment: 'Muito legal! Deixei colado na parede para sempre conseguir ver.', source: 'Facebook', photo: '/cliente-vanilda.jpg' },
  { name: 'Luana P.', location: 'Recife — PE', comment: 'Consegui mais tempo para meu filho e, depois, até ele me ajudou a manter a casa arrumada.', source: 'Facebook', photo: '/cliente-luana.jpg' },
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
        <div className="h-2 bg-[#E98B7C]" />
        <button onClick={onClose} className="absolute right-4 top-5 rounded-full p-2 text-neutral-500 hover:bg-neutral-100" aria-label="Fechar"><X className="h-5 w-5" /></button>
        {state === 'success' ? (
          <div className="px-8 py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBE4DF]"><CheckCircle2 className="h-9 w-9 text-[#A64238]" /></div>
            <h2 id="lead-title" className="text-2xl font-extrabold">Você está na lista!</h2>
            <p className="mt-3 leading-relaxed text-neutral-600">Obrigada, {name.split(' ')[0] || 'visitante'}. Avisaremos quando o checkout estiver disponível.</p>
            <button onClick={onClose} className="mt-7 rounded-xl bg-neutral-900 px-6 py-3 font-bold text-white">Fechar</button>
          </div>
        ) : (
          <div className="p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#B65347]">Lista de interesse</p>
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

function CtaButton({ onClick, label = 'Quero conhecer o kit', variant = 'default' }: { onClick: () => void; label?: string; variant?: 'default' | 'maps' }) {
  const colors = variant === 'maps'
    ? 'bg-[#B8EFA4] text-[#17391F] shadow-[0_10px_32px_rgba(184,239,164,.42)] ring-1 ring-white/40 hover:bg-[#A8E68F]'
    : 'bg-[#D9796B] text-white shadow-[0_10px_30px_rgba(217,121,107,.24)] hover:bg-[#C96659]';
  return <button onClick={onClick} className={`group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide transition active:scale-[.98] ${colors}`}>{label}<ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></button>;
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
  return <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#5C4942] bg-[#3A302C]/95 p-3 backdrop-blur transition-transform md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}><button onClick={onClick} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8EFA4] px-5 py-3.5 font-extrabold text-[#17391F] shadow-[0_8px_24px_rgba(184,239,164,.38)] ring-1 ring-white/40">Quero acessar os mapas<ArrowRight className="h-5 w-5" /></button></div>;
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
  const scrollToCompleteOffer = () => document.getElementById('oferta-completa')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <StickyCta onClick={scrollToCompleteOffer} />

      {/* 1 — VENDA DIRETA */}
      <header className="relative overflow-hidden bg-[#3E332F] text-white">
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#3E332F]/88 via-[#3E332F]/72 to-[#3E332F]/46"
        />
        <div className="pointer-events-none absolute right-0 top-20 z-[1] h-80 w-80 rounded-full bg-[#F3C8BF]/20 blur-[100px]" />
        <div className="relative z-10 mx-auto grid min-h-[720px] max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:py-20">
          <div className="contents md:block">
            <div className="order-1 text-center">
              <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.06] sm:text-5xl md:text-6xl">20 mapas visuais com princípios japoneses que irão deixar sua <span className="text-[#F2A99D]">casa sempre arrumada.</span></h1>
              <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-[#FFF3EC] drop-shadow-sm md:text-xl">Tenha mais tempo para aproveitar folgas e descansos em casa.</p>
            </div>
            <div className="order-3 flex justify-center md:mt-8"><CtaButton onClick={scrollToCompleteOffer} label="Quero acessar os mapas" variant="maps" /></div>
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F2A99D]/70 text-[#F2A99D]"><item.icon className="h-5 w-5" /></div>
                  <p className="mt-3 text-[9px] font-black uppercase leading-tight tracking-wide sm:text-[10px]">{item.title}</p>
                  {item.text && <p className="mt-1 text-[9px] font-black uppercase leading-tight tracking-wide text-white sm:text-[10px]">{item.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2 — DEMONSTRATIVO */}
      <section className="bg-[#FFF8F3] py-20"><div className="mx-auto max-w-6xl px-5">
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
      <section className="bg-[#3A302C] py-20 text-white"><div className="mx-auto max-w-6xl px-5"><Reveal className="text-center"><p className="eyebrow-light">O que muda na sua rotina</p><h2 className="section-title mx-auto max-w-3xl text-white">Um sistema criado para facilitar a organização — e a manutenção.</h2></Reveal><div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">{[
        { icon: Clock3, title: 'Menos tempo decidindo', desc: 'Os fluxos mostram por onde começar e qual será o próximo passo.' },
        { icon: Map, title: 'Um lugar para cada coisa', desc: 'Crie zonas claras para guardar e devolver cada item.' },
        { icon: Package, title: 'Menos acúmulo', desc: 'Use critérios visuais para manter, doar ou descartar.' },
        { icon: Home, title: 'Casa fácil de manter', desc: 'Transforme organização em pequenas ações recorrentes.' },
      ].map((item) => <article key={item.title} className="bg-[#3A302C] p-7"><item.icon className="h-8 w-8 text-[#F2A99D]" /><h3 className="mt-6 text-lg font-black">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#D9C9C2]">{item.desc}</p></article>)}</div></div></section>

      {/* 4 — URGÊNCIA */}
      <section className="bg-red-600 px-5 py-16 text-center text-white"><Reveal><p className="text-xs font-black uppercase tracking-[.2em]">Você não precisa esperar a próxima faxina</p><h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black leading-tight md:text-5xl">Comece pelo ambiente que mais pesa na sua rotina. Um guia, uma decisão, um passo de cada vez.</h2><button onClick={openModal} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-white">Quero começar com clareza<ArrowRight className="h-5 w-5" /></button></Reveal></section>

      {/* 5 — IDEAL PARA */}
      <section className="bg-[#F7EEE8] py-20"><div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center"><h2 className="text-3xl font-black uppercase leading-tight text-red-600 md:text-4xl">Ideal para você que deseja:</h2></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{[
          { icon: Map, title: 'Clareza para começar', text: 'Descubra qual ambiente precisa de atenção primeiro, sem tentar organizar a casa inteira de uma só vez.' },
          { icon: Home, title: 'Um lugar para cada coisa', text: 'Crie posições lógicas para os objetos e evite que eles voltem a ficar espalhados pela casa.' },
          { icon: Clock3, title: 'Mais tempo e leveza', text: 'Reduza o tempo gasto procurando, guardando e reorganizando os mesmos espaços todos os dias.' },
        ].map((item, i) => <Reveal key={item.title} delay={i * 90}><article className="h-full rounded-2xl bg-white p-6 shadow-sm"><item.icon className="h-12 w-12 stroke-[1.8] text-neutral-950" /><h3 className="mt-6 text-lg font-black leading-tight text-red-600">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.text}</p></article></Reveal>)}</div>
        <Reveal className="mt-5"><article className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8"><Users className="h-14 w-14 shrink-0 stroke-[1.8] text-neutral-950" /><div><h3 className="text-lg font-black leading-tight text-red-600">Uma organização prática para toda a casa</h3><p className="mt-3 leading-relaxed text-neutral-600">Crie uma rotina que outras pessoas consigam entender, organize usando o que já possui e consulte as instruções rapidamente pelo celular ou em páginas impressas.</p></div></article></Reveal>
      </div></section>

      {/* 6 — RELATOS */}
      <section className="bg-[#FFF8F3] py-20"><div className="mx-auto max-w-6xl px-5"><Reveal className="text-center"><p className="eyebrow">Relatos de quem já aplicou</p><h2 className="section-title mx-auto max-w-3xl">Casas mais leves, rotinas mais tranquilas.</h2><p className="section-copy mx-auto max-w-2xl">Experiências compartilhadas por clientes que usaram os mapas na rotina de casa.</p></Reveal><div className="mt-12 grid gap-5 md:grid-cols-2">{testimonials.map((testimonial, i) => <Reveal key={testimonial.name} delay={(i % 2) * 100}><article className="flex h-full flex-col rounded-3xl border border-[#E8D8D1] bg-white p-6 shadow-sm md:p-7"><div className="flex items-center gap-4"><img src={testimonial.photo} alt={`Foto de ${testimonial.name}`} loading="lazy" className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-[#F7EEE8]" /><div><h3 className="text-lg font-black text-[#3E332F]">{testimonial.name}</h3><p className="mt-1 text-sm font-semibold text-[#9A7067]">{testimonial.location}</p></div></div><div className="mt-6 flex flex-1 gap-3"><Quote className="h-7 w-7 shrink-0 fill-[#F3C8BF] text-[#D9796B]" /><p className="text-lg font-semibold leading-relaxed text-[#4A3D38]">“{testimonial.comment}”</p></div><div className="mt-6 flex items-center gap-2 border-t border-[#F0E2DC] pt-4 text-sm font-bold text-[#8C6A62]">{testimonial.source === 'Instagram' ? <Instagram className="h-5 w-5 text-[#C85C78]" /> : <Facebook className="h-5 w-5 text-[#5576A8]" />}Comentário feito no {testimonial.source}</div></article></Reveal>)}</div></div></section>

      {/* 7 — PRODUTO PRINCIPAL */}
      <section className="bg-[#3A302C] py-20 text-white"><div className="mx-auto max-w-6xl px-5"><Reveal className="text-center"><h2 className="section-title text-white">O que você irá receber</h2><p className="section-copy mx-auto max-w-2xl text-[#D9C9C2]">Um material separado por ambientes e decisões para você consultar exatamente quando precisar.</p></Reveal><Reveal className="mx-auto mt-12 max-w-5xl"><img src="/kit-visual-casa-organizada.png" alt="Mockup completo do Kit Visual para organizar a casa, com guias, computador, tablet e celular" loading="lazy" className="block h-auto w-full rounded-3xl" /></Reveal></div></section>

      {/* 8 — BÔNUS */}
      <section className="bg-[#3A302C] pb-20 text-white"><div className="mx-auto max-w-6xl border-t border-white/10 px-5 pt-20"><Reveal className="text-center"><h2 className="section-title text-white">Além dos 20 guias, você recebe 3 bônus.</h2></Reveal><div className="mt-12 grid gap-5 md:grid-cols-3">{bonuses.map((bonus, i) => <Reveal key={bonus.title} delay={i * 100}><article className="h-full rounded-2xl border border-[#F2A99D]/20 bg-white/5 p-6"><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D9796B] text-white"><bonus.icon className="h-6 w-6" /></div><span className="text-4xl font-black text-white/10">{bonus.number}</span></div><h3 className="mt-7 text-xl font-black">{bonus.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#D9C9C2]">{bonus.description}</p></article></Reveal>)}</div><Reveal className="mt-16"><div className="rounded-3xl border border-[#5C4942] bg-[#2D2522] p-5 shadow-2xl md:p-8"><h3 className="text-center text-xl font-black md:text-2xl">Pronto em 3 passos — receba e comece a organizar</h3><div className="mt-7 grid gap-4 md:grid-cols-3">{[
        { step: 'Passo 1', title: 'Escolha seu plano', text: 'Compare as opções e escolha a que combina melhor com a rotina da sua casa.' },
        { step: 'Passo 2', title: 'Receba seu acesso', text: 'Após a confirmação da compra, receba o material digital diretamente no seu e-mail.' },
        { step: 'Passo 3', title: 'Aplique no seu ritmo', text: 'Acesse pelo celular ou imprima os mapas e comece pelo ambiente que mais precisa.' },
      ].map((item) => <article key={item.step} className="rounded-2xl border border-[#5C4942] bg-[#221C19] p-5"><span className="inline-flex rounded-full bg-[#F3D2C8] px-5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#6B3932]">{item.step}</span><h4 className="mt-5 font-black text-white">{item.title}</h4><p className="mt-3 text-sm leading-relaxed text-[#CDBCB4]">{item.text}</p></article>)}</div></div></Reveal></div></section>

      {/* 9 — OFERTA */}
      <section id="oferta" className="bg-[#F7EEE8] py-20"><div className="mx-auto max-w-6xl px-5"><Reveal className="text-center"><p className="eyebrow">Escolha a melhor opção</p><h2 className="section-title">Comece com os guias ou leve a experiência completa.</h2><p className="section-copy mx-auto max-w-2xl">Como o checkout ainda não está disponível, o botão cadastra seu interesse para receber o link de lançamento.</p></Reveal><div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <Reveal><article className="flex h-full flex-col rounded-3xl border border-[#E8D8D1] bg-[#FFFCFA] p-7 shadow-sm"><p className="text-xs font-black uppercase tracking-[.2em] text-[#9A7067]">Plano básico</p><h3 className="mt-3 text-2xl font-black">Kit Visual</h3><p className="mt-2 text-neutral-500">Para começar com os 20 guias principais.</p><div className="my-7"><span className="text-5xl font-black">R$ 17,90</span><p className="mt-1 text-sm text-neutral-500">pagamento único</p></div><div className="mb-8 space-y-3">{['20 guias visuais', 'Material 100% digital', 'Consulta pelo celular', 'Arquivos para impressão'].map((item) => <p key={item} className="flex items-center gap-2 font-semibold"><Check className="h-5 w-5 text-[#B65347]" />{item}</p>)}</div><CtaButton onClick={openModal} label="Quero o plano básico" variant="maps" /></article></Reveal>
        <Reveal delay={120}><article id="oferta-completa" className="relative flex h-full scroll-mt-8 flex-col overflow-hidden rounded-3xl border-2 border-[#6F8170] bg-[#596B5A] p-7 text-white shadow-2xl"><div className="absolute right-0 top-0 rounded-bl-2xl bg-[#F3C8BF] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#6B3932]">Mais completo</div><p className="text-xs font-black uppercase tracking-[.2em] text-[#F9DED8]">Plano completo</p><h3 className="mt-3 text-2xl font-black">Kit + 3 bônus</h3><p className="mt-2 text-[#E5DDD8]">Para aplicar e manter o sistema com mais apoio.</p><div className="my-7"><span className="text-5xl font-black">R$ 27,90</span><p className="mt-1 text-sm text-[#E5DDD8]">pagamento único</p></div><div className="mb-8 space-y-3">{['Tudo do plano básico', 'Rotina de 15 minutos', 'Guia de primeiros passos', 'Envolvendo a família'].map((item) => <p key={item} className="flex items-center gap-2 font-semibold"><Check className="h-5 w-5 text-[#F9DED8]" />{item}</p>)}</div><CtaButton onClick={openModal} label="Quero o plano completo" variant="maps" /></article></Reveal>
      </div></div></section>

      {/* 10 — FAQ */}
      <section className="bg-[#FFF8F3] py-20"><div className="mx-auto max-w-3xl px-5"><Reveal className="text-center"><p className="eyebrow">Perguntas frequentes</p><h2 className="section-title">Antes de escolher seu plano</h2></Reveal><div className="mt-10 space-y-3">{[
        { q: 'O material funciona em casas pequenas?', a: 'Sim. Os princípios de classificação, definição de lugares e manutenção podem ser adaptados a casas e apartamentos de diferentes tamanhos.' },
        { q: 'Preciso comprar organizadores?', a: 'Não. A proposta é avaliar e organizar primeiro o que você já possui. Depois, você decide se algum organizador realmente é necessário.' },
        { q: 'Como vou receber o kit?', a: 'O kit será digital. Quando o checkout estiver pronto, os detalhes de acesso e entrega serão informados claramente antes da compra.' },
        { q: 'Posso usar pelo celular?', a: 'Sim. Os guias foram pensados para consulta digital e também poderão ser impressos.' },
        { q: 'Qual é a diferença entre os planos?', a: 'O básico inclui os 20 guias. O completo reúne os mesmos guias e mais os três bônus apresentados nesta página.' },
        { q: 'O checkout já está disponível?', a: 'Ainda não. Por enquanto, entre na lista de interesse para receber o aviso assim que a compra for liberada.' },
      ].map((item) => <FaqItem key={item.q} question={item.q} answer={item.a} />)}</div></div></section>

      {/* 11 — RODAPÉ */}
      <footer className="bg-[#2D2522] py-12 text-white"><div className="mx-auto max-w-6xl px-5"><div className="flex flex-col items-center justify-between gap-6 border-b border-white/10 pb-8 md:flex-row"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9796B] text-white"><Home className="h-5 w-5" /></div><div><p className="font-black">Casa em Ordem</p><p className="text-xs text-[#BFAEA7]">Kit visual de organização</p></div></div><button onClick={openModal} className="flex items-center gap-2 text-sm font-bold text-[#F2A99D]">Entrar na lista de interesse<ArrowRight className="h-4 w-4" /></button></div><div className="flex flex-col items-center justify-between gap-3 pt-8 text-center text-xs text-[#9F8C84] md:flex-row md:text-left"><p>© 2026 Casa em Ordem. Todos os direitos reservados.</p><p>Resultados variam conforme a rotina e a aplicação do material.</p></div></div></footer>
    </div>
  );
}
