/**
 * Звукові ефекти на базі Web Audio API — без зовнішніх файлів.
 * Генеруємо короткі тони/акорди прямо в браузері.
 *
 * Поважаємо налаштування користувача (`profile.settings.soundsEnabled`)
 * та політики автозапуску браузерів (AudioContext створюється «лінько»).
 */

type SoundEvent = 'correct' | 'wrong' | 'finish' | 'levelup' | 'tap';

let ctx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOptions {
  freq: number;
  durationMs: number;
  type?: OscillatorType;
  gain?: number;
  attackMs?: number;
  releaseMs?: number;
  delayMs?: number;
}

function tone({
  freq,
  durationMs,
  type = 'sine',
  gain = 0.18,
  attackMs = 8,
  releaseMs = 80,
  delayMs = 0,
}: ToneOptions): void {
  const ac = getCtx();
  if (!ac) return;
  const start = ac.currentTime + delayMs / 1000;
  const end = start + durationMs / 1000;
  const release = end + releaseMs / 1000;

  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);

  const g = ac.createGain();
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + attackMs / 1000);
  g.gain.setValueAtTime(gain, end);
  g.gain.exponentialRampToValueAtTime(0.0001, release);

  osc.connect(g).connect(ac.destination);
  osc.start(start);
  osc.stop(release + 0.02);
}

export function setSoundsEnabled(value: boolean): void {
  enabled = value;
}

/** Викликати з обробника користувацького тапу хоча б раз — щоб «розблокувати» AudioContext (iOS Safari). */
export function unlockAudio(): void {
  const ac = getCtx();
  if (ac && ac.state === 'suspended') void ac.resume();
}

export function playSound(event: SoundEvent): void {
  if (!enabled) return;
  switch (event) {
    case 'correct':
      // Висхідний C-E-G акорд: бадьорий «дзинь»
      tone({ freq: 523.25, durationMs: 90, type: 'triangle', gain: 0.15 });
      tone({ freq: 659.25, durationMs: 110, type: 'triangle', gain: 0.14, delayMs: 70 });
      tone({ freq: 783.99, durationMs: 180, type: 'triangle', gain: 0.16, delayMs: 150 });
      break;
    case 'wrong':
      // Низхідний F-D м'який «дзумф», без жорсткої атаки — щоб не лякав
      tone({ freq: 349.23, durationMs: 110, type: 'sine', gain: 0.16 });
      tone({ freq: 293.66, durationMs: 220, type: 'sine', gain: 0.18, delayMs: 90 });
      break;
    case 'finish':
      // Маленький фанфар C-E-G-C
      tone({ freq: 523.25, durationMs: 110, type: 'triangle', gain: 0.16 });
      tone({ freq: 659.25, durationMs: 110, type: 'triangle', gain: 0.16, delayMs: 110 });
      tone({ freq: 783.99, durationMs: 110, type: 'triangle', gain: 0.16, delayMs: 220 });
      tone({ freq: 1046.5, durationMs: 320, type: 'triangle', gain: 0.18, delayMs: 330 });
      break;
    case 'levelup':
      // Великий «вгору» — арпеджіо
      tone({ freq: 392, durationMs: 80, type: 'square', gain: 0.1 });
      tone({ freq: 523.25, durationMs: 80, type: 'square', gain: 0.1, delayMs: 80 });
      tone({ freq: 659.25, durationMs: 80, type: 'square', gain: 0.1, delayMs: 160 });
      tone({ freq: 1046.5, durationMs: 280, type: 'triangle', gain: 0.18, delayMs: 240 });
      break;
    case 'tap':
      tone({ freq: 600, durationMs: 30, type: 'sine', gain: 0.08, releaseMs: 30 });
      break;
  }
}
