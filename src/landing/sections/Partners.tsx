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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* YaKids */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-5 border border-amber-100">
              <span className="font-black text-xl text-amber-600">YK</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
              Незабаром
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">YaKids</h3>
            <p className="text-slate-600 text-sm mb-4">
              Садок неповного дня. Безпечний та комфортний простір для розвитку ваших дітей.
            </p>
            <a href="https://yakids.com.ua" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 font-bold text-sm inline-flex items-center gap-1 transition-colors">
              yakids.com.ua <Globe size={14} />
            </a>
          </div>

          {/* YaKnow */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 border border-blue-100">
              <span className="font-black text-xl text-blue-600">YN</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
              Незабаром
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">YaKnow</h3>
            <p className="text-slate-600 text-sm mb-4">
              Новий освітній проєкт від сім'ї YaK. Слідкуйте за оновленнями.
            </p>
            <a href="https://yaknow.com.ua" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 font-bold text-sm inline-flex items-center gap-1 transition-colors">
              yaknow.com.ua <Globe size={14} />
            </a>
          </div>

          {/* YaKo */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 border border-emerald-100">
              <span className="font-black text-xl text-emerald-600">YK</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
              Незабаром
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">YaKo</h3>
            <p className="text-slate-600 text-sm mb-4">
              Технологічний простір та нові можливості для навчання. Деталі згодом.
            </p>
            <a href="https://yako.com.ua" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 font-bold text-sm inline-flex items-center gap-1 transition-colors">
              yako.com.ua <Globe size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
