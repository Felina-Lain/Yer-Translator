const container = document.getElementById('container');
const signSizeInput = document.getElementById('signSize');

// Signs and their properties
const signs = {
    '●': { color: 'black' },
    '～': { color: 'green' }
};

let currentSign = '●'; // Default sign
let signSize = parseInt(signSizeInput.value); // Initial sign size

// Track whether the mouse is over a sign
let isMouseOverSign = false;

// Track long press
let longPressTimer = null;
const longPressDelay = 500; // 0.5 seconds

// Add a new row of squares
function addRow() {
    const row = document.createElement('div');
    row.className = 'row';
    for (let i = 0; i < 5; i++) {
        const square = document.createElement('div');
        square.className = 'square';
        for (let j = 0; j < 5; j++) {
            const innerRow = document.createElement('div');
            innerRow.className = 'inner-row';
            innerRow.addEventListener('click', placeSign);
            square.appendChild(innerRow);
        }
        row.appendChild(square);
    }
    container.appendChild(row);
}

// Remove the last row of squares
function removeRow() {
    const rows = container.getElementsByClassName('row');
    if (rows.length > 0) {
        container.removeChild(rows[rows.length - 1]);
    }
}

// Place a sign in an inner row
function placeSign(event) {
    // Do not place a sign if the mouse is over an existing sign
    if (isMouseOverSign) return;

    const innerRow = event.currentTarget;
    const rect = innerRow.getBoundingClientRect();

    // Create a new sign element
    const sign = document.createElement('div');
    sign.className = 'sign';
    sign.textContent = currentSign;
    sign.style.color = signs[currentSign].color;
    sign.style.fontSize = `${signSize}px`;
    sign.style.left = `${rect.width / 2 - signSize / 2}px`;
    sign.style.top = `${rect.height / 2 - signSize / 2}px`;

    // Add event listeners for mouse enter and leave
    sign.addEventListener('mouseenter', () => {
        isMouseOverSign = true;
    });
    sign.addEventListener('mouseleave', () => {
        isMouseOverSign = false;
        clearTimeout(longPressTimer);
    });

    // Add event listeners for long press (delete on hold)
    sign.addEventListener('mousedown', () => {
        longPressTimer = setTimeout(() => {
            isMouseOverSign = false;
            innerRow.removeChild(sign);
        }, longPressDelay);
    });
    sign.addEventListener('mouseup', () => {
        clearTimeout(longPressTimer);
    });

    // Append the sign to the inner row
    innerRow.appendChild(sign);
}

// Delete all signs
function deleteAllSigns() {
    const innerRows = document.getElementsByClassName('inner-row');
    for (const innerRow of innerRows) {
        while (innerRow.firstChild) {
            innerRow.removeChild(innerRow.firstChild);
        }
    }
}

// Change the current sign
function changeSign(newSign) {
    currentSign = newSign;
}

// Update the sign size
function updateSignSize() {
    signSize = parseInt(signSizeInput.value);
}

// Save the music sheet
function saveMusicSheet() {
    const musicSheetData = {
        signSize: signSize,
        rows: []
    };

    // Collect all row data
    const rows = container.getElementsByClassName('row');
    for (const row of rows) {
        const rowData = [];
        const squares = row.getElementsByClassName('square');
        for (const square of squares) {
            const squareData = [];
            const innerRows = square.getElementsByClassName('inner-row');
            for (const innerRow of innerRows) {
                const sign = innerRow.firstChild;
                if (sign) {
                    squareData.push({
                        symbol: sign.textContent,
                        color: sign.style.color,
                        size: parseInt(sign.style.fontSize)
                    });
                } else {
                    squareData.push(null);
                }
            }
            rowData.push(squareData);
        }
        musicSheetData.rows.push(rowData);
    }

    // Convert to JSON and create a downloadable file
    const dataStr = JSON.stringify(musicSheetData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'music_sheet.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Load the music sheet
function loadMusicSheet() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataStr = e.target.result;
                const musicSheetData = JSON.parse(dataStr);

                // Clear existing rows
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                // Restore sign size
                signSize = musicSheetData.signSize;
                signSizeInput.value = signSize;

                // Restore rows and signs
                for (const rowData of musicSheetData.rows) {
                    const row = document.createElement('div');
                    row.className = 'row';
                    for (const squareData of rowData) {
                        const square = document.createElement('div');
                        square.className = 'square';
                        for (const signData of squareData) {
                            const innerRow = document.createElement('div');
                            innerRow.className = 'inner-row';
                            if (signData) {
                                const sign = document.createElement('div');
                                sign.className = 'sign';
                                sign.textContent = signData.symbol;
                                sign.style.color = signData.color;
                                sign.style.fontSize = `${signData.size}px`;
                                sign.style.left = `${innerRow.offsetWidth / 2 - signData.size / 2}px`;
                                sign.style.top = `${innerRow.offsetHeight / 2 - signData.size / 2}px`;

                                // Add event listeners for mouse enter and leave
                                sign.addEventListener('mouseenter', () => {
                                    isMouseOverSign = true;
                                });
                                sign.addEventListener('mouseleave', () => {
                                    isMouseOverSign = false;
                                    clearTimeout(longPressTimer);
                                });

                                // Add event listeners for long press (delete on hold)
                                sign.addEventListener('mousedown', () => {
                                    longPressTimer = setTimeout(() => {
                                        isMouseOverSign = false;
                                        innerRow.removeChild(sign);
                                    }, longPressDelay);
                                });
                                sign.addEventListener('mouseup', () => {
                                    clearTimeout(longPressTimer);
                                });

                                innerRow.appendChild(sign);
                            }
                            square.appendChild(innerRow);
                        }
                        row.appendChild(square);
                    }
                    container.appendChild(row);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Add event listeners
signSizeInput.addEventListener('change', updateSignSize);

// Initial setup
addRow();