const canvas = document.getElementById('musicSheet');
const ctx = canvas.getContext('2d');
const canvasContainer = document.getElementById('canvas-container');
const rowsInput = document.getElementById('rows');
const columnsInput = document.getElementById('columns');
const signSizeInput = document.getElementById('signSize');

const quarterCircleSections = 5; // Each quarter circle is divided into 5 sections
let rows = parseInt(rowsInput.value); // Number of rows
let columns = parseInt(columnsInput.value); // Number of columns per row
let signSize = parseInt(signSizeInput.value); // Initial sign size

// Signs and their properties
const signs = {
    '↑': { color: 'black' },
    '↓': { color: 'blue' }
};

let currentSign = '↑'; // Default sign

// Track whether the mouse is over a sign
let isMouseOverSign = false;

// Track long press
let longPressTimer = null;
const longPressDelay = 2000; // 2 seconds

// Draw the quarter circles
function drawQuarterCircles() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const quarterCircleRadius = 100; // Radius of each quarter circle
    const spacing = 20; // Spacing between quarter circles
    const startX = 50; // Starting X position
    const startY = 50; // Starting Y position

    // Calculate the required canvas size based on rows and columns
    const requiredWidth = startX + columns * (quarterCircleRadius * 2 + spacing);
    const requiredHeight = startY + rows * (quarterCircleRadius * 2 + spacing);

    // Resize the canvas if necessary
    if (canvas.width < requiredWidth || canvas.height < requiredHeight) {
        canvas.width = requiredWidth;
        canvas.height = requiredHeight;
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const centerX = startX + col * (quarterCircleRadius * 2 + spacing);
            const centerY = startY + row * (quarterCircleRadius * 2 + spacing);

            // Draw the quarter circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, quarterCircleRadius, 0, Math.PI / 2);
            ctx.stroke();

            // Draw the 5 sections
            for (let i = 0; i < quarterCircleSections; i++) {
                const angle = (i * Math.PI / 2) / quarterCircleSections;
                const x = centerX + quarterCircleRadius * Math.cos(angle);
                const y = centerY + quarterCircleRadius * Math.sin(angle);

                // Draw a small marker for each section
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

// Check if a click is near a section marker
function getNearestSection(mouseX, mouseY) {
    const quarterCircleRadius = 100; // Radius of each quarter circle
    const spacing = 20; // Spacing between quarter circles
    const startX = 50; // Starting X position
    const startY = 50; // Starting Y position

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const centerX = startX + col * (quarterCircleRadius * 2 + spacing);
            const centerY = startY + row * (quarterCircleRadius * 2 + spacing);

            for (let i = 0; i < quarterCircleSections; i++) {
                const angle = (i * Math.PI / 2) / quarterCircleSections;
                const sectionX = centerX + quarterCircleRadius * Math.cos(angle);
                const sectionY = centerY + quarterCircleRadius * Math.sin(angle);

                // Check if the click is near this section
                const distance = Math.sqrt((mouseX - sectionX) ** 2 + (mouseY - sectionY) ** 2);
                if (distance <= 10) { // 10px threshold for snapping
                    return { x: sectionX, y: sectionY };
                }
            }
        }
    }
    return null; // No section nearby
}

// Place a sign on the canvas
function placeSign(event) {
    // Do not place a sign if the mouse is over an existing sign
    if (isMouseOverSign) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Find the nearest section
    const section = getNearestSection(mouseX, mouseY);
    if (!section) return; // Do nothing if no section is nearby

    // Calculate the position for the sign relative to the canvas
    const signX = section.x - signSize / 2;
    const signY = section.y - signSize / 2;

    // Create a new sign element
    const sign = document.createElement('div');
    sign.className = 'sign';
    sign.textContent = currentSign;
    sign.style.color = signs[currentSign].color;
    sign.style.fontSize = `${signSize}px`;
    sign.style.left = `${rect.left + signX}px`;
    sign.style.top = `${rect.top + signY}px`;

    // Add event listeners for mouse enter and leave
    const onMouseEnter = () => {
        isMouseOverSign = true;
    };
    const onMouseLeave = () => {
        isMouseOverSign = false;
    };
    sign.addEventListener('mouseenter', onMouseEnter);
    sign.addEventListener('mouseleave', onMouseLeave);

    // Add event listeners for long press (delete on hold)
    const onMouseDown = () => {
        longPressTimer = setTimeout(() => {
            document.body.removeChild(sign);
            isMouseOverSign = false; // Reset the flag when the sign is deleted
            sign.removeEventListener('mouseenter', onMouseEnter);
            sign.removeEventListener('mouseleave', onMouseLeave);
        }, longPressDelay);
    };
    const onMouseUp = () => {
        clearTimeout(longPressTimer);
    };
    sign.addEventListener('mousedown', onMouseDown);
    sign.addEventListener('mouseup', onMouseUp);
    sign.addEventListener('mouseleave', onMouseUp);

    // Append the sign to the body (positioned relative to the canvas)
    document.body.appendChild(sign);
}

// Delete all signs
function deleteAllSigns() {
    const signs = document.getElementsByClassName('sign');
    while (signs.length > 0) {
        document.body.removeChild(signs[0]);
    }
    isMouseOverSign = false; // Reset the flag when all signs are deleted
}

// Change the current sign
function changeSign(newSign) {
    currentSign = newSign;
}

// Update the grid layout and redraw the quarter circles
function updateGridLayout() {
    rows = parseInt(rowsInput.value);
    columns = parseInt(columnsInput.value);
    drawQuarterCircles();
}

// Update the sign size
function updateSignSize() {
    signSize = parseInt(signSizeInput.value);
}

// Add event listeners
canvas.addEventListener('click', placeSign);
rowsInput.addEventListener('change', updateGridLayout);
columnsInput.addEventListener('change', updateGridLayout);
signSizeInput.addEventListener('change', updateSignSize);

// Initial draw
drawQuarterCircles();