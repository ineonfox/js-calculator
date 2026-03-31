const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => a / b;

function operate(string) {
    string = string.replaceAll(' ', '');
    console.log(string);
    let [num1, operator, num2] = string.split('');
    num1 = +num1;
    num2 = +num2;
    switch (operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '×':
            return multiply(num1, num2);
        case '÷':
            return divide(num1, num2);
    }
}