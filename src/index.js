const set1 = ["-", "+"];
const set2 = ["*", "/", "^"];
const brackets = ["(", ")"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  const polandNotation = convertToPolandNotation(expr);
  const result = calculatePolandNotation(polandNotation);
  return result;
}

function convertToPolandNotation(str) {
  const polandNotation = [];
  const stack = [];
  let nextNumber = false;

  str = str.replace(/\s/g, "");

  for (let i = 0; i < str.length; i++) {
    let symbol = str[i];

    if (numbers.includes(symbol)) {
      // symbol is number
      symbol = parseInt(symbol);
      // check if number consists of more than one digit
      if (polandNotation.length !== 0 && !nextNumber) {
        polandNotation[polandNotation.length - 1] =
          polandNotation[polandNotation.length - 1] * 10 + symbol;
      } else {
        nextNumber = false;
        polandNotation.push(symbol);
      }
    } else if (brackets.includes(symbol)) {
      // if symbol is '(' or ')'
      nextNumber = true;

      // if bracket is '('
      if (symbol === brackets[0]) {
        stack.push(symbol);
      }
      // if symbol is ')' - push all operator after '(' to polandNotation
      else mergeStacks(polandNotation, stack, true);
    } else if (set2.includes(symbol)) {
      // if symbol is high operator
      nextNumber = true;

      popAllNotLowestOperators(polandNotation, stack, compareForSet2);

      stack.push(symbol);
    } else if (set1.includes(symbol)) {
      nextNumber = true;

      // if symbol is low operator
      popAllNotLowestOperators(polandNotation, stack, compareForSet1);
      stack.push(symbol);
    }
  }

  mergeStacks(polandNotation, stack);
  return polandNotation;
}

function popAllNotLowestOperators(polandNotation, stack, compareFunc) {
  if (stack.length > 0 && compareFunc(stack)) {
    polandNotation.push(stack.pop());
    popAllNotLowestOperators(polandNotation, stack, compareFunc);
  }
}

function compareForSet2(stack) {
  return set2.includes(stack[stack.length - 1]);
}

function compareForSet1(stack) {
  return set1.includes(stack[stack.length - 1]) || compareForSet2(stack);
}

function mergeStacks(polandNotation, stack, bracket = false) {
  let element;
  while (true) {
    element = stack.pop();

    if (!bracket && brackets.includes(element))
      throw "ExpressionError: Brackets must be paired";

    if (element === brackets[0]) return;

    polandNotation.push(element);

    if (bracket && stack.length === 0) {
      throw "ExpressionError: Brackets must be paired";
    } else if (stack.length === 0) return;
  }
}

function calculatePolandNotation(polandNotation) {
  const stack = [];
  polandNotation.forEach(element => {
    if (typeof element === "number") stack.push(element);
    else {
      const second = stack.pop();
      const first = stack.pop();
      stack.push(calculate(first, second, element));
    }
  });
  return stack[0];
}

function calculate(first, second, operator) {
  if (operator === "+") first += second;
  else if (operator === "-") first -= second;
  else if (operator === "*") first *= second;
  else if (operator === "^") first = Math.pow(first, second);
  else if (operator === "/") {
    if (second === 0) {
      throw "TypeError: Division by zero.";
    } else first /= second;
  }
  return first;
}

module.exports = {
  expressionCalculator
};

expressionCalculator("20 - 57 * 12 - (  58 + 84 * 32 / 27  )");
