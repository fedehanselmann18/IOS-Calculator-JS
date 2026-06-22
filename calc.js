// ===== STATE (Calculator Memory) =====
// Stores the current number being entered by the user
let currentInput = '0';
// Stores the previous number (before an operator was pressed)
let previousInput = '';
// Stores the current operator (+, -, *, /)
let operator = null;

// ===== DOM REFERENCES =====
// Reference to the display element where results are shown
const resultDisplay = document.querySelector('.result');
// All buttons with the 'number' class (0-9 digits)
const numberButtons = document.querySelectorAll('.number');
// All buttons with the 'operator' class (+, -, *, /)
const operatorButtons = document.querySelectorAll('.operator');
// The equals button (=)
const equalsButton = document.querySelector('.equals');
// The clear button (AC or C) - resets calculator
const clearButton = document.querySelector('.clear');
// The backspace button - removes last digit
const backspaceButton = document.querySelector('.backspace');
// The decimal point button (.)
const decimalButton = document.querySelector('.decimal');

// ===== DISPLAY UTILITIES =====
/**
 * displaySymbol - Converts standard operators to display symbols
 * @param {string} op - Standard operator symbol ('+', '-', '*', '/')
 * @returns {string} - Display symbol ('÷' for division, 'x' for multiplication, etc.)
 * 
 * Maps internal operators to user-friendly display symbols
 */
function displaySymbol(op) {
    const map = { '+': '+', '-': '-', '*': 'x', '/': '÷' };
    return map[op] || '';
}

/**
 * updateDisplay - Refreshes the calculator display with current state
 * 
 * Shows:
 * - Just currentInput while entering a number
 * - "previousInput operator currentInput" once operator is selected
 * 
 * Example displays:
 * - "42"
 * - "42 + 8"
 */
function updateDisplay() {
    if (operator && previousInput !== '') {
        // Show the complete operation: number operator number
        resultDisplay.textContent = `${previousInput} ${displaySymbol(operator)} ${currentInput}`;
    } else {
        // Show just the current input
        resultDisplay.textContent = currentInput;
    }
}

// ===== NUMBER BUTTON HANDLERS =====
// Attach click listeners to all number buttons (0-9)
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get the digit from the button's text content
        const digit = button.textContent;
        
        // Replace leading '0' with the first digit typed
        if (currentInput === '0') {
            currentInput = digit;
        } else {
            // Append digit to current input
            currentInput += digit;
        }
        
        // Refresh display to show updated number
        updateDisplay();
    });
});

// ===== DECIMAL BUTTON =====
// Appends a decimal point to current input, but only if one doesn't exist
decimalButton.addEventListener('click', () => {
    // Check if decimal point already exists in currentInput
    if (!currentInput.includes('.')) {
        // Add decimal point to allow fractional numbers
        currentInput += '.';
        updateDisplay();
    }
    // If decimal already exists, do nothing (prevents "5.5.5" situations)
});

// ===== CALCULATION ENGINE =====
/**
 * compute - Performs arithmetic operation on two numbers
 * @description Executes the operation stored in 'operator' using previousInput and currentInput
 * 
 * Supports: +, -, *, /
 * Result is stored back in currentInput for chaining operations
 * 
 * Example: previousInput=5, operator='+', currentInput=3 → currentInput='8'
 */
function compute() {
    // Convert string inputs to numbers for calculation
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);
    let result;

    // Perform the appropriate arithmetic based on the operator
    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2;
            break;
        default:
            // No valid operator, exit without computing
            return;
    }

    // Store result as string for display and potential chaining
    currentInput = result.toString();
}

// ===== OPERATOR BUTTON HANDLERS =====
// Map CSS class names to mathematical operators
const symbolMap = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/'
};

/**
 * Operator Button Click Handler
 * Implements operation chaining and state updates
 * 
 * Flow:
 * 1. If a complete operation exists (e.g., "5 + 3" then press "*"), compute the result
 * 2. Move currentInput to previousInput for next operation
 * 3. Set the new operator
 * 4. Reset currentInput to '0' to accept new number
 * 5. Update display to show the progress
 */
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Extract the operator class (e.g., 'add', 'multiply') from button classList
        const action = [...button.classList].find(cls => cls !== 'operator');
        // Convert class name to operator symbol
        const selectedOperator = symbolMap[action];

        // Skip if operator mapping failed
        if (!selectedOperator) return;

        // OPERATION CHAINING: If user presses operator twice in a row
        // Example: "5 + 3 * " should compute "5 + 3 = 8" first, then "8 *"
        if (previousInput !== '' && currentInput !== '' && operator) {
            compute(); // Executes current operation, result goes to currentInput
        }

        // Move current number to previous slot for next operation
        previousInput = currentInput;
        
        // Store the selected operator
        operator = selectedOperator;
        
        // Reset for entering the next number
        currentInput = '0';
        
        // Update display to show the expression being built
        updateDisplay();
    });
});

// ===== EQUALS =====
equalsButton.addEventListener('click', () => {
    if (previousInput === '' || operator === null) return;
    compute();
    previousInput = '';
    operator = null;
    updateDisplay();
});

// ===== CLEAR =====
clearButton.addEventListener('click', () => {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
});

// ===== BACKSPACE =====
backspaceButton.addEventListener('click', () => {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') currentInput = '0';
    updateDisplay();
});