// ===== STATE =====
// Array to store the sequence of inputs (numbers and operators)
// Used to reconstruct the expression and maintain calculator state
let resultArray = [];

/**
 * displayValue - Handles number and decimal button clicks
 * @param {string} buttonClass - CSS class name of the button element
 * @param {string} value - The numeric value or decimal to display (e.g., '1', '2', '.')
 * 
 * This function:
 * - Attaches a click event listener to a number button
 * - Manages decimal point logic (prevents multiple decimals in same number)
 * - Replaces '0' when a new number is entered
 * - Handles special case when an operator was just entered (adds '0.' for decimal)
 */
function displayValue(buttonClass, value) {
    const button = document.querySelector(`.${buttonClass}`);
    const display = document.querySelector('.result');

    button.addEventListener('click', () => {
        // Get current display text and the last character
        const currentText = display.textContent;
        const lastChar = currentText[currentText.length - 1];

        // If display shows error, replace it with the new value
        if (currentText === 'Error') {
            display.textContent = value;
            resultArray = [value];
            return;
        }

        // DECIMAL POINT HANDLING
        if (value === '.') {
            // List of valid operators
            const operators = ['+', '-', 'x', '÷'];
            let lastOperatorIndex = -1;

            // Find the index of the last operator in the display
            for (let i = currentText.length - 1; i >= 0; i -= 1) {
                if (operators.includes(currentText[i])) {
                    lastOperatorIndex = i;
                    break;
                }
            }

            // Extract the current number (everything after the last operator)
            const currentNumber = currentText.slice(lastOperatorIndex + 1);

            // Prevent adding a second decimal point to the same number
            if (currentNumber.includes('.')) {
                return;
            }

            // If last character is an operator, add '0.' to start decimal number
            if (operators.includes(lastChar)) {
                display.textContent += '0.';
                resultArray.push('0', '.');
                return;
            }
        }

        // Replace leading '0' when a new non-decimal number is entered
        if (currentText === '0' && value !== '.') {
            display.textContent = value;
            resultArray = [value];
            return;
        }

        // Append value to display and track in resultArray
        display.textContent += value;
        resultArray.push(value);
    });
}

/**
 * displayOperator - Handles operator button clicks (+, -, x, ÷)
 * @param {string} buttonClass - CSS class name of the button element
 * @param {string} value - The operator symbol ('+', '-', 'x', '÷')
 * 
 * This function:
 * - Attaches a click event listener to an operator button
 * - Prevents multiple operators in a row (replaces the last operator)
 * - Handles negative number entry after operator
 * - Maintains the expression in both display and resultArray
 */
function displayOperator(buttonClass, value) {
    const button = document.querySelector(`.${buttonClass}`);
    const display = document.querySelector('.result');

    button.addEventListener('click', () => {
        // Get current display text and identify last character
        const currentText = display.textContent;
        const operators = ['+', '-', 'x', '÷'];
        const lastChar = currentText[currentText.length - 1];

        // If an error is displayed, reset calculator
        if (currentText === 'Error') {
            display.textContent = '0';
            resultArray = [];
            return;
        }

        // If display is '0' and operator is '-', allow negative number entry
        if (currentText === '0') {
            if (value === '-') {
                display.textContent = '-';
                resultArray = ['-'];
            }
            return;
        }

        // If last character is an operator, replace it with the new operator
        // This prevents multiple operators in a row
        if (operators.includes(lastChar)) {
            display.textContent = currentText.slice(0, -1) + value;
            resultArray[resultArray.length - 1] = value;
            return;
        }

        // Append operator to the expression
        display.textContent += value;
        resultArray.push(value);
    });
}

// ===== NUMBER AND DECIMAL BUTTON SETUP =====
// Create click handlers for all number buttons (0-9) by calling displayValue
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

// ===== DOM ELEMENT REFERENCES =====
// Cache references to special function buttons and the display element
const clearButton = document.querySelector('.clear');
const backspaceButton = document.querySelector('.backspace');
const plusMinusButton = document.querySelector('.plus-minus');
const percentageButton = document.querySelector('.percentage');
const equalsButton = document.querySelector('.equals');
const display = document.querySelector('.result');

// ===== CLEAR BUTTON =====
// Resets the calculator to initial state (display shows '0', resultArray is empty)
clearButton.addEventListener('click', () => {
    display.textContent = '0';
    resultArray = [];
});

// ===== BACKSPACE BUTTON =====
// Removes the last character from the display (undo last input)
backspaceButton.addEventListener('click', () => {
    const currentText = display.textContent;

    // If error is displayed, reset to '0'
    if (currentText === 'Error') {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    // If only one character remains, reset to '0'
    if (currentText.length <= 1) {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    // Remove the last character from display and resultArray
    display.textContent = currentText.slice(0, -1);
    resultArray.pop();
});

// ===== PLUS/MINUS BUTTON =====
// Toggles the sign of the current number (positive ↔ negative)
plus-MinusButton.addEventListener('click', () => {
    const currentText = display.textContent;
    const numericValue = Number(currentText);

    // If error is displayed, reset to '0'
    if (currentText === 'Error') {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    // Multiply by -1 to toggle the sign, convert back to string for display
    if (!Number.isNaN(numericValue)) {
        const toggled = (numericValue * -1).toString();
        display.textContent = toggled;
        // Split string into individual characters for resultArray
        resultArray = toggled.split('');
    }
});

// ===== PERCENTAGE BUTTON =====
// Converts the current number to its percentage (divides by 100)
percentageButton.addEventListener('click', () => {
    const currentText = display.textContent;
    const numericValue = Number(currentText);

    // If error is displayed, reset to '0'
    if (currentText === 'Error') {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    // Divide by 100 to get percentage, convert back to string for display
    if (!Number.isNaN(numericValue)) {
        const percentageValue = (numericValue / 100).toString();
        display.textContent = percentageValue;
        // Split string into individual characters for resultArray
        resultArray = percentageValue.split('');
    }
});

// ===== EQUALS BUTTON =====
// Evaluates the entire mathematical expression and displays the result
equalsButton.addEventListener('click', () => {
    const currentText = display.textContent;

    // If error is displayed, reset to '0'
    if (currentText === 'Error') {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    // If display is empty, reset to '0'
    if (currentText.length === 0) {
        display.textContent = '0';
        resultArray = [];
        return;
    }

    // Convert calculator symbols to standard mathematical operators
    // 'x' → '*' (multiplication) and '÷' → '/' (division)
    const normalizedExpression = currentText
        .replaceAll('x', '*')
        .replaceAll('÷', '/');

    try {
        // Use Function constructor to safely evaluate the mathematical expression
        // "use strict" ensures safer evaluation
        const result = Function(`"use strict"; return (${normalizedExpression})`)();

        // Check if result is a valid finite number (not Infinity, -Infinity, or NaN)
        if (!Number.isFinite(result)) {
            display.textContent = 'Error';
            resultArray = [];
            return;
        }

        // Round to 10 decimal places to avoid floating-point precision issues
        // Convert back to string for display
        const roundedResult = Number(result.toFixed(10)).toString();
        display.textContent = roundedResult;
        // Split string into individual characters for resultArray
        resultArray = roundedResult.split('');
    } catch (error) {
        // If evaluation fails (e.g., invalid syntax), display error
        display.textContent = 'Error';
        resultArray = [];
    }
});