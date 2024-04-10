// script.js

document.addEventListener('DOMContentLoaded', function() {
    const pageTitle = document.title;

    if (pageTitle === 'HtoY') {
        // This is the first page, apply the listener for it
        const inputMessage = document.getElementById('input_message');
        const validerButton = document.getElementById('valider_button');
        const message1Element = document.getElementById('message1');
        const message2Element = document.getElementById('message2');

        validerButton.addEventListener('click', function() {
            const inputValue = parseInt(inputMessage.value);
            const [yerNumber, yerText] = convertToYer(inputValue);
            message1Element.textContent = yerNumber;
            message2Element.textContent = yerText;
        });
    } else if (pageTitle === 'YtoH') {
        // This is the second page, apply the listener for it
        const inputMessage = document.getElementById('input_message');
        const validerButton = document.getElementById('valider_button');
        const messageElement = document.getElementById('message');

        validerButton.addEventListener('click', function() {
            const inputValue = inputMessage.value;
            const decimalValue = yerToDecimal(inputValue);
            messageElement.textContent = decimalValue;
        });
    } else if (pageTitle === 'Yer Writer') {
        // This is the third page, apply the listener for it
        const sourceTextarea = document.getElementById('sourceTextarea');
        const targetTextarea = document.getElementById('targetTextarea');

        sourceTextarea.addEventListener('input', function() {
            targetTextarea.value = sourceTextarea.value;
        });
    }
});




function convertToYer(number) {
    // Define the numerals
    const numerals = {
        1: ["1", "'na"],
        2: ["2", "'ka"],
        3: ["3", "'za"],
        4: ["4", "'ta"],
        5: ["5", "'sa"],
        6: ["6", "'da"],
        7: ["7", "'va"],
        8: ["8", "'fa"],
        9: ["9", "'la"],
        10: ["@", "'ra"],
        11: ["_", "'ha"],
        12: ["#", "'xa"],
        13: ["$", "'ga"],
        14: ["%", "'ba"],
        15: ["&", "'pa"],
        16: ["€", "'ma"]
    };

    // Define the sound indicators for orders of numbers
    const orders = {
        16: '-f ',
        256: '-v ',
        4096: '-b ',
        65536: '-x ',
        1048576: '-z '
    };

    // Initialize the Yer representation of the number
    let yerNumber = "";
    let yerText = "";

    // Check if the input number is 0
    if (number === 0) {
        return ["0", "'a'"];
    }

    // Loop through the orders of numbers from highest to lowest
    Object.keys(orders).sort((a, b) => b - a).forEach(order => {
        order = parseInt(order);
        if (number >= order) {
            // Calculate the amount of this order in the input number
            const amount = Math.floor(number / order);
            // Append the corresponding numeral to the Yer representation
            yerNumber += numerals[amount][0] + orders[order];
            yerText += numerals[amount][1] + orders[order];
            // Update the input number with the remainder after removing this order
            number -= order * amount;
        }
    });

    if (number !== 0) {
        const [symbol, name] = numerals[number];
        yerNumber += symbol;
        yerText += name;
    }

    // Return the Yer representation of the number
    return [yerNumber, yerText];
}



function yerToDecimal(yerNum) {
    // Convert yerNum to lowercase
    yerNum = yerNum.toLowerCase();
    
    if (yerNum == "'a'" || yerNum == "0") {
        return 0;
    }

    // Define an object mapping symbols to their corresponding words
    const symbolToWord = {
        "@": "'ra",
        "#": "'xa",
        "_": "'ha",
        "$": "'ga",
        "%": "'ba",
        "&": "'pa",
        "€": "'ma",
        "1": "'na",
        "2": "'ka",
        "3": "'za",
        "4": "'ta",
        "5": "'sa",
        "6": "'da",
        "7": "'va",
        "8": "'fa",
        "9": "'la"
        // Add more mappings as needed
    };

    const orders = {"spe": 1, "f": 16, "v": 256, "b": 4096, "x": 65536, "z": 1048576};

    const baseNum = {
        "na": 1,
        "ka": 2,
        "za": 3,
        "ta": 4,
        "sa": 5,
        "da": 6,
        "va": 7,
        "fa": 8,
        "la": 9,
        "ra": 10,
        "ha": 11,
        "xa": 12,
        "ga": 13,
        "ba": 14,
        "pa": 15,
        "ma": 16
    };

    let decimalNum = 0;
    yerNum = yerNum.replace(/\s+/g, ''); // Remove all whitespace
    console.log("despace " , yerNum);

    // Convert symbols or numbers to words
    for (const [symbol, word] of Object.entries(symbolToWord)) {
        yerNum = yerNum.split(symbol).join(word);
    }
    console.log("replace " ,yerNum);

    const parts = yerNum.split("'");    
    parts.shift(); // Remove the first empty element
    console.log("split", parts);

    for (const part of parts) {
        const things = part.split('-');
        const base = things[0];
        if (!baseNum.hasOwnProperty(base)) {
            console.log(`Base '${base}' not found in baseNum object`);
            continue; // Skip processing if base is not found
        }
        if (things.length == 2) {
            const order = things[1];
            if (!orders.hasOwnProperty(order)) {
                console.log(`Order '${order}' not found in orders object`);
                continue; // Skip processing if order is not found
            }
            decimalNum += baseNum[base] * orders[order];
        } else {
            decimalNum += baseNum[base];
        }
    }

    return decimalNum;
}
