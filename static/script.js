// script.js

document.addEventListener('DOMContentLoaded', function() {
    const pageTitle = document.title;

    if (pageTitle === 'HtoY') {
        applyHtoYListener();
    } else if (pageTitle === 'YtoH') {
        applyYtoHListener();
    } else if (pageTitle === 'Yer Writer') {
        applyYerWriterListener();
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

function applyYerWriterListener() {
    const sourceTextarea = document.getElementById('sourceTextarea');
    const targetTextarea = document.getElementById('targetTextarea');

    sourceTextarea.addEventListener('input', function() {
        targetTextarea.value = sourceTextarea.value;
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

const sheetURL = 'https://docs.google.com/spreadsheets/d/11AHg5BiwKfqpTXc99DTabq-Bms8qtctLh1WTIKtyp2A/gviz/tq?tqx=out:json';
const userInput = document.getElementById("userInput");
const visualDictionary = document.getElementById("visualDictionary");

// Function to load words from Google Sheets
async function loadWordsFromSheet() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2)); // Parse JSONP format

        // Extract rows into a usable format
        const words = json.table.rows.map(row => ({
            eng: row.c[0]?.v || "",  // English word
            yer: row.c[1]?.v || "", // Yer language equivalent
            context: row.c[2]?.v || "", // Context or additional information
            synonyms: row.c[4]?.v || "" // Synonyms (new column)
        }));

        console.log("Words loaded from Google Sheets:", words);
        return words;
    } catch (error) {
        console.error("Error loading words from Google Sheets:", error);
        return [];
    }
}

// Mapping object for exceptions
const yerExceptions = {
    "C": "'ra",
    "J": "'a",
    "Q": "'xa",
    "W": "'ga",
    "c": "'ba",
    "j": "'pa",
    "q": "'ma",
    // Add other exceptions here as key-value pairs
};

// Function to get the correct Yer value based on exceptions
function getCorrectYerValue(yerValue) {
    // Check if the Yer value is in the exceptions mapping
    return yerExceptions[yerValue] || yerValue; // Return the replacement if it exists, otherwise return the original value
}

// Function to create a raw data object
function createPrintableData(words) {
    return words.map(entry => ({
        eng: entry.eng, // English value
        yer: getCorrectYerValue(entry.yer), // Yer value with exceptions handled
        context: entry.context, // Context value
        synonym: entry.synonyms // Synonym value
    }));
}

// Initialize and set up the visual dictionary
async function setupVisualDictionary() {
    const Words = await loadWordsFromSheet();

    // Create the printable raw data
    const printable = createPrintableData(Words);

    // Print the raw data to the console
    console.log(printable);

    userInput.addEventListener("input", function () {
        const searchTerm = userInput.value.toLowerCase();

        // Clear previous entries
        visualDictionary.innerHTML = "";

        // Iterate through the Words array and find matching entries
        Words.forEach(entry => {
            if (
                entry.eng.toLowerCase().includes(searchTerm) ||
                entry.yer.toLowerCase().includes(searchTerm) ||
                entry.synonyms.toLowerCase().includes(searchTerm) // Include synonyms in the search
            ) {
                // Create visual dictionary entry
                const visualDico = document.createElement("visual-dico");

                const dicoEng = document.createElement("dico-eng");
                dicoEng.textContent = entry.eng;

                const dicoYerSigns = document.createElement("dico-yer-signs");
                dicoYerSigns.className = "bugs_symbols";
                dicoYerSigns.textContent = entry.yer;

                const dicoYer = document.createElement("dico-yer");
                dicoYer.textContent =  getCorrectYerValue(entry.yer);

                const dicoContext = document.createElement("dico-context");
                dicoContext.textContent = entry.context;

                const dicoSynonyms = document.createElement("dico-synonyms");
                dicoSynonyms.textContent = entry.synonyms; // Display synonyms

                visualDico.appendChild(dicoEng);
                visualDico.appendChild(dicoYerSigns);
                visualDico.appendChild(dicoYer);
                visualDico.appendChild(dicoContext);
                visualDico.appendChild(dicoSynonyms); // Add synonyms to the visual dictionary

                visualDictionary.appendChild(visualDico);
            }
        });
    });
}

// Call the setup function to initialize everything
setupVisualDictionary();