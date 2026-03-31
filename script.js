const Operator = {
    ADD: '+',
    SUBTRACT: '–',
    MULTIPLY: '×',
    DIVIDE: '÷',
    PERCENT: '%',
}

const unclearNumbers = document.querySelector('.calc-screen .unclear');
const resultNumbers = document.querySelector('.screen-numbers.result');
const TOTAL_DIGITS = 10;
const UNCLEAR_DIGIT = '8';
let currentNumber = '';
let expression = '';

initializeScreen();

const btnBackspace = document.querySelector('.backspace');
btnBackspace.addEventListener('click', removeDigit);

const btnClear = document.querySelector('.clear-result');
btnClear.addEventListener('click', clearResult);

const btnEquals = document.querySelector('.equal');
btnEquals.addEventListener('click', operate);

const btnSign = document.querySelector('.sign');
btnSign.addEventListener('click', toggleSign);

const btnDot = document.querySelector('.dot');
btnDot.addEventListener('click', addDot);
const dots = document.querySelector('.dots');

const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => a / b;

const percent = (a, b) => a * (b / 100);

function operate() {
    if (!hasOperator()) {
        return;
    }
    addNumberToExpression();
    let [num1, operator, num2] = expression.split(' ');
    num1 = +num1;
    num2 = +num2;
    switch (operator) {
        case Operator.ADD:
            currentNumber = add(num1, num2);
            break;
        case Operator.SUBTRACT:
            currentNumber = subtract(num1, num2);
            break;
        case Operator.MULTIPLY:
            currentNumber = multiply(num1, num2);
            break;
        case Operator.DIVIDE:
            currentNumber = divide(num1, num2);
            break;
        case Operator.PERCENT:
            currentNumber = percent(num1, num2);
            break;
    }
    currentNumber = currentNumber.toString();
    if ((getDigitsAmount(currentNumber) > TOTAL_DIGITS
        && +currentNumber >= 10**TOTAL_DIGITS) 
        || typeof(currentNumber) === NaN) {
        currentNumber = 'ERROR';        
    }
    // if number is not too big, but too big to display
    else if (getDigitsAmount(currentNumber) > TOTAL_DIGITS) {
        let wholeNumber = getDigitsAmount(Math.trunc(+currentNumber).toString());
        currentNumber = roundToDecimal(+currentNumber, TOTAL_DIGITS - wholeNumber).toString();
    }
    expression = '';
    // expression = currentNumber;
    updateScreen();
}

function roundToDecimal(num, dec) {
    return Math.round(num * 10**dec) / 10**dec;
}

function initializeScreen() {
    const numbers = document.querySelectorAll('.number');
    for (let number of numbers) {
        number.addEventListener('click', addDigit);
    }

    const operators = document.querySelectorAll('.operator');
    for (let operator of operators) {
        operator.addEventListener('click', addOperator);
    }

    const dots = document.querySelector('.dots');
    for (let i = 0; i < TOTAL_DIGITS; i++) {
        let childDot = document.createElement('span');
        childDot.classList.add('screen-font', 'unclear');
        childDot.textContent = '.';
        dots.appendChild(childDot);
    }
}

function clearResult() {
    currentNumber = '';
    expression = '';
    updateScreen();
}

function removeDigit() {
    if (currentNumber) {
        currentNumber = currentNumber.slice(0, -1);
        updateScreen();
    }
}

function addNumberToExpression() {
    if (currentNumber.slice(-1) === '.') {
        expression += ' ' + currentNumber.slice(0, -1);
    }
    else {
        expression += ' ' + currentNumber;
    }
    expression = expression.trim();
}

function hasOperator() {
    let operands = expression.split(' ');
    return operands.some((v) => Object.values(Operator).includes(v));
}

function hasOperatorLast() {
    let lastOperand = expression.split(' ').at(-1);
    return Object.values(Operator).includes(lastOperand)
}

function addOperator(evt) {
    if (hasOperatorLast()) {
        if (currentNumber) {
            expression = '';
            addNumberToExpression();
            expression += ` ${evt.target.textContent}`;
        }
        else {
            expression = expression.split(' ')[0];
            expression += ` ${evt.target.textContent}`;
        }
    }
    else {
        addNumberToExpression();
        expression += ` ${evt.target.textContent}`;
    }
    currentNumber = '';
    updateScreen();
}

function addDigit(evt) {
    if (getDigitsAmount(currentNumber) + currentNumber.includes('-') < TOTAL_DIGITS) {
        currentNumber += evt.target.textContent;
        updateScreen();
    }
}

function updateScreen() {
    let digits = currentNumber.replace('.', '');
    resultNumbers.textContent = digits;
    fixUnclearText(digits);

    if (currentNumber.includes('.')) {
        btnDot.disabled = true;
        updateDotPosition(getDecimalPlaces(currentNumber));
    }
    else {
        btnDot.disabled = false;
        updateDotPosition();
    }
}

function updateDotPosition(pos) {
    const dots = document.querySelector('.dots');
    for (let i = 0; i < dots.children.length; i++) {
        let currentDot = dots.children[i];
        if ((TOTAL_DIGITS - i - 1) === pos) {
            currentDot.classList.add('clear');
            currentDot.classList.remove('unclear');
        }
        else {
            currentDot.classList.remove('clear');
            currentDot.classList.add('unclear');
        }
    }
}

function getDecimalPlaces(num) {
    if (!num) {
        return 0;
    }
    let dotIndex = num.indexOf('.')
    return num.slice(dotIndex + 1).length;
}

function getDigitsAmount(num) {
    if (!num) {
        return 0;
    }
    return num.replace('-', '').replace('.', '').length;
}

function fixUnclearText(result) {
    let digitsAmount = getDigitsAmount(result);
    unclearNumbers.textContent = UNCLEAR_DIGIT.repeat(TOTAL_DIGITS - digitsAmount);
}

function toggleSign() {
    if (currentNumber && getDigitsAmount(currentNumber) < TOTAL_DIGITS) {
        let currentSign = currentNumber.slice(0, 1);
        if (currentSign === '-') {
            currentNumber = currentNumber.slice(1);
        }
        else {
            currentNumber = '-' + currentNumber;
        }
        updateScreen();
    }
}

function addDot() {
    if (currentNumber) {
        currentNumber += '.';
        updateScreen();
    }
}