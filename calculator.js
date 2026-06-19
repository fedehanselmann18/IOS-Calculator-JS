let resultArray = [];

function displayValue(buttonClass, value) {
    const button = document.querySelector(`.${buttonClass}`);
    const display = document.querySelector('.result');

    button.addEventListener('click', () => {
        const currentText = display.textContent;
        const lastChar = currentText[currentText.length - 1];

        if (currentText === 'Error') {
            display.textContent = value;
            resultArray = [value];
            return;
        }

        if (value === '.') {
            const operators = ['+', '-', 'x', '÷'];
            let lastOperatorIndex = -1;

            for (let i = currentText.length - 1; i >= 0; i -= 1) {
                if (operators.includes(currentText[i])) {
                    lastOperatorIndex = i;
                    break;
                }
            }

            const currentNumber = currentText.slice(lastOperatorIndex + 1);

            if (currentNumber.includes('.')) {
                return;
            }

            if (operators.includes(lastChar)) {
                display.textContent += '0.';
                resultArray.push('0', '.');
                return;
            }
        }

        if (currentText === '0' && value !== '.') {
            display.textContent = value;
            resultArray = [value];
            return;
        }

        display.textContent += value;
        resultArray.push(value);
    });
}

function displayOperator(buttonClass, value) {
    const button = document.querySelector(`.${buttonClass}`);
    const display = document.querySelector('.result');

    button.addEventListener('click', () => {
        const currentText = display.textContent;
        const operators = ['+', '-', 'x', '÷'];
        const lastChar = currentText[currentText.length - 1];

        if (currentText === 'Error') {
            display.textContent = '0';
            resultArray = [];
            return;
        }

        if (currentText === '0') {
            if (value === '-') {
                display.textContent = '-';
                resultArray = ['-'];
            }
            return;
        }

        if (operators.includes(lastChar)) {
            display.textContent = currentText.slice(0, -1) + value;
            resultArray[resultArray.length - 1] = value;
            return;
        }

        display.textContent += value;
        resultArray.push(value);
    });
}

displayValue('one', '1');
displayValue('two', '2');
displayValue('three', '3');
displayValue('four', '4');
displayValue('five', '5');
displayValue('six', '6');
displayValue('seven', '7');
displayValue('eight', '8');
displayValue('nine', '9');
displayValue('zero', '0');
displayValue('decimal', '.');

displayOperator('add', '+');
displayOperator('subtract', '-');
displayOperator('multiply', 'x');
displayOperator('divide', '÷');

const clearButton = document.querySelector('.clear');
const backspaceButton = document.querySelector('.backspace');
const plusMinusButton = document.querySelector('.plus-minus');
const percentageButton = document.querySelector('.percentage');
const equalsButton = document.querySelector('.equals');
const display = document.querySelector('.result');

clearButton.addEventListener('click', () => {
    display.textContent = '0';
    resultArray = [];
});

backspaceButton.addEventListener('click', () => {
    const currentText = display.textContent;

    if (currentText === 'Error') {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    if (currentText.length <= 1) {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    display.textContent = currentText.slice(0, -1);
    resultArray.pop();
});

plusMinusButton.addEventListener('click', () => {
    const currentText = display.textContent;
    const numericValue = Number(currentText);

    if (currentText === 'Error') {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    if (!Number.isNaN(numericValue)) {
        const toggled = (numericValue * -1).toString();
        display.textContent = toggled;
        resultArray = toggled.split('');
    }
});

percentageButton.addEventListener('click', () => {
    const currentText = display.textContent;
    const numericValue = Number(currentText);

    if (currentText === 'Error') {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    if (!Number.isNaN(numericValue)) {
        const percentageValue = (numericValue / 100).toString();
        display.textContent = percentageValue;
        resultArray = percentageValue.split('');
    }
});

equalsButton.addEventListener('click', () => {
    const currentText = display.textContent;

    if (currentText === 'Error') {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    if (currentText.length === 0) {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    const normalizedExpression = currentText
        .replaceAll('x', '*')
        .replaceAll('÷', '/');

    try {
        const result = Function(`"use strict"; return (${normalizedExpression})`)();

        if (!Number.isFinite(result)) {
            display.textContent = 'Error';
            resultArray = [];
            return;
        }

        const roundedResult = Number(result.toFixed(10)).toString();
        display.textContent = roundedResult;
        resultArray = roundedResult.split('');
    } catch (error) {
        display.textContent = 'Error';
        resultArray = [];
    }
});