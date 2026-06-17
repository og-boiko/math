import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { generateTask } from '@/features/tasks/registry';
import { checkAnswer } from '@/lib/format';
import type { Task } from '@/features/tasks/types';
import type { TopicId } from '@/store/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TopicMetadata {
  name: string;
  emoji: string;
  shortDesc: string;
  rules: string;
  example: string;
  subtopics: string[];
  keywords: string;
}

const TOPICS_METADATA: Record<TopicId, TopicMetadata> = {
  oral: {
    name: 'Усний рахунок',
    emoji: '🧮',
    shortDesc: 'Швидке додавання, віднімання, множення та ділення в умі. Навчись рахувати швидше за калькулятор!',
    rules: 'Усний рахунок — це основа математичного мислення. Для швидкого обчислення розбивай числа на зручні доданки. Наприклад, додаючи 47 + 38, можна спочатку додати десятки (40 + 30 = 70), потім одиниці (7 + 8 = 15), а тоді скласти результати: 70 + 15 = 85. Або округлити: 47 + 40 - 2 = 85.',
    example: 'Обчислити в умі: 47 + 38 = 85 або 56 ÷ 4 = 14.',
    subtopics: ['Додавання та віднімання в межах 20, 100 та 1000', 'Таблиця множення та ділення', 'Ділення з остачею в умі'],
    keywords: 'усний рахунок, швидке додавання, таблиця множення, математичний тренажер, усне ділення з остачею'
  },
  column: {
    name: 'Письмові обчислення',
    emoji: '📝',
    shortDesc: 'Додавання, віднімання, множення та ділення у стовпчик та куточком для великих чисел.',
    rules: 'Для обчислень з великими числами використовують запис у стовпчик. Записуй розряд під розрядом (одиниці під одиницями, десятки під десятками). Множення починай з одиниць дільника. При діленні куточком виконуй послідовно: ділення, множення, віднімання, знесення наступної цифри.',
    example: '1234 × 56 = 69 104 або 504 ÷ 56 = 9.',
    subtopics: ['Додавання та віднімання багатоцифрових чисел у стовпчик', 'Множення у стовпчик (до 3-цифрових чисел)', 'Ділення куточком з остачею та нулями в частці'],
    keywords: 'письмові обчислення, множення в стовпчик, ділення куточком, приклади стовпчиком, ділення з остачею'
  },
  order: {
    name: 'Порядок дій',
    emoji: '🔢',
    shortDesc: 'Правила виконання математичних виразів з дужками, степенями та пріоритетом операцій.',
    rules: 'Математичні дії виконуються у такому порядку: 1) Спочатку піднесення до степеня (квадрат, куб). 2) Дії в дужках (від внутрішніх до зовнішніх). 3) Множення та ділення зліва направо. 4) Додавання та віднімання зліва направо.',
    example: 'Обчислити: (5 + 3) × 2² = 8 × 4 = 32.',
    subtopics: ['Вирази без дужок на 3-4 дії', 'Вирази з дужками та вкладеними дужками', 'Квадрати та куби чисел, прості рівняння зі степенями'],
    keywords: 'порядок дій, вирази з дужками, пріоритет операцій, піднесення до степеня, математичні вирази'
  },
  fractions: {
    name: 'Звичайні дроби',
    emoji: '½',
    shortDesc: 'Частини цілого, чисельник та знаменник, знаходження дробу від числа та порівняння дробів.',
    rules: 'Дріб показує частину від цілого. Знаменник (знизу) показує, на скільки рівних частин поділили ціле. Чисельник (зверху) — скільки таких частин взяли. Щоб знайти дріб від числа, поділи це число на знаменник і помнож на чисельник. Наприклад, 3/4 від 20: (20 ÷ 4) × 3 = 15.',
    example: 'Знайти 3/4 від 20: 15. Додати: 2/7 + 3/7 = 5/7.',
    subtopics: ['Знаходження дробу від числа та числа за його дробом', 'Додавання та віднімання дробів з однаковими знаменниками', 'Порівняння звичайних дробів'],
    keywords: 'звичайні дроби, знайти дріб від числа, порівняння дробів, додавання дробів, чисельник і знаменник'
  },
  decimals: {
    name: 'Десяткові дроби',
    emoji: '💯',
    shortDesc: 'Числа з комою, додавання, віднімання та множення/ділення на 10, 100, 1000.',
    rules: 'Десятковий дріб — це інший запис звичайного дробу, знаменник якого є розрядною одиницею (10, 100, 1000 тощо). При додаванні та відніманні десяткових дробів записуй числа так, щоб кома була під комою. При множенні на 10, 100, 1000 перенось кому праворуч на стільки знаків, скільки нулів у множнику.',
    example: '3,14 + 1,5 = 4,64. Обчислити: 2,5 × 100 = 250.',
    subtopics: ['Запис десяткових дробів з тексту', 'Множення та ділення на 10, 100, 1000', 'Додавання та віднімання десяткових дробів'],
    keywords: 'десяткові дроби, додавання десяткових дробів, числа з комою, множення на 10 100 1000, порівняння десяткових дробів'
  },
  word: {
    name: 'Текстові задачі',
    emoji: '📖',
    shortDesc: 'Задачі на рух, вартість, роботу, спільну роботу та приведення до одиниці.',
    rules: 'При розв’язанні текстових задач уважно читай умову та уявляй ситуацію. Для задач на рух використовуй формули: S = v × t (відстань = швидкість × час). Для задач на спільну роботу додавай продуктивності праці кожного робітника. Для приведення до одиниці спочатку знайди вартість/вагу однієї одиниці, а потім помнож на нову кількість.',
    example: 'Поїзд їде зі швидкістю 80 км/год. Яку відстань він подолає за 3 години? Відповідь: 240 км.',
    subtopics: ['Задачі на рух (в одному напрямку, назустріч, в протилежні боки)', 'Задачі на спільну роботу та вартість покупки', 'Задачі на приведення до одиниці та багатокрокові задачі'],
    keywords: 'текстові задачі, задачі на рух, задачі на спільну роботу, приведення до одиниці, задачі з математики 4 клас'
  },
  units: {
    name: 'Іменовані числа',
    emoji: '⚖️',
    shortDesc: 'Робота з одиницями довжини, маси та часу. Перетворення та додавання/віднімання.',
    rules: 'Іменовані числа містять одиниці вимірювання (наприклад, 2 м 30 см). Для роботи з ними перетворюй їх в однакові одиниці (бажано найменші). Пам’ятай співвідношення розрядів: 1 м = 100 см, 1 т = 10 ц = 1000 кг, 1 год = 60 хв.',
    example: 'Додати: 2 м 30 см + 80 см = 2 м 110 см = 3 м 10 см.',
    subtopics: ['Одиниці довжини (мм, см, дм, м, км)', 'Одиниці маси (г, кг, ц, т)', 'Одиниці часу (сек, хв, год, доба)'],
    keywords: 'іменовані числа, міри часу, одиниці маси, перетворення одиниць вимірювання, математика 4 клас'
  },
  geometry: {
    name: 'Геометрія',
    emoji: '📐',
    shortDesc: 'Периметр, площа фігур, кути в трикутниках та об\'єм прямокутного паралелепіпеда.',
    rules: 'Периметр (P) — це сума довжин усіх сторін. Для прямокутника: P = 2 × (a + b). Площа (S) — величина, що вимірює розмір поверхні. Для прямокутника: S = a × b. Сума кутів будь-якого трикутника завжди дорівнює 180 градусів. Об’єм прямокутного паралелепіпеда: V = a × b × c.',
    example: 'Знайти площу прямокутника зі сторонами 5 см і 4 см: S = 20 см².',
    subtopics: ['Периметр та площа квадрата, прямокутника та Г-подібних фігур', 'Кути (види кутів, сума кутів трикутника)', 'Об’єм прямокутного паралелепіпеда та куба'],
    keywords: 'геометрія 4 клас, площа прямокутника, периметр фігури, сума кутів трикутника, об\'єм паралелепіпеда'
  },
  logic: {
    name: 'Логіка та нестандартні задачі',
    emoji: '🧩',
    shortDesc: 'Цікаві послідовності, задачі на вік, комбінаторика, круги Ейлера та числові ребуси.',
    rules: 'Логічні задачі вимагають уважності та нестандартного підходу. У числових ребусах замінюй зірочки або літери цифрами, починаючи з найпростіших розрядів (наприклад, з одиниць при додаванні). Для кругов Ейлера використовуй графічні кола для візуалізації перетину множин.',
    example: 'Знайти наступне число: 1, 1, 2, 3, 5, ? Відповідь: 8 (числа Фібоначчі).',
    subtopics: ['Числові послідовності та ребуси', 'Задачі на вік та комбінаторику', 'Круги Ейлера (діаграми Венна)'],
    keywords: 'логічні задачі, числові ребуси, послідовності чисел, круги Ейлера, математична логіка'
  },
  equations: {
    name: 'Рівняння та нерівності',
    emoji: '=',
    shortDesc: 'Розв\'язання простих та складних рівнянь з дужками, а також подвійних нерівностей.',
    rules: 'Рівняння — це рівність, що містить змінну. Щоб знайти невідомий доданок, від суми відніми відомий доданок. Щоб знайти невідомий множник, добуток поділи на відомий множник. У рівняннях з дужками спочатку розцінюй дужку як один невідомий компонент.',
    example: 'Розв’язати рівняння: (x + 12) × 3 = 45. Тоді x + 12 = 15, x = 3.',
    subtopics: ['Прості рівняння на одну дію', 'Складні рівняння з дужками на кілька дій', 'Подвійні нерівності (знаходження цілих розв’язків)'],
    keywords: 'рівняння 4 клас, рівняння з дужками, подвійні нерівності, розв’язати рівняння, математичний тренажер'
  }
};

