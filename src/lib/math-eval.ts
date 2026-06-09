/**
 * Безпечний обчислювач арифметичних виразів.
 * Підтримує: + - * / × ÷ − , числа, дужки.
 * Не використовує eval / Function.
 */
type Token =
  | { type: 'num'; value: number }
  | { type: 'op'; value: '+' | '-' | '*' | '/' }
  | { type: 'lp' }
  | { type: 'rp' };

function tokenize(expr: string): Token[] {
  const s = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s+/g, '');
  const tokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9') {
      let j = i;
      while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) j++;
      tokens.push({ type: 'num', value: parseFloat(s.slice(i, j)) });
      i = j;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'lp' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rp' });
      i++;
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      // унарний мінус: на початку або після іншої операції/дужки
      const prev = tokens[tokens.length - 1];
      if (ch === '-' && (!prev || prev.type === 'op' || prev.type === 'lp')) {
        // парсимо як -число
        let j = i + 1;
        while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) j++;
        if (j > i + 1) {
          tokens.push({ type: 'num', value: -parseFloat(s.slice(i + 1, j)) });
          i = j;
          continue;
        }
      }
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    throw new Error(`Unknown char: ${ch}`);
  }
  return tokens;
}

// Простий рекурсивний descent: expr = term ((+/-) term)*; term = factor ((*//) factor)*;
// factor = number | '(' expr ')'
function parse(tokens: Token[]): number {
  let pos = 0;
  function peek(): Token | undefined {
    return tokens[pos];
  }
  function consume(): Token {
    return tokens[pos++];
  }
  function factor(): number {
    const t = consume();
    if (!t) throw new Error('Unexpected end');
    if (t.type === 'num') return t.value;
    if (t.type === 'lp') {
      const v = expr();
      const close = consume();
      if (!close || close.type !== 'rp') throw new Error('Expected )');
      return v;
    }
    throw new Error('Expected number or (');
  }
  function term(): number {
    let v = factor();
    while (peek()?.type === 'op' && (peek() as { value: string }).value.match(/[*/]/)) {
      const op = (consume() as { value: '*' | '/' }).value;
      const r = factor();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  }
  function expr(): number {
    let v = term();
    while (peek()?.type === 'op' && (peek() as { value: string }).value.match(/[+-]/)) {
      const op = (consume() as { value: '+' | '-' }).value;
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  return expr();
}

export function evalExpression(expression: string): number {
  return parse(tokenize(expression));
}
