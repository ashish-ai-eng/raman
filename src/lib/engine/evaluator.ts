/**
 * Safe Abstract Syntax Tree (AST) Math Evaluator
 * Evaluates mathematical expressions without using eval().
 */

export interface MathContext {
  [key: string]: number;
}

type TokenType = "NUMBER" | "IDENTIFIER" | "OPERATOR" | "LPAREN" | "RPAREN" | "COMMA";

interface Token {
  type: TokenType;
  value: string | number;
}

// Tokenizer / Lexer
function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numStr = "";
      while (i < expression.length && /[0-9.]/.test(expression[i])) {
        numStr += expression[i];
        i++;
      }
      tokens.push({ type: "NUMBER", value: parseFloat(numStr) });
      continue;
    }

    if (/[a-zA-Z_]/.test(char)) {
      let ident = "";
      while (i < expression.length && /[a-zA-Z0-9_]/.test(expression[i])) {
        ident += expression[i];
        i++;
      }
      tokens.push({ type: "IDENTIFIER", value: ident });
      continue;
    }

    if (char === "(") {
      tokens.push({ type: "LPAREN", value: "(" });
      i++;
      continue;
    }

    if (char === ")") {
      tokens.push({ type: "RPAREN", value: ")" });
      i++;
      continue;
    }

    if (char === ",") {
      tokens.push({ type: "COMMA", value: "," });
      i++;
      continue;
    }

    if (char === "=" && expression[i + 1] === "=") {
      tokens.push({ type: "OPERATOR", value: "==" });
      i += 2;
      continue;
    }

    if (char === "<" && expression[i + 1] === "=") {
      tokens.push({ type: "OPERATOR", value: "<=" });
      i += 2;
      continue;
    }

    if (char === ">" && expression[i + 1] === "=") {
      tokens.push({ type: "OPERATOR", value: ">=" });
      i += 2;
      continue;
    }

    if (char === "!" && expression[i + 1] === "=") {
      tokens.push({ type: "OPERATOR", value: "!=" });
      i += 2;
      continue;
    }

    if (char === "<") {
      tokens.push({ type: "OPERATOR", value: "<" });
      i++;
      continue;
    }

    if (char === ">") {
      tokens.push({ type: "OPERATOR", value: ">" });
      i++;
      continue;
    }

    if (["+", "-", "*", "/", "^", "%", "?", ":"].includes(char)) {
      tokens.push({ type: "OPERATOR", value: char });
      i++;
      continue;
    }

    throw new Error(`Unexpected character '${char}' in math expression.`);
  }

  return tokens;
}

// Recursive Descent Parser & Evaluator
class Parser {
  private tokens: Token[];
  private pos = 0;
  private context: MathContext;

  private builtInConstants: Record<string, number> = {
    PI: Math.PI,
    E: Math.E,
    G: 9.81,
  };

  private builtInFunctions: Record<string, (...args: number[]) => number> = {
    sqrt: Math.sqrt,
    abs: Math.abs,
    sin: (deg) => Math.sin((deg * Math.PI) / 180),
    cos: (deg) => Math.cos((deg * Math.PI) / 180),
    tan: (deg) => Math.tan((deg * Math.PI) / 180),
    asin: (val) => (Math.asin(val) * 180) / Math.PI,
    acos: (val) => (Math.acos(val) * 180) / Math.PI,
    atan: (val) => (Math.atan(val) * 180) / Math.PI,
    log: Math.log,
    log10: Math.log10,
    min: Math.min,
    max: Math.max,
    round: Math.round,
    floor: Math.floor,
    ceil: Math.ceil,
    pow: Math.pow,
  };

