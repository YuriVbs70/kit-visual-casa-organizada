import { useEffect, useState, useRef } from 'react';
import {
  Check,
  ChevronDown,
  Clock,
  Star,
  Home,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Heart,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Users,
  Gift,
  Lock,
  ShoppingBag,
  Map,
  ListChecks,
  FileSearch,
  Trash2,
  Package,
  Bell,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

/* ------------------------------------------------------------------ */
/*  Lead Capture Modal                                                 */
/* ------------------------------------------------------------------ */

type ModalState = 'idle' | 'submitting' | 'success' | 'error';

function LeadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<ModalState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setState('idle');
      setErrorMsg('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('leads').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      source: 'sales_page',
    });

    if (error) {
      setState('error');
      setErrorMsg(
        'Não foi possível registrar seu interesse agora. Tente novamente em instantes.'
      );
      return;
    }
    setState('success');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Fechar"
        >
          <X size={22} />
        </button>

        {state === 'success' ? (
          <div className="px-8 py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-800">
              Interesse registrado!
            </h3>
            <p className="mb-6 text-slate-600 leading-relaxed">
              Obrigada, {name.split(' ')[0] || 'amiga'}! Recebemos seu contato e
              em breve você terá acesso à sua oferta especial.
            </p>
            <button
              onClick={onClose}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Fechar
            </button>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                <ShoppingBag className="h-7 w-7 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                Quero aproveitar a oferta
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Deixe seus dados para garantir sua condição especial antes que
                a oferta acabe.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {state === 'error' && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Garantir minha oferta
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5" />
              Seus dados estão seguros e não serão compartilhados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Countdown Timer                                                    */
/* ------------------------------------------------------------------ */

function useCountdown(minutes: number) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return { h: pad(h), m: pad(m), s: pad(s) };
}

function CountdownBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/15 text-3xl font-bold text-white tabular-nums backdrop-blur-sm md:h-20 md:w-20 md:text-4xl">
        {value}
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-white/70">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable CTA Button                                                */
/* ------------------------------------------------------------------ */

function CtaButton({
  onClick,
  label = 'Quero minha casa em ordem',
  className = '',
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-teal-600/25 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30 active:scale-[0.98] ${className}`}
    >
      {label}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Item                                                           */
/* ------------------------------------------------------------------ */

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-slate-800">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-teal-600 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-slate-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll Reveal Hook                                                 */
/* ------------------------------------------------------------------ */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky Mobile CTA                                                  */
/* ------------------------------------------------------------------ */

function StickyCta({ onClick }: { onClick: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-teal-700"
      >
        Quero minha casa em ordem
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main App                                                           */
/* ------------------------------------------------------------------ */

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const countdown = useCountdown(17);

  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-800 antialiased">
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <StickyCta onClick={openModal} />

      {/* ====================================================== */}
      {/* BLOCO 1 — VENDA DIRETA (ABERTURA)                       */}
      {/* ====================================================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

        <nav className="relative mx-auto flex max-w-6xl items-center justify-center px-5 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-600 px-5 py-2.5 text-white shadow-lg shadow-red-900/20">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide sm:text-base">
              Oferta termina em
            </span>
            <span className="rounded-md bg-white px-3 py-1 text-xl font-extrabold tabular-nums tracking-wider text-red-600 sm:text-2xl">
              {countdown.m}:{countdown.s}
            </span>
          </div>
        </nav>

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-10 md:pt-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Sistema 5S adaptado para a casa
              </div>
              <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
                Você arruma, mas a organização{' '}
                <span className="text-amber-200">nunca dura?</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-teal-50">
                Descubra o sistema de mapas visuais que transforma sua casa em
                um ambiente que se mantém organizado sozinho — sem faxinas
                exaustivas, sem desgaste, sem perder final de semana.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CtaButton onClick={openModal} />
                <div className="flex items-center gap-2 text-sm text-teal-50">
                  <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                  <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                  <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                  <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                  <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                  <span className="ml-1">+2.000 casas transformadas</span>
                </div>
              </div>
            </div>

            {/* Visual mockup */}
            <div className="relative">
              <div className="mx-auto max-w-sm rounded-2xl bg-white/95 p-5 shadow-2xl">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="rounded-lg bg-stone-100 p-4">
                  <div className="mb-3 flex items-center gap-2 text-teal-700">
                    <Map className="h-5 w-5" />
                    <span className="text-sm font-bold">
                      Mapa de Decisão — Cozinha
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Usa toda semana? → Guarda acessível',
                      'Usa às vezes? → Prateleira alto',
                      'Não usa há 6 meses? → DoadolDescarte',
                      'Item duplicado? → Fica só 1',
                    ].map((t) => (
                      <div
                        key={t}
                        className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs text-slate-700 shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* floating badge */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-amber-900 shadow-lg">
                <Zap className="h-4 w-4" />
                Acesso imediato
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================== */}
      {/* BLOCO 2 — DEMONSTRATIVO (PROVA VISUAL)                  */}
      {/* ====================================================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Veja o que você vai receber
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                Não é mais um curso teórico. É um sistema visual prático.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                Cada guia é um mapa de decisão que te diz exatamente onde
                guardar cada coisa. Você não precisa pensar — só seguir o
                fluxo.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Map,
                title: 'Mapas Visuais',
                desc: 'Fluxogramas coloridos que te guiam passo a passo em cada cômodo da casa.',
                color: 'bg-teal-50 text-teal-600',
              },
              {
                icon: ListChecks,
                title: 'Checklists',
                desc: 'Listas prontas para manutenção semanal em minutos, não em horas.',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: FileSearch,
                title: 'Guias de Decisão',
                desc: 'Perguntas simples que eliminam a dúvida: guardar, doar ou descartar.',
                color: 'bg-amber-50 text-amber-600',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="group rounded-2xl border border-slate-100 bg-stone-50 p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mockup gallery */}
          <Reveal delay={200}>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Cozinha', icon: Home },
                { label: 'Quartos', icon: Heart },
                { label: 'Banheiros', icon: Sparkles },
                { label: 'Área de Serviço', icon: Package },
              ].map((room, i) => (
                <div
                  key={room.label}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 p-6 text-white"
                >
                  <room.icon className="mb-3 h-8 w-8 opacity-80" />
                  <p className="font-semibold">{room.label}</p>
                  <p className="mt-1 text-xs text-white/70">
                    Guia visual completo
                  </p>
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 transition-transform group-hover:scale-150" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BLOCO 3 — BENEFÍCIOS DO PRODUTO                         */}
      {/* ====================================================== */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Por que funciona
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                A diferença entre arrumar e manter organizado
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Clock,
                title: 'Menos tempo organizando',
                desc: 'Sistema de manutenção em minutos por dia, não em horas de faxina.',
              },
              {
                icon: Map,
                title: 'Cada coisa em seu lugar',
                desc: 'Mapas visuais definem onde cada item vai — sem precisar pensar toda vez.',
              },
              {
                icon: Heart,
                title: 'Sem desgaste mental',
                desc: 'Tira a decisão da sua cabeça. O guia decide por você.',
              },
              {
                icon: Sparkles,
                title: 'Fim da bagunça migratória',
                desc: 'Organiza um espaço sem bagunçar outro — o sistema cobre a casa toda.',
              },
              {
                icon: Users,
                title: 'Toda a casa sabe onde guardar',
                desc: 'Mapas visuais são tão claros que qualquer pessoa da casa consegue seguir.',
              },
              {
                icon: Shield,
                title: 'Casa que se mantém sozinha',
                desc: 'O resultado dura semanas, não dias. A organização vira hábito automático.',
              },
            ].map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 120}>
                <div className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-slate-800">{b.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {b.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BLOCO 4 — HEADLINE DE URGÊNCIA                          */}
      {/* ====================================================== */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-1.5 text-sm font-semibold text-amber-300">
              <Clock className="h-4 w-4" />
              Oferta por tempo limitado
            </div>
            <h2 className="text-3xl font-extrabold text-white md:text-5xl">
              Não passe mais um final de semana inteiro organizando a casa.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
              Esta condição especial termina em breve. Depois, o valor retorna
              ao preço cheio.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 flex items-center justify-center gap-4 md:gap-6">
              <CountdownBox value={countdown.h} label="Horas" />
              <span className="text-3xl font-bold text-white/30">:</span>
              <CountdownBox value={countdown.m} label="Min" />
              <span className="text-3xl font-bold text-white/30">:</span>
              <CountdownBox value={countdown.s} label="Seg" />
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10">
              <CtaButton
                onClick={openModal}
                label="Garantir oferta agora"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BLOCO 5 — IDEAL PARA VOCÊ QUE DESEJA                    */}
      {/* ====================================================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Isso é para você?
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                Ideal para você que...
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              'Arruma a casa e dois dias depois parece que não fez nada.',
              'Não sabe onde colocar metade das coisas que tem em casa.',
              'Compra algo que já tinha porque não encontrou na hora.',
              'Perde tempo procurando objetos todo santo dia.',
              'Tem armários cheios, mas sensação de falta de espaço.',
              'Organiza um espaço e acaba bagunçando outro.',
              'Gasta horas em grandes faxinas que não duram.',
              'Sente que a casa nunca está realmente sob controle.',
            ].map((t, i) => (
              <Reveal key={i} delay={(i % 2) * 100}>
                <div className="flex items-start gap-3 rounded-xl bg-stone-50 p-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100">
                    <Check className="h-4 w-4 text-teal-600" />
                  </div>
                  <p className="text-slate-700">
                    <span className="italic">“{t}”</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-medium text-slate-700">
              Se você se reconheceu em qualquer uma dessas frases, este sistema
              foi criado para você.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BLOCO 6 — PROVA SOCIAL                                 */}
      {/* ====================================================== */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Quem já transformou
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                Mais de 2.000 casas em ordem
              </h2>
              <div className="mt-4 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-2 font-semibold text-slate-700">
                  4,9/5 · 1.247 avaliações
                </span>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Marina A.',
                text: 'Eu arrumava e dois dias depois estava tudo bagunçado de novo. Com os mapas visuais, pela primeira vez a organização durou. Mudou minha casa.',
                initials: 'MA',
                color: 'bg-teal-100 text-teal-700',
              },
              {
                name: 'Juliana R.',
                text: 'O guia da cozinha sozinho já valeu o investimento. Finalmente cada coisa tem um lugar e meu marido sabe onde guardar tudo.',
                initials: 'JR',
                color: 'bg-emerald-100 text-emerald-700',
              },
              {
                name: 'Patrícia M.',
                text: 'Parei de gastar final de semana inteiro organizando. Agora mantenho tudo em 15 minutos por dia. Não imaginava que fosse possível.',
                initials: 'PM',
                color: 'bg-amber-100 text-amber-700',
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-3 flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mb-5 flex-1 text-slate-700 leading-relaxed">
                    “{t.text}”
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.color}`}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-400">Cliente verificada</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BLOCO 7 — TUDO QUE VOCÊ VAI RECEBER                     */}
      {/* ====================================================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Produto principal
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                Tudo o que você vai receber
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                20 Guias Visuais de Organização Doméstica — mapas, fluxogramas e
                checklists para cada parte da sua casa.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Guia visual da Cozinha',
              'Guia visual da Geladeira e Despensa',
              'Guia visual dos Quartos',
              'Guia visual dos Armários e Guarda-roupas',
              'Guia visual dos Banheiros',
              'Guia visual da Área de Serviço',
              'Guia visual da Sala de Estar',
              'Guia visual da Sala de Jantar',
              'Guia visual da Home Office',
              'Guia visual das Áreas Externas',
              'Guia visual de Crianças e Brinquedos',
              'Guia visual de Documentos e Papéis',
              'Guia visual de Produtos de Limpeza',
              'Guia visual de Ferramentas e Manutenção',
              'Guia visual de Decoração e Acessórios',
              'Guia visual de Compras e Reposição',
              'Fluxograma: Guardar, Doar ou Descartar',
              'Fluxograma: Onde Começar Hoje',
              'Checklist de Manutenção Semanal',
              'Checklist de Manutenção Diária (15 min)',
            ].map((item, i) => (
              <Reveal key={item} delay={(i % 2) * 60}>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-stone-50 p-4 transition-colors hover:border-teal-200 hover:bg-teal-50/40">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BLOCO 8 — BÔNUS                                        */}
      {/* ====================================================== */}
      <section className="bg-gradient-to-br from-teal-50 to-emerald-50 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="mb-12 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700">
                <Gift className="h-4 w-4" />
                Bônus exclusivos
              </div>
              <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">
                E ainda tem mais 3 bônus
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                Para acelerar ainda mais a transformação da sua casa.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: 'Bônus 1: Rotina 15 Minutos',
                desc: 'Um plano de manutenção diária que mantém a casa em ordem em apenas 15 minutos por dia.',
                value: 'R$ 67',
              },
              {
                icon: Zap,
                title: 'Bônus 2: Guia Primeiros Passos',
                desc: 'Um roteiro de 7 dias para organizar a casa inteira sem se afogar em tarefas.',
                value: 'R$ 47',
              },
              {
                icon: Users,
                title: 'Bônus 3: Envolvendo a Família',
                desc: 'Estratégias práticas para que todos da casa participem da organização sem cobrança.',
                value: 'R$ 57',
              },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 120}>
                <div className="relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-bold text-slate-800">{b.title}</h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
                    {b.desc}
                  </p>
                  <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                    <span className="text-sm text-slate-400 line-through">
                      {b.value}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700">
                      Grátis hoje
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BLOCO 9 — OFERTA E VALORES                              */}
      {/* ====================================================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="mb-10 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Sua oferta
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                Tudo isso por uma fração do valor
              </h2>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="overflow-hidden rounded-3xl border-2 border-teal-200 bg-stone-50 shadow-xl">
              {/* top ribbon */}
              <div className="bg-teal-600 py-3 text-center text-sm font-bold uppercase tracking-wider text-white">
                Oferta especial — acesso imediato
              </div>

              <div className="p-8 md:p-12">
                {/* value stack */}
                <div className="mb-8 space-y-2">
                  {[
                    '20 Guias Visuais de Organização Doméstica',
                    'Bônus 1: Rotina 15 Minutos',
                    'Bônus 2: Guia Primeiros Passos',
                    'Bônus 3: Envolvendo a Família',
                    'Acesso imediato e vitalício',
                    'Garantia incondicional de 7 dias',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* price */}
                <div className="mb-8 rounded-2xl bg-white p-6 text-center shadow-sm">
                  <p className="text-sm text-slate-400">
                    Valor total de todos os itens
                  </p>
                  <p className="text-2xl font-bold text-slate-400 line-through">
                    R$ 497
                  </p>
                  <p className="mt-2 text-sm font-medium text-teal-600">
                    Hoje você leva tudo por apenas
                  </p>
                  <p className="text-5xl font-extrabold text-slate-800">
                    R$ 97
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    ou 12x de R$ 9,62
                  </p>
                </div>

                <CtaButton
                  onClick={openModal}
                  label="Quero minha casa em ordem"
                  className="w-full"
                />

                {/* trust badges */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    Compra 100% segura
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-emerald-500" />
                    Pagamento protegido
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Garantia de 7 dias
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BLOCO 10 — PERGUNTAS FREQUENTES                         */}
      {/* ====================================================== */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="mb-10 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Tire suas dúvidas
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                Perguntas frequentes
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {[
              {
                q: 'Funciona para casa pequena?',
                a: 'Sim! O sistema foi pensado justamente para quem tem pouco espaço. Os mapas visuais se adaptam a qualquer tamanho de casa ou apartamento — do studio à casa grande.',
              },
              {
                q: 'Preciso comprar organizadores caros?',
                a: 'Não. O sistema funciona com o que você já tem em casa. Os guias te ensinam a otimizar o espaço existente antes de qualquer compra nova.',
              },
              {
                q: 'Em quanto tempo vou ver resultado?',
                a: 'A maioria das nossas alunas relata mudança visível já nos primeiros 7 dias, usando o Guia Primeiros Passos que vem de bônus.',
              },
              {
                q: 'Não tenho tempo. Vai funcionar para mim?',
                a: 'O sistema foi criado justamente para quem tem rotina corrida. A manutenção diária leva 15 minutos — menos do que você gasta procurando coisas perdidas.',
              },
              {
                q: 'Como recebo o material?',
                a: 'O acesso é imediato e 100% digital. Você recebe todos os 20 guias e os 3 bônus assim que a compra é confirmada, e pode acessar de qualquer dispositivo.',
              },
              {
                q: 'E se eu não gostar?',
                a: 'Você tem 7 dias de garantia incondicional. Se não gostar por qualquer motivo, basta solicitar o reembolso e devolveremos cada centavo. Sem perguntas.',
              },
            ].map((item, i) => (
              <Reveal key={i} delay={(i % 2) * 80}>
                <FaqItem question={item.q} answer={item.a} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 text-center">
              <p className="mb-4 text-slate-600">
                Ainda com dúvidas? A oferta está acabando.
              </p>
              <CtaButton
                onClick={openModal}
                label="Garantir minha oferta"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================================================== */}
      {/* RODAPÉ                                                  */}
      {/* ====================================================== */}
      <footer className="bg-slate-900 py-12">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2 text-white">
              <Home className="h-6 w-6" />
              <span className="text-lg font-bold">Casa em Ordem</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contato
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            <p>
              © 2026 Casa em Ordem. Todos os direitos reservados.
            </p>
            <p className="mt-2">
              Este produto não substitui o bom senso e a adaptação à sua
              realidade doméstica. Resultados variam conforme a aplicação.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
