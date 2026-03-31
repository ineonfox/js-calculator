const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => a / b;

const percent = (a, b) => a * (b / 100);

function operate() {
    addNumberToExpression();

    let [num1, operator, num2] = expression.split(' ');
    num1 = +num1;
    num2 = +num2;
    switch (operator) {
        case '+':
            currentNumber = add(num1, num2);
            break;
        case '-':
            currentNumber = subtract(num1, num2);
            break;
        case '×':
            currentNumber = multiply(num1, num2);
            break;
        case '÷':
            currentNumber = divide(num1, num2);
            break;
        case '%':
            currentNumber = percent(num1, num2);
            break;
    }
    currentNumber = currentNumber.toString();
    expression = `${currentNumber} ${operator} `;
    updateScreen();
}

const unclearNumbers = document.querySelector('.calc-screen .unclear');
const resultNumbers = document.querySelector('.screen-numbers.result');
const TOTAL_DIGITS = 10;
const UNCLEAR_DIGIT = '8';
let currentNumber = '';
let expression = '';

initializeScreen();

function initializeScreen() {
    const numbers = document.querySelectorAll('.number');
    for (let number of numbers) {
        number.addEventListener('click', addDigit);
    }

    const operators = document.querySelectorAll('.operator');
    console.log(operators)
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

const btnBackspace = document.querySelector('.backspace');
btnBackspace.addEventListener('click', removeDigit);

const btnClear = document.querySelector('.clear-result');
btnClear.addEventListener('click', clearResult);

const btnEquals = document.querySelector('.equal');
btnEquals.addEventListener('click', operate);

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
        expression += currentNumber.slice(0, -1);
    }
    else {
        expression += currentNumber;
    }
}

function addOperator(evt) {
    addNumberToExpression();
    expression += ` ${evt.target.textContent} `;
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
    let digitsAmount = 1;

    // We use Math.ceil when < 0, and Math.floor otherwise
    if (+num < 0) {
        while(Math.ceil(num / (10**digitsAmount)) !== 0) {
            digitsAmount++;
        }
    }
    else {
        while(Math.floor(num / (10**digitsAmount)) !== 0) {
            digitsAmount++;
        }
    }
    return digitsAmount;
}

function fixUnclearText(result) {
    let digitsAmount = getDigitsAmount(result);
    unclearNumbers.textContent = UNCLEAR_DIGIT.repeat(TOTAL_DIGITS - digitsAmount);
}

function clear() {
    resultNumbers.textContent = '';
    fixUnclearText();
}

const btnSign = document.querySelector('.sign');
btnSign.addEventListener('click', toggleSign);

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


const btnDot = document.querySelector('.dot');
btnDot.addEventListener('click', addDot);
const dots = document.querySelector('.dots');

function addDot() {
    if (currentNumber) {
        currentNumber += '.';
        updateScreen();
    }
}