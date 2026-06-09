import type { Difficulty, TopicId } from '@/store/profile';
import { randChoice } from '@/lib/random';
import { oralGenerators } from './generators/oral';
import { columnGenerators } from './generators/column';
import { orderGenerators } from './generators/order';
import { fractionGenerators } from './generators/fractions';
import { decimalGenerators } from './generators/decimals';
import { wordGenerators } from './generators/word';
import { unitsGenerators } from './generators/units';
import { geometryGenerators } from './generators/geometry';
import { logicGenerators } from './generators/logic';
import { equationsGenerators } from './generators/equations';
import type { Generator, Task } from './types';

const REGISTRY: Partial<Record<TopicId, Generator[]>> = {
  oral: oralGenerators,
  column: columnGenerators,
  order: orderGenerators,
  fractions: fractionGenerators,
  decimals: decimalGenerators,
  word: wordGenerators,
  units: unitsGenerators,
  geometry: geometryGenerators,
  logic: logicGenerators,
  equations: equationsGenerators,
};

export function isTopicAvailable(topicId: TopicId): boolean {
  return Boolean(REGISTRY[topicId]?.length);
}

export function generateTask(topicId: TopicId, difficulty: Difficulty): Task {
  const gens = REGISTRY[topicId];
  if (!gens || gens.length === 0) throw new Error(`No generators for topic: ${topicId}`);
  return randChoice(gens).generate(difficulty);
}

export function generateSession(topicId: TopicId, difficulty: Difficulty, count = 10): Task[] {
  return Array.from({ length: count }, () => generateTask(topicId, difficulty));
}
