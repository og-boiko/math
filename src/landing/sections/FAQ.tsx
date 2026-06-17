import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHead } from './Features';

const ITEMS = [
  {
    q: 'Це справді безкоштовно?',
    a: 'Так. Усі задачі, теми, ачивки і робочий стіл доступні безкоштовно. Без реклами та без преміуму. Якщо проєкт виросте — додамо опціональну підтримку, але доступ до навчання залишиться відкритим.',
  },
  {
    q: 'Скільки років дитині?',
    a: 'Оптимально 9–11 років (4–5 клас НУШ). Старші діти теж використовують для повторення, молодші — для випереджаючого навчання, починаючи з рівня 1.',
  },
  {
    q: 'Чи потрібна реєстрація?',
    a: 'Ні. Можна почати одразу — локальний профіль збережеться у браузері. Якщо хочете синхронізації між пристроями (телефон + планшет + ПК) — створіть акаунт за email.',
  },
  {
    q: 'Чи це працює офлайн?',
    a: 'Так. MathQuest — PWA: можна встановити на телефон і користуватися без інтернету. Прогрес синхронізується, як тільки з’явиться мережа.',
  },
  {
    q: 'Які дані ви збираєте?',
    a: 'Від дитини — мінімум: ім’я (можна вигадане), вік для калібрування. Жодних PII, GPS, контактів, мікрофона чи камери. Ваш email (якщо створюєте акаунт) використовуємо лише для входу.',
  },
  {
    q: 'Чим це краще за Khan Academy / SplashLearn?',
    a: 'Українська локалізація і програма НУШ. Робочий стіл (калькулятор + чернетка + помічник стовпчика), якого немає у конкурентів. Менше відволікань, більше фокусу на математиці.',
  },
  {
    q: 'Чи є контроль для батьків?',
    a: 'Так. PIN на батьківські налаштування, журнал помилок, статистика по темах і часу, можна вимкнути звуки чи робочий стіл, якщо дитина ним зловживає.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Часті питання"
          title="Відповіді на головне"
          desc="Якщо чогось не вистачає — напишіть нам, оновимо."
        />

        <ul className="mt-10 divide-y divide-slate-200 border border-slate-200 rounded-3xl bg-white overflow-hidden">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5
                    hover:bg-slate-50 transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg">{it.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 text-slate-600 leading-relaxed">{it.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
