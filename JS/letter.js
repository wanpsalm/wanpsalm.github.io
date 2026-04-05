/**
 * --- Password Logic ---
 */
function checkPassword() {
    const input = document.getElementById('passInput');
    const errorMsg = document.getElementById('error');
    const passValue = input.value.toLowerCase();
    const correctPass = "010926ily";

    if (passValue === correctPass) {
        unlockContent();
    } else {
        if (errorMsg) errorMsg.style.display = 'block';
        input.value = "";
    }
}

function unlockContent() {
    const overlay = document.getElementById('password-overlay');
    const wrapper = document.getElementById('content-wrapper');

    if (overlay) overlay.style.opacity = '0';

    setTimeout(() => {
        if (overlay) overlay.style.display = 'none';
        
        if (wrapper) {
            wrapper.style.filter = 'none';
            wrapper.style.pointerEvents = 'auto';
        }
        
        // Initialize scratch card after the transition
        initScratch(); 
    }, 600);
}

// Listen for Enter key on password input
document.getElementById("passInput").addEventListener("keyup", (event) => {
    if (event.key === "Enter") checkPassword();
});

/**
 * --- Scratch Card Logic ---
 */
function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Canvas Setup: Silver scratch surface
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Instruction text
    ctx.fillStyle = '#888';
    ctx.font = '14px Quicksand';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here...', canvas.width / 2, canvas.height / 2 + 5);

    function getPointerPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function scratch(e) {
        if (!isDrawing) return;
        
        const pos = getPointerPos(e);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    // Event Listeners
    const startDrawing = () => isDrawing = true;
    const stopDrawing = () => isDrawing = false;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    
    window.addEventListener('mouseup', stopDrawing);
    window.addEventListener('touchend', stopDrawing);
    
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', (e) => {
        scratch(e);
        e.preventDefault(); // Prevents scrolling while scratching
    }, { passive: false });
}

/**
 * --- Navigation ---
 */
function goToGallery(type) {
    // Redirects to gallery with tab parameter
    window.location.href = `/HTML/gallery.html?tab=${type}`;
}