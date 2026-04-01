/**
 * --- Configuration & Globals ---
 */
const counts = { us: 190, foods: 5, wfriends: 25, yours: 337, videos: 28 };
const bgMusic = document.getElementById('bg-music');

/**
 * --- Initialization ---
 */
window.addEventListener('DOMContentLoaded', () => {
    loadVideos();

    // Handle initial tab selection via URL
    const tabSelection = new URLSearchParams(window.location.search).get('tab');
    switchTab(null, tabSelection === 'videos' ? 'videos' : 'photos');
});

/**
 * --- Tab & Media Loading ---
 */
function loadVideos() {
    const videoGrid = document.getElementById('main-video-grid');
    if (!videoGrid) return;

    const videosHTML = Array.from({ length: counts.videos }, (_, i) => {
        const src = `/VIDEOS/${i + 1}.mp4`;
        return `
            <div class="video-card" onclick="openLightbox('${src}')">
                <video src="${src}" muted loop autoplay playsinline></video>
            </div>`;
    }).join('');

    videoGrid.innerHTML = videosHTML;
}

function switchTab(event, tabName) {
    // Update Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `btn-${tabName}` || (event && btn === event.currentTarget));
    });

    // Update Content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    closeFolder();
}

/**
 * --- Photo Gallery Logic ---
 */
function openFolder(id) {
    const wrapper = document.getElementById('main-wrapper');
    const folder = document.getElementById('folder-' + id);
    const deck = folder?.querySelector('.card-deck');

    if (!folder || folder.classList.contains('is-open')) return;

    wrapper.classList.add('has-open-folder');
    folder.classList.add('is-open');

    const prefix = id === 'wfriends' ? 'WFRIENDS' : id.toUpperCase();
    const imagesHTML = Array.from({ length: counts[id] }, (_, i) => {
        const src = `/${prefix}/${i + 1}.jpg`;
        return `<div class="card" onclick="openLightbox('${src}')"><img src="${src}" loading="lazy"></div>`;
    }).join('');

    deck.innerHTML = imagesHTML;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeFolder() {
    const wrapper = document.getElementById('main-wrapper');
    if (!wrapper) return;

    wrapper.classList.remove('has-open-folder');

    document.querySelectorAll('.folder-container.is-open').forEach(folder => {
        folder.classList.remove('is-open');
        const id = folder.id.replace('folder-', '');
        const prefix = id === 'wfriends' ? 'WFRIENDS' : id.toUpperCase();

        folder.querySelector('.card-deck').innerHTML = `
            <div class="card"><img src="../${prefix}/1.jpg"></div>
            <div class="card"><img src="../${prefix}/2.jpg"></div>
        `;
    });
}

/**
 * --- Lightbox & Audio Logic ---
 */
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');
    if (!lb || !content) return;

    lb.style.display = 'flex';

    if (src.endsWith('.mp4')) {
        content.innerHTML = `<video src="${src}" controls autoplay loop style="width:100%; height:100%;"></video>`;
        bgMusic?.pause();
    } else {
        content.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:contain;">`;
    }
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');

    if (lb) lb.style.display = 'none';
    if (content) content.innerHTML = '';

    bgMusic?.play().catch(() => console.log("Music resume prevented."));
}

function toggleMusic() {
    if (!bgMusic) return;
    bgMusic.paused ? bgMusic.play().catch(() => {}) : bgMusic.pause();
}

/**
 * --- Decorative & Interactions ---
 */
setInterval(() => {
    const container = document.getElementById('heart-container');
    if (!container) return;

    const h = document.createElement('div');
    h.classList.add('heart');
    h.innerHTML = '❤️';
    h.style.left = `${Math.random() * 100}vw`;

    container.appendChild(h);
    setTimeout(() => h.remove(), 10000);
}, 1000);

// Enable audio on first user interaction
document.addEventListener('click', () => {
    if (bgMusic?.paused) bgMusic.play().catch(() => {});
}, { once: true });