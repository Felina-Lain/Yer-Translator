// script.js

document.addEventListener('DOMContentLoaded', function() {
    const pageTitle = document.title;

    if (pageTitle === 'HtoY') {
        applyHtoYListener();
    } else if (pageTitle === 'YtoH') {
        applyYtoHListener();
    } 
});

function applyHtoYListener() {
    const inputMessage = document.getElementById('input_message');
    const validerButton = document.getElementById('valider_button');
    const message1Element = document.getElementById('message1');
    const message2Element = document.getElementById('message2');

    validerButton.addEventListener('click', function() {
    const inputValue = parseInt(inputMessage.value);
    const { numeric, fantasy } = decimalToFantasy(inputValue);
    message1Element.textContent = numeric;  // For numeric font rendering
    message2Element.textContent = fantasy; // For fantasy text rendering
    });
}

function applyYtoHListener() {
    const inputMessage = document.getElementById('input_message');
    const validerButton = document.getElementById('valider_button');
    const messageElement = document.getElementById('message');

    validerButton.addEventListener('click', function() {
        const inputValue = inputMessage.value;
        const decimalValue = fantasyToDecimal(inputValue);
        messageElement.textContent = decimalValue;
    });
}


// Updated decimal to fantasy converter
function decimalToFantasy(decimal) {
    const fantasyDigits = [
        "'a", "'na", "'ka", "'za", "'ta", "'sa", "'da", "'va", "'fa", "'la",
        "'ra", "'ha", "'xa", "'ga", "'ba", "'pa", "'ma"
    ];

    const numericDigits = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "J", "Q", "W", "c", "j", "q"
    ];

    const ordersOfMagnitude = ["", "-f", "-v", "-b", "-x", "-z"];

    if (decimal === 0) return { numeric: "0", fantasy: "'a" };

    let hex = decimal.toString(16);
    let numericResult = [];
    let fantasyResult = [];
    let magnitude = 0;

    while (hex.length > 0) {
        let digit = parseInt(hex.slice(-1), 16);
        hex = hex.slice(0, -1);

        if (digit !== 0) {
            let numericDigit = numericDigits[digit];
            let fantasyDigit = fantasyDigits[digit];
            let order = ordersOfMagnitude[magnitude];

            numericResult.unshift(numericDigit + order);
            fantasyResult.unshift(fantasyDigit + order);
        }

        magnitude++;
    }

    return { numeric: numericResult.join(" "), fantasy: fantasyResult.join(" ") };
}

// Updated fantasy to decimal converter
function fantasyToDecimal(fantasyNumber) {
    const fantasyDigits = {
        "'a": 0, "'na": 1, "'ka": 2, "'za": 3, "'ta": 4, "'sa": 5,
        "'da": 6, "'va": 7, "'fa": 8, "'la": 9, "'ra": 10, "'ha": 11,
        "'xa": 12, "'ga": 13, "'ba": 14, "'pa": 15, "'ma": 16
    };

    const numericDigits = {
        "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
        "C": 10, "J": 11, "Q": 12, "W": 13, "c": 14, "j": 15, "q": 16
    };

    const ordersOfMagnitude = {
        "": 1, "-f": 16, "-v": 256, "-b": 4096, "-x": 65536, "-z": 1048576
    };

    const components = fantasyNumber.split(" ");
    let total = 0;

    for (let component of components) {
        // Extract the digit part and order part
        let [digitPart, orderPart] = component.split(/(?=-)/);
        orderPart = orderPart || "";

        // Handle both numeric and fantasy digit systems
        let digitValue = fantasyDigits[digitPart] ?? numericDigits[digitPart];
        if (digitValue === undefined) {
            throw new Error(`Invalid digit: ${digitPart}`);
        }

        let orderValue = ordersOfMagnitude[orderPart];
        if (orderValue === undefined) {
            throw new Error(`Invalid order: ${orderPart}`);
        }

        total += digitValue * orderValue;
    }

    return total;
}