  constructor(tokens: Token[], context: MathContext) {
    this.tokens = tokens;
    this.context = context;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  parse(): number {
    if (this.tokens.length === 0) return 0;
    const result = this.parseExpression();
    if (this.pos < this.tokens.length) {
      throw new Error(`Unexpected token '${this.peek()?.value}' remaining.`);
    }
    return result;
  }

  private parseExpression(): number {
    return this.parseTernary();
  }

  private parseTernary(): number {
    const condition = this.parseComparison();

    if (this.peek() && this.peek()?.value === "?") {
      this.consume(); // ?
      const trueBranch = this.parseExpression();
      if (this.peek()?.value !== ":") {
        throw new Error("Missing ':' in ternary expression.");
      }
      this.consume(); // :
      const falseBranch = this.parseExpression();
      return condition ? trueBranch : falseBranch;
    }

    return condition;
  }

  private parseComparison(): number {
    let left = this.parseAdditive();

    while (
      this.peek() &&
      ["==", "!=", "<", ">", "<=", ">="].includes(String(this.peek()?.value))
    ) {
      const op = this.consume().value;
      const right = this.parseAdditive();
      if (op === "==") left = left === right ? 1 : 0;
      else if (op === "!=") left = left !== right ? 1 : 0;
      else if (op === "<") left = left < right ? 1 : 0;
      else if (op === ">") left = left > right ? 1 : 0;
      else if (op === "<=") left = left <= right ? 1 : 0;
      else if (op === ">=") left = left >= right ? 1 : 0;
    }

    return left;
  }

  private parseAdditive(): number {
    let left = this.parseTerm();

    while (this.peek() && (this.peek()?.value === "+" || this.peek()?.value === "-")) {
      const op = this.consume().value;
      const right = this.parseTerm();
      if (op === "+") left += right;
      if (op === "-") left -= right;
    }

    return left;
  }

  private parseTerm(): number {
    let left = this.parseFactor();

    while (this.peek() && (this.peek()?.value === "*" || this.peek()?.value === "/" || this.peek()?.value === "%")) {
      const op = this.consume().value;
      const right = this.parseFactor();
      if (op === "*") left *= right;
      if (op === "/") {
        if (right === 0) return NaN;
        left /= right;
      }
      if (op === "%") left %= right;
    }

    return left;
  }

  private parseFactor(): number {
    let left = this.parsePrimary();

    while (this.peek() && this.peek()?.value === "^") {
      this.consume(); // ^
      const right = this.parseFactor(); // Right associative
      left = Math.pow(left, right);
    }

    return left;
  }

  private parsePrimary(): number {
    const token = this.peek();

    if (!token) {
      throw new Error("Unexpected end of expression.");
    }

    if (token.type === "OPERATOR" && (token.value === "+" || token.value === "-")) {
      this.consume();
      const val = this.parsePrimary();
      return token.value === "-" ? -val : val;
    }

    if (token.type === "NUMBER") {
      this.consume();
      return token.value as number;
    }

    if (token.type === "IDENTIFIER") {
      const name = this.consume().value as string;

      // Check if it's a function call e.g., sqrt(x)
      if (this.peek() && this.peek()?.type === "LPAREN") {
        this.consume(); // (
        const args: number[] = [];

        if (this.peek()?.type !== "RPAREN") {
          args.push(this.parseExpression());
          while (this.peek() && this.peek()?.type === "COMMA") {
            this.consume(); // ,
            args.push(this.parseExpression());
          }
        }

        if (this.peek()?.type !== "RPAREN") {
          throw new Error(`Missing closing parenthesis in function '${name}'.`);
        }
        this.consume(); // )

        const func = this.builtInFunctions[name];
        if (!func) {
          throw new Error(`Unknown function '${name}'.`);
        }

        return func(...args);
      }

      // Check built-in constants
      if (name in this.builtInConstants) {
        return this.builtInConstants[name];
      }

      // Check context variable
      if (name in this.context) {
        return this.context[name];
      }

      throw new Error(`Undefined variable '${name}'.`);
    }

    if (token.type === "LPAREN") {
      this.consume(); // (
      const expr = this.parseExpression();
      if (this.peek()?.type !== "RPAREN") {
        throw new Error("Missing closing parenthesis.");
      }
      this.consume(); // )
      return expr;
    }

    throw new Error(`Unexpected token '${token.value}'.`);
  }
}

/**
 * Safely evaluates a mathematical expression string using context variables.
 * @param expression Math expression e.g. "(f * u) / (u - f)"
 * @param context Key-value map of input/variable values
 */
export function evaluateMath(expression: string, context: MathContext = {}): number {
  const trimmed = expression.trim();
  if (!trimmed) return 0;
  const tokens = tokenize(trimmed);
  const parser = new Parser(tokens, context);
  return parser.parse();
}
