import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';

const NAV = [
  { href: '#features', label: 'Можливості' },
  { href: '#how', label: 'Як це працює' },
  { href: '#topics', label: 'Теми' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/70 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="YaKMath — головна">
            <span
              className="w-9 h-9 rounded-xl grid place-items-center text-xl shadow-sm
                bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white"
              aria-hidden
            >
              🧠
            </span>
            <span className="font-extrabold text-lg tracking-tight">
              YaK<span className="text-brand-600">Math</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-brand-700 transition">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-3">
            <a
              href="/app"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full
                text-slate-600 font-bold hover:bg-slate-100 hover:text-brand-700 transition"
            >
              Увійти
            </a>
            <a
              href="/app/welcome"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-full
                bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md
                shadow-brand-600/20 transition"
            >
              Почати <ArrowRight size={16} />
            </a>
          </div>

          <button
            className="md:hidden w-10 h-10 -mr-2 grid place-items-center rounded-xl text-slate-700"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-5 py-4 grid gap-2 text-base font-semibold">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={close}
                className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
              >
                {n.label}
              </a>
            ))}
            <div className="h-px bg-slate-200 my-2" />
            <a
              href="/app"
              onClick={close}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl
                border-2 border-slate-200 text-slate-700 font-bold text-base hover:bg-slate-50"
            >
              <LogIn size={18} /> Увійти
            </a>
            <a
              href="/app/welcome"
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl
                bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-md"
              onClick={() => setOpen(false)}
            >
              Почати тренування <ArrowRight size={18} />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
