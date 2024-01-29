const keys = document.querySelectorAll('.key');
const displayInput = document.querySelector('.display .input');
const displayOutput = document.querySelector('.display .output');
const base = document.getElementById('base');

let input = '';
let operator = null;
let currentBase = 10; // decimal by default

function appendNumber(number) {
    if (currentBase === 16 && ['A', 'B', 'C', 'D', 'E', 'F'].includes(number)) {
        input += number;
    } else {
        input += number;
    }
    displayInput.innerHTML = cleanInput(input);
}

function setOperator(op) {
    if (operator !== null || input === '') return;
    operator = op;
    input += ' ' + operator + ' ';
    displayInput.innerHTML = cleanInput(input);
}

function calculateResult() {
    if (operator === null || input.slice(-2) === ' ') return;
    try {
        let result;
        if (currentBase === 10) {
            result = eval(prepareInput(input));
        } else {
            result = convertFromBase10(convertToBase10(input, currentBase), 10);
        }
        displayOutput.innerHTML = cleanOutput(result);
        input = result.toString();
        operator = null;
    } catch {
        displayOutput.innerHTML = 'Error';
        input = '';
        operator = null;
    }
}

function clearDisplay() {
    input = '';
    operator = null;
    displayInput.innerHTML = '';
    displayOutput.innerHTML = '';
}

function convertToBase10(number, base) {
    let decimalNumber = 0;
    let baseMultiplier = 1;
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = number[i];
        if (digit >= 'A' && digit <= 'F') {
            digit = parseInt(digit, 16);
        }
        decimalNumber += digit * baseMultiplier;
        baseMultiplier *= base;
    }
    return decimalNumber;
}

function convertFromBase10(number, base) {
    if (number === 0) {
        return '0';
    }

    let result = '';
    while (number > 0) {
        let remainder = number % base;
        if (remainder >= 10) {
            remainder = String.fromCharCode(remainder + 55);
        }
        result = remainder + result;
        number = Math.floor(number / base);
    }
    return result;
}

keys.forEach((key) => {
    key.addEventListener('click', () => {
        const keyValue = key.textContent;

        if (['A', 'B', 'C', 'D', 'E', 'F'].includes(keyValue)) {
            if (currentBase !== 16) return;
        }

        if (keyValue === 'DEC') {
            currentBase = 10;
            base.textContent = 'DEC';
        } else if (keyValue === 'HEX') {
            currentBase = 16;
            base.textContent = 'HEX';
        } else if (keyValue === 'BIN') {
            currentBase = 2;
            base.textContent = 'BIN';
        } else if (keyValue === 'OCT') {
            currentBase = 8;
            base.textContent = 'OCT';
        } else if (keyValue === '=') {
            calculateResult();
        } else if (keyValue === 'clear') {
            clearDisplay();
        } else {
            appendNumber(keyValue);
        }
    });
});

for (let key of keys) {
	const value = key.dataset.key;

	key.addEventListener('click', () => {
		if (value == "clear") {
			input = "";
			display_input.innerHTML = "";
			display_output.innerHTML = "";
		} else if (value == "backspace") {
			input = input.slice(0, -1);
			display_input.innerHTML = CleanInput(input);
		} else if (value == "=") {
			let result = eval(PerpareInput(input));

			display_output.innerHTML = CleanOutput(result);
		} else if (value == "brackets") {
			if (
				input.indexOf("(") == -1 || 
				input.indexOf("(") != -1 && 
				input.indexOf(")") != -1 && 
				input.lastIndexOf("(") < input.lastIndexOf(")")
			) {
				input += "(";
			} else if (
				input.indexOf("(") != -1 && 
				input.indexOf(")") == -1 || 
				input.indexOf("(") != -1 &&
				input.indexOf(")") != -1 &&
				input.lastIndexOf("(") > input.lastIndexOf(")")
			) {
				input += ")";
			}

			display_input.innerHTML = CleanInput(input);
		} else {
			if (ValidateInput(value)) {
				input += value;
				display_input.innerHTML = CleanInput(input);
			}
		}
	})
}



function cleanInput(input) {
    let inputArray = input.split('');
    let inputArrayLength = inputArray.length;

    for (let i = 0; i < inputArrayLength; i++) {
        if (inputArray[i] == '*') {
            inputArray[i] = ` <span class="operator">x</span> `;
        } else if (inputArray[i] == '/') {
            inputArray[i] = ` <span class="operator">÷</span> `;
        } else if (inputArray[i] == '+') {
            inputArray[i] = ` <span class="operator">+</span> `;
        } else if (inputArray[i] == '-') {
            inputArray[i] = ` <span class="operator">-</span> `;
        } else if (inputArray[i] == '(') {
            inputArray[i] = `<span class="brackets">(</span>`;
        } else if (inputArray[i] == ')') {
            inputArray[i] = `<span class="brackets">)</span>`;
        } else if (inputArray[i] == '%') {
            inputArray[i] = `<span class="percent">%</span>`;
        }
    }

    return inputArray.join('');
}

function cleanOutput(output) {
    let outputString = output.toString();
    let decimal = outputString.split(".")[1];
    outputString = outputString.split(".")[0];

    let outputArray = outputString.split("");

    if (outputArray.length > 3) {
        for (let i = outputArray.length - 3; i > 0; i -= 3) {
            outputArray.splice(i, 0, ",");
        }
    }

    if (decimal) {
        outputArray.push(".");
        outputArray.push(decimal);
    }

    return outputArray.join("");
}

function validateInput(value) {
    let lastInput = input.slice(-1);
    let operators = ["+", "-", "*", "/"];

    if (value == "." && lastInput == ".") {
        return false;
    }

    if (operators.includes(value)) {
        if (operators.includes(lastInput)) {
            return false;
        } else {
            return true;
        }
    }

    return true;
}

function prepareInput(input) {
    let inputArray = input.split("");

    for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i] == "%") {
            inputArray[i] = "/100";
        }
    }

    return inputArray.join("");
}
