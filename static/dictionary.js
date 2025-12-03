const sheetURL = 'https://docs.google.com/spreadsheets/d/11AHg5BiwKfqpTXc99DTabq-Bms8qtctLh1WTIKtyp2A/gviz/tq?tqx=out:json';
const userInput = document.getElementById("userInput");
const visualDictionary = document.getElementById("visualDictionary");

// Function to load words from Google Sheets
async function loadWordsFromSheet() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2)); // Parse JSONP format

        // Extract rows into a usable format, skipping the first row
        const words = json.table.rows.slice(1).map(row => ({
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