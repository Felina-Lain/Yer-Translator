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
        const [yerNumber, yerText] = convertToYer(inputValue);
        message1Element.textContent = yerNumber;
        message2Element.textContent = yerText;
    });
}

function applyYtoHListener() {
    const inputMessage = document.getElementById('input_message');
    const validerButton = document.getElementById('valider_button');
    const messageElement = document.getElementById('message');

    validerButton.addEventListener('click', function() {
        const inputValue = inputMessage.value;
        const decimalValue = yerToDecimal(inputValue);
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
  
  const Words = [
    { eng: "me", yer: "fy", context: "the speaker" },
    { eng: "i", yer: "fy", context: "the speaker" },
    { eng: "mine", yer: "fy", context: "owned by the speaker" },
    { eng: "you", yer: "ly", context: "the interlocuter" },
    { eng: "your", yer: "ly", context: "owned by the interlocuter" },
    { eng: "yours", yer: "ly", context: "multiple items owned the interlocuter" },
    { eng: "he", yer: "zy", context: "another, the other" },
    { eng: "she", yer: "zy", context: "another, the other" },
    { eng: "it", yer: "zy", context: "another, the other" },
    { eng: "his", yer: "zy", context: "owned by another" },
    { eng: "hers", yer: "zy", context: "owned by another" },
    { eng: "its", yer: "zy", context: "owned by another" },
    { eng: "us", yer: "fyly", context: "me and you not others" },
    { eng: "us", yer: "fylyzy", context: "me and you and others" },
    { eng: "us", yer: "fyzy", context: "me and others but not you" },
    { eng: "ours", yer: "fyly", context: "mine and your not others" },
    { eng: "ours", yer: "fylyzy", context: "mine and your and others" },
    { eng: "they", yer: "txzy", context: "others" },
    { eng: "their", yer: "txzy", context: "one item owned by others" },
    { eng: "theirs", yer: "txzy", context: "multiple items owned by others" },
    { eng: "plural", yer: "tx", context: "prefix" },
    { eng: "male", yer: "'ryk", context: "suffix, only attached to creature names when needed. Yer don't gender thing since asexual is default"},
    { eng: "female", yer: "niz'", context: "suffix, only attached to creature names when needed. Yer don't gender thing since asexual is default"},
    { eng: "now", yer: "ka", context: "prefix, attach to verb, usually skipped because the present is default time" },
    { eng: "past", yer: "na", context: "prefix, attach to verb" },
    { eng: "future", yer: "ra", context: "prefix, attach to verb" },
    { eng: "question", yer: "'zk", context: "general question word"},
    { eng: "query", yer: "'zk", context: "general question word"},
    { eng: "ask", yer: "'zk", context: "general question word"},
    { eng: "what", yer: "'zak", context: ""},
    { eng: "when", yer: "'zik", context: ""},
    { eng: "where", yer: "'zek", context: ""},
    { eng: "who", yer: "'zuk", context: ""},
    { eng: "how", yer: "'zok", context: ""},
    { eng: "left", yer: "'kod", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "right", yer: "'dok", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "inside", yer: "'rin", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "outside", yer: "'nir", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "ahead", yer: "'kid", context: "in front,always relative to the speaker, unless precised otherwise"},
    { eng: "behind", yer: "'dik", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "near", yer: "'ron", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "far", yer: "'nor", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "here", yer: "'ron", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "away", yer: "'nor", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "up", yer: "'knd", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "down", yer: "'dnk", context: "always relative to the speaker, unless precised otherwise"},
    { eng: "for", yer: "'kor", context: ""},
    { eng: "instead", yer: "'kro", context: ""},
    { eng: "all", yer: "dziko", context: ""},
    { eng: "everything", yer: "dziko", context: ""},
    { eng: "whole", yer: "dziko", context: ""},
    { eng: "soil", yer: "kat", context: ""},
    { eng: "earth", yer: "kat", context: ""},
    { eng: "dirt", yer: "kat", context: ""},
    { eng: "people", yer: "yers", context: ""},
    { eng: "servant", yer: "ers", context: ""},
    { eng: "inferior", yer: "ers", context: ""},
    { eng: "beneath", yer: "ers", context: "conceptually, less developped, less thinking, animal"},
    { eng: "ancient", yer: "dr'", context: "difference with old made by pheromones, ancient is more honorific"},
    { eng: "old", yer: "dr'", context: ""},
    { eng: "sra", yer: "tree", context: ""},
    { eng: "big", yer: "vrk", context: ""},
    { eng: "giant", yer: "vrk", context: "difference with big made by pheromones"},
    { eng: "alive", yer: "'ril", context: ""},
    { eng: "dead", yer: "'rsin", context: ""},
    { eng: "death", yer: "'rsin", context: ""},
    { eng: "swarm", yer: "rak", context: "very negative connotation to the word"},
    { eng: "disease", yer: "dkin'", context: ""},
    { eng: "city", yer: "raz", context: ""},
    { eng: "sand", yer: "mni", context: ""},
    { eng: "amber", yer: "ksin", context: "precious ressource also works"},
    { eng: "market", yer: "razy", context: ""},
    { eng: "water", yer: "tzir", context: ""},
    { eng: "wet", yer: "tzir", context: ""},
    { eng: "fire", yer: "txir", context: ""},
    { eng: "burn", yer: "txir", context: ""},
    { eng: "air", yer: "yn", context: ""},
    { eng: "breath", yer: "yn", context: ""},
    { eng: "rock", yer: "g'n", context: ""},
    { eng: "stone", yer: "g'n", context: ""},
    { eng: "food", yer: "r'sik", context: ""},
    // Add more entries...
  ];
  
  const userInput = document.getElementById("userInput");
  const visualDictionary = document.getElementById("visualDictionary");
  
  userInput.addEventListener("input", function() {
    const searchTerm = userInput.value.toLowerCase();
  
    // Clear previous entries
    visualDictionary.innerHTML = "";
  
    // Iterate through the Words array and find matching entries
    Words.forEach(entry => {
      if (entry.eng.toLowerCase().includes(searchTerm) || entry.yer.toLowerCase().includes(searchTerm)) {
        // Create visual dictionary entry
        const visualDico = document.createElement("visual-dico");
  
        const dicoEng = document.createElement("dico-eng");
        dicoEng.textContent = entry.eng;
  
        const dicoYerSigns = document.createElement("dico-yer-signs");
        dicoYerSigns.className = "bugs_symbols";
        dicoYerSigns.textContent = entry.yer;
  
        const dicoYer = document.createElement("dico-yer");
        dicoYer.textContent = entry.yer;
  
        const dicoContext = document.createElement("dico-context");
        dicoContext.textContent = entry.context;
  
        visualDico.appendChild(dicoEng);
        visualDico.appendChild(dicoYerSigns);
        visualDico.appendChild(dicoYer);
        visualDico.appendChild(dicoContext);
  
        visualDictionary.appendChild(visualDico);
      }
    });
  });