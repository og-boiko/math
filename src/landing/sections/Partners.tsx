import { Globe, GraduationCap } from 'lucide-react';

export function Partners() {
  return (
    <section id="partners" className="py-20 sm:py-28 bg-slate-50/50 border-t border-slate-200">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1.5 rounded-full">
            Наші партнери
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Розвиваємося разом
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Проєкти, які допомагають дітям отримувати якісну та цікаву освіту в Україні та в Чернівцях.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex items-center justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
              <img
                src="/yakls-logo.png"
                alt="YaK Language School Logo"
                className="max-h-32 w-auto object-contain hover:scale-105 transition duration-300"
              />
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <GraduationCap size={14} />
                Офлайн та онлайн навчання іноземних мов у Чернівцях
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Мовна школа YaK Language School
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Якісне та сучасне вивчення іноземних мов (англійська, німецька, іспанська) для дітей та дорослих. Індивідуальний підхід, інтерактивні заняття та досвідчені викладачі, які закохують у знання з першого уроку.
              </p>
              <div className="pt-2">
                <a
                  href="https://yakls.com.ua/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/10 transition active:scale-95"
                >
                  Відвідати сайт YaK <Globe size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
