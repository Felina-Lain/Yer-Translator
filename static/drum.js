const canvas = document.getElementById('musicSheet');
const ctx = canvas.getContext('2d');
const container = document.getElementById('container');
const sliceCountInput = document.getElementById('sliceCount');
const signSizeInput = document.getElementById('signSize');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 200;
let sliceCount = parseInt(sliceCountInput.value); // Initial slice count
let sliceAngle = (2 * Math.PI) / sliceCount;

// Signs and their properties
const signs = {
    '●': { color: 'black' },
    '—': { color: 'blue' },
    '～': { color: 'green' }
};

let currentSign = '●'; // Default sign
let signSize = parseInt(signSizeInput.value); // Initial sign size

// Track whether the mouse is over a sign
let isMouseOverSign = false;

// Track long press
let longPressTimer = null;
const longPressDelay = 500; // 2 seconds

// Draw the circle and slices
function drawCircle() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw the slices
    for (let i = 0; i < sliceCount; i++) {
        const angle = i * sliceAngle;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Draw a line from the center to the edge of the circle
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

// ... (previous code remains the same)

// Save the music sheet
function saveMusicSheet() {
    const musicSheetData = {
        sliceCount: sliceCount,
        signSize: signSize,
        signs: []
    };

    // Collect all sign data
    const signs = container.getElementsByClassName('sign');
    for (const sign of signs) {
        musicSheetData.signs.push({
            symbol: sign.textContent,
            color: sign.style.color,
            size: parseInt(sign.style.fontSize),
            left: parseFloat(sign.style.left),
            top: parseFloat(sign.style.top)
        });
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

                // Clear existing signs
                deleteAllSigns();

                // Restore slice count and sign size
                sliceCount = musicSheetData.sliceCount;
                sliceCountInput.value = sliceCount;
                signSize = musicSheetData.signSize;
                signSizeInput.value = signSize;
                drawCircle();

                // Restore signs
                for (const signData of musicSheetData.signs) {
                    const sign = document.createElement('div');
                    sign.className = 'sign';
                    sign.textContent = signData.symbol;
                    sign.style.color = signData.color;
                    sign.style.fontSize = `${signData.size}px`;
                    sign.style.left = `${signData.left}px`;
                    sign.style.top = `${signData.top}px`;

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
                            container.removeChild(sign);
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

                    // Append the sign to the container
                    container.appendChild(sign);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Place a sign on the canvas
function placeSign(event) {
    // Do not place a sign if the mouse is over an existing sign
    if (isMouseOverSign) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the angle and distance from the center
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Check if the click is within the circle and on a slice line
    if (distance <= radius) {
        // Snap to the nearest slice line
        const sliceIndex = Math.round(angle / sliceAngle) % sliceCount;
        const snappedAngle = sliceIndex * sliceAngle;

        // Calculate the position for the sign
        const signX = centerX + distance * Math.cos(snappedAngle) - signSize / 2;
        const signY = centerY + distance * Math.sin(snappedAngle) - signSize / 2;

        // Create a new sign element
        const sign = document.createElement('div');
        sign.className = 'sign';
        sign.textContent = currentSign;
        sign.style.color = signs[currentSign].color;
        sign.style.fontSize = `${signSize}px`;
        sign.style.left = `${signX}px`;
        sign.style.top = `${signY}px`;

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
                container.removeChild(sign);                
            }, longPressDelay);
        });
        sign.addEventListener('mouseup', () => {
            clearTimeout(longPressTimer);
        });

        // Append the sign to the container
        container.appendChild(sign);
    }
}

// Delete all signs
function deleteAllSigns() {
    const signs = container.getElementsByClassName('sign');
    while (signs.length > 0) {
        container.removeChild(signs[0]);
    }
}

// Change the current sign
function changeSign(newSign) {
    currentSign = newSign;
}

// Update the number of slices and redraw the circle
function updateSliceCount() {
    sliceCount = parseInt(sliceCountInput.value);
    sliceAngle = (2 * Math.PI) / sliceCount;
    drawCircle();
}

// Update the sign size
function updateSignSize() {
    signSize = parseInt(signSizeInput.value);
}

// Add event listeners
canvas.addEventListener('click', placeSign);
sliceCountInput.addEventListener('change', updateSliceCount);
signSizeInput.addEventListener('change', updateSignSize);

// Initial draw
drawCircle();