export function TopicSEO() {
  const { topicId } = useParams<{ topicId: string }>();

  const meta = TOPICS_METADATA[topicId as TopicId];

  // Держава для мікро-тренажера
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskIndex, setTaskIndex] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  // Валідація роута
  useEffect(() => {
    if (!meta) {
      window.location.href = '/';
    }
  }, [meta]);

  // Запуск нової задачі
  useEffect(() => {
    if (meta && topicId) {
      try {
        // Генеруємо просту задачу для демонстрації (Difficulty = 1 або 2)
        const t = generateTask(topicId as TopicId, 1);
        setCurrentTask(t);
        setIsSubmitted(false);
        setUserAnswer('');
        setShowHint(false);
        setHintIndex(0);
      } catch (err) {
        console.error('Error generating task:', err);
      }
    }
  }, [topicId, meta, taskIndex]);

  // Динамічне оновлення SEO-тегів
  useEffect(() => {
    if (meta) {
      const originalTitle = document.title;
      const originalDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');

      document.title = `YaKMath — Тренажер: ${meta.name} (4–5 клас НУШ)`;
      
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute('content', `${meta.shortDesc} Інтерактивні вправи, правила та мікро-тренажер онлайн.`);
      }

      return () => {
        document.title = originalTitle;
        if (descTag && originalDesc) {
          descTag.setAttribute('content', originalDesc);
        }
      };
    }
  }, [meta]);

  if (!meta || !currentTask) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const correct = checkAnswer(userAnswer, currentTask.correctAnswer);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (taskIndex < 3) {
      setTaskIndex((i) => i + 1);
    } else {
      // Редирект на гру
      window.location.href = '/app/welcome';
    }
  };

  const handleShowHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintIndex(0);
    } else if (hintIndex < currentTask.hints.length - 1) {
      setHintIndex((idx) => idx + 1);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen pb-16">
      {/* Шапка */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition"
          >
            <ArrowLeft size={20} />
            <span>На головну</span>
          </button>
          <div className="flex items-center gap-1.5 font-black text-brand-700 text-xl">
            🧠 YaKMath
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {/* Тема та опис */}
        <section className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <span className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-100 to-fuchsia-100 text-4xl grid place-items-center shadow-md">
              {meta.emoji}
            </span>
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Тема тренування
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                {meta.name}
              </h1>
            </div>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            {meta.shortDesc}
          </p>
        </section>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Правила та підтеми */}
          <div className="md:col-span-3 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-brand-500" />
                Як це працює? (Правила)
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                {meta.rules}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Приклад
                </div>
                <div className="font-mono text-sm bg-slate-50 p-2.5 rounded-xl text-slate-700 border border-slate-100">
                  {meta.example}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-extrabold text-slate-900 mb-3">
                Підтеми для підготовки
              </h2>
              <ul className="space-y-2.5">
                {meta.subtopics.map((sub, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-brand-500 mt-0.5">•</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Інтерактивний демонстраційний тренажер */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6 border-2 border-brand-200 shadow-xl shadow-brand-900/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-fuchsia-500" />
              
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-4">
                <span>Задача {taskIndex} з 3</span>
                <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                  Демо-режим
                </span>
              </div>

              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                {currentTask.subtopic}
              </div>

              {/* Задача */}
              <div className="text-2xl font-black text-slate-900 mb-6 min-h-[60px]">
                {currentTask.question}
              </div>

              {/* Форма відповіді */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-brand-500 outline-none text-lg text-center font-extrabold"
                    placeholder="Введи відповідь..."
                    autoFocus
                  />
                  <Button type="submit" fullWidth disabled={!userAnswer.trim()}>
                    Перевірити відповідь
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  {isCorrect ? (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-2">
                      <CheckCircle className="shrink-0 text-emerald-600 mt-0.5" size={18} />
                      <div>
                        <div className="font-extrabold text-sm">Правильно!</div>
                        <div className="text-xs text-emerald-700 mt-0.5">Ти молодець, так тримати!</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
                      <AlertCircle className="shrink-0 text-rose-600 mt-0.5" size={18} />
                      <div>
                        <div className="font-extrabold text-sm">Ой, помилка</div>
                        <div className="text-xs text-rose-700 mt-0.5">Правильна відповідь: <span className="font-bold">{currentTask.correctAnswer}</span></div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    <span className="font-bold block text-slate-700 mb-0.5">Пояснення:</span>
                    {currentTask.solution}
                  </div>

                  <Button onClick={handleNext} fullWidth variant="primary">
                    {taskIndex < 3 ? 'Наступна задача' : 'Грати повністю 🚀'}
                  </Button>
                </div>
              )}

              {/* Кнопка підказки */}
              {!isSubmitted && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={handleShowHint}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 transition self-start"
                  >
                    <Lightbulb size={14} />
                    <span>Потрібна підказка?</span>
                  </button>

                  {showHint && (
                    <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl mt-1 leading-relaxed">
                      {currentTask.hints[hintIndex]}
                      {hintIndex < currentTask.hints.length - 1 && (
                        <button
                          onClick={handleShowHint}
                          className="block mt-1 font-bold text-brand-600 hover:underline"
                        >
                          Наступна підказка →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 mx-auto grid place-items-center text-xl">
                🏆
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900">Готовий до квесту?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Повна версія тренажера пропонує гру, ачивки, кубки та хмарну синхронізацію результатів.
                </p>
              </div>
              <Button onClick={() => { window.location.href = '/app/welcome'; }} fullWidth size="sm">
                Почати гру безкоштовно
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
