const display = document.getElementById("display");
const prevDisplay = document.getElementById("prevDisplay");
const operators = ['%', '%', '÷', '×', '-', '+']

let recentCalculated = false;

// checks if a character is a number or not, returns boolean
function isNumeric(char) {
    return !isNaN(char);
}

function appendToDisplay(element) {
    displayString = String(display.textContent);
    elementString = String(element);
    lastElement = displayString.slice(displayString.length - 1);

    // if there was a recent calculation (with either valid output or an error),
    // and if the clicked button is a number, 
    //clear the display and restart with the new number
    if ((recentCalculated && isNumeric(elementString) && isNumeric(lastElement)) ||
        (recentCalculated && isNumeric(elementString) && displayString === 'Error')) {
        display.textContent = '';
        recentCalculated = false;
    }
    else {
        recentCalculated = false;
    }

    // if display is empty, only allow numeric input
    if (displayString === '' && isNumeric(elementString)) {
        display.textContent += element;
    }
    else if (displayString !== ''){
        // prevents the user from selecting two operators consecutively
        if (isNumeric(elementString) || lastElement === ')' || (isNumeric(lastElement) && !isNumeric(elementString))) {
            if (lastElement === ')') {
                display.textContent = displayString.slice(0, displayString.length-1) + elementString + lastElement;
            } else {
                display.textContent += element;
            }
        }
    }
    prevDisplay.textContent = '';
}

// clears the displays
function clearDisplay() {
    prevDisplay.textContent = "";
    display.textContent = "";
}

function changeSign() {
    let displayString = String(display.textContent);
    let containsOperator = false;
    let indexAfterOperator;
    
    // checks if any operator is present in the current display
    for (let operator of operators) {
        // if there is a negative at the start, we don't want to count this so
        // it starts checking if there is an operator from the second character instead of the first
        if (displayString.charAt(0) === '-') {
            displayAfterNegative = displayString.slice(1);
            if (displayAfterNegative.includes(operator)){
                containsOperator = true;
                indexAfterOperator = displayAfterNegative.indexOf(operator) + 2;
                break;
            }
        }
        else {
            if (displayString.includes(operator)){
                containsOperator = true;
                indexAfterOperator = displayString.indexOf(operator) + 1;
                break;
            }
        }
    };

    let lastElement = displayString.slice(displayString.length - 1);
    // make sure that the sign is able to be changed only after a number has been inputted
    if (displayString !== '' && (isNumeric(lastElement) || lastElement === ')')) {
        // if there are no operators
        if (!containsOperator) {
            // if the display is not already a negative, add - in front of the current display
            // otherwise, get rid of the negative
            displayString.slice(0, 1) !== '-' ? display.textContent = '-' + displayString: 
            display.textContent = displayString.slice(1);
        }
        // if there is an operator
        else {
            // if the second number is not negative, add parenthesis and negative
            // if it is, remove the negative
            displayString.slice(indexAfterOperator + 1, indexAfterOperator + 2) !== '-' ? 
            display.textContent = displayString.slice(0, indexAfterOperator) + '(-' + displayString.slice(indexAfterOperator) + ')': 
            display.textContent = displayString.slice(0, indexAfterOperator) + displayString.slice(indexAfterOperator + 2, displayString.length - 1);
        }
        // makes it more natural and removes the parenthesis from the first number entered
        displayString = String(display.textContent);
        if (displayString.slice(0, 3) === '-(-') {
            display.textContent = displayString.slice(3, displayString.length -1);
        }
    }
}

function calculate() {
    let displayString = String(display.textContent);
    
    // deals when there are operators not recognized by javascript
    if (displayString.includes('×')){
        // changes '×' to '*' and '÷' to '/' so that it is calculatable.
        displayString = displayString.slice(0, displayString.indexOf('×')) + '*' + displayString.slice(displayString.indexOf('×') + 1);
    }
    else if (displayString.includes('÷')) {
        displayString = displayString.slice(0, displayString.indexOf('÷')) + '/' + displayString.slice(displayString.indexOf('÷') + 1);    
    }

    // tries to calculate, if there is an error due to an incomplete expression (ex: 3+4-),
    // the error is caught and "Error" is displayed
    try {
        prevDisplay.textContent = display.textContent;
        display.textContent = eval(displayString);
    }
    catch(error) {
        prevDisplay.textContent = '';
        display.textContent = 'Error';
    }
    recentCalculated = true;
}
