// ==================== NAVIGATION & DYNAMIC CONTENT ====================
const contentContainer = document.getElementById('content');
const navButtons = document.querySelectorAll('.nav-list button');
let currentArticleId = 'cek-users';
const contentCache = {};
const isLocalFile = window.location.protocol === 'file:';

// Predefined content untuk fallback
const predefinedContent = {
    'cek-users': `<!-- konten cek-users -->`,
    'cek-crc': `<!-- konten cek-crc -->`,
    // ... tambahkan konten lainnya di sini
};

// ============================================================
// SIDEBAR TOGGLE FUNCTIONALITY
// ============================================================
const burger = document.getElementById('burgerMenu');
const sidebar = document.querySelector('nav');
const overlay = document.getElementById('sidebarOverlay');
const main = document.querySelector('main');

// Cek apakah di mobile
function isMobile() {
    return window.innerWidth <= 900;
}

// Pastikan sidebar tertutup saat halaman dimuat
function initializeSidebarClosed() {
    if (isMobile()) {
        // Mobile: pastikan sidebar tersembunyi
        sidebar.classList.remove('sidebar-visible');
        sidebar.classList.add('sidebar-hidden');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        burger.classList.remove('active');
        // console.log('📱 Sidebar initialized: CLOSED (mobile)');
    } else {
        // Desktop: pastikan sidebar tersembunyi
        sidebar.classList.add('sidebar-hidden');
        main.classList.add('sidebar-hidden');
        burger.classList.remove('active');
        // console.log('🖥️ Sidebar initialized: CLOSED (desktop)');
    }
}

// Toggle sidebar
function toggleSidebar() {
    if (isMobile()) {
        // Mobile: slide in/out dengan overlay
        const isVisible = sidebar.classList.contains('sidebar-visible');
        if (isVisible) {
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            burger.classList.remove('active');
        } else {
            sidebar.classList.remove('sidebar-hidden');
            sidebar.classList.add('sidebar-visible');
            overlay.classList.add('active');
            document.body.classList.add('sidebar-open');
            burger.classList.add('active');
        }
        // console.log('📱 Mobile toggle - sidebar visible:', sidebar.classList.contains('sidebar-visible'));
    } else {
        // Desktop: hide/show dengan animasi slide
        const isHidden = sidebar.classList.contains('sidebar-hidden');
        if (isHidden) {
            sidebar.classList.remove('sidebar-hidden');
            main.classList.remove('sidebar-hidden');
            burger.classList.add('active');
        } else {
            sidebar.classList.add('sidebar-hidden');
            main.classList.add('sidebar-hidden');
            burger.classList.remove('active');
        }
        // console.log('🖥️ Desktop toggle - sidebar hidden:', sidebar.classList.contains('sidebar-hidden'));
    }
}

// Event listener burger
if (burger) {
    burger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });
    // console.log('✅ Burger button ditemukan');
} else {
    // console.error('❌ Burger button tidak ditemukan!');
}

// Close sidebar when overlay is clicked (hanya untuk mobile)
if (overlay) {
    overlay.addEventListener('click', function() {
        if (isMobile()) {
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            burger.classList.remove('active');
        }
    });
}

// ============================================================
// PRTG RECTI - ACTIVE ON LOAD
// ============================================================
// Hapus class active dari semua tombol
const allButtons = document.querySelectorAll('.nav-list button');
allButtons.forEach(btn => btn.classList.remove('active'));

// Cari tombol PRTG Recti
const prtgButton = document.querySelector('button[data-target="prtg"]');
if (prtgButton) {
    prtgButton.classList.add('active');
    
    // Load konten PRTG
    if (typeof loadContent === 'function') {
        if (document.readyState === 'complete') {
            loadContent('prtg');
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                loadContent('prtg');
            });
        }
    }
}

// ============================================================
// CLOSE SIDEBAR WHEN CLICKING NAV LINK (MOBILE)
// ============================================================
document.querySelectorAll('.nav-list button').forEach(button => {
    button.addEventListener('click', function() {
        if (isMobile()) {
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            burger.classList.remove('active');
        }
    });
});

// ============================================================
// CLOSE SIDEBAR WITH ESC KEY
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (isMobile()) {
            if (sidebar.classList.contains('sidebar-visible')) {
                sidebar.classList.remove('sidebar-visible');
                sidebar.classList.add('sidebar-hidden');
                overlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
                burger.classList.remove('active');
            }
        } else {
            if (!sidebar.classList.contains('sidebar-hidden')) {
                sidebar.classList.add('sidebar-hidden');
                main.classList.add('sidebar-hidden');
                burger.classList.remove('active');
            }
        }
    }
});

// ============================================================
// HANDLE RESIZE
// ============================================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const mobile = isMobile();
        // console.log('🔄 Resize - Mobile mode:', mobile);
        
        if (!mobile) {
            // Reset mobile states
            sidebar.classList.remove('sidebar-visible');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            
            // Jika sidebar belum hidden di desktop, sembunyikan
            if (!sidebar.classList.contains('sidebar-hidden')) {
                sidebar.classList.add('sidebar-hidden');
                main.classList.add('sidebar-hidden');
                burger.classList.remove('active');
            }
        } else {
            // Di mobile, pastikan sidebar dalam keadaan hidden
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            burger.classList.remove('active');
        }
    }, 250);
});

// ============================================================
// TOGGLE KEYBOARD SHORTCUT (Ctrl+B)
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
        // console.log('⌨️ Keyboard shortcut Ctrl+B pressed');
    }
});

// ============================================================
// INITIALIZE - SIDEBAR CLOSED ON LOAD
// ============================================================
// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi sidebar dalam keadaan tertutup
    initializeSidebarClosed();
    // console.log('✅ Sidebar initialized: CLOSED');
});

// Jalankan juga segera jika DOM sudah siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSidebarClosed);
} else {
    initializeSidebarClosed();
}

// Debug info
// console.log('✅ Sidebar toggle initialized');
// console.log('📱 Mobile mode:', isMobile());
// console.log('🔘 Burger display:', window.getComputedStyle(burger).display);
// console.log('💡 Tip: Tekan Ctrl+B untuk toggle sidebar');

// ==================== FUNGSI LAINNYA ====================

// Fungsi untuk memuat konten
async function loadContent(contentId) {
    // Jika sudah ada di cache, gunakan cache
    if (contentCache[contentId]) {
        contentContainer.innerHTML = contentCache[contentId];
        initializeContentEvents(contentId);
        return;
    }
    
    // Jika membuka dari file:// dan konten sudah di-predefine, gunakan itu
    if (isLocalFile && predefinedContent[contentId]) {
        contentContainer.innerHTML = predefinedContent[contentId];
        contentCache[contentId] = predefinedContent[contentId];
        initializeContentEvents(contentId);
        return;
    }
    
    try {
        contentContainer.innerHTML = '<div id="loading">Memuat konten...</div>';
        
        // Gunakan XMLHttpRequest untuk menghindari masalah CORS
        const html = await loadFileWithXHR(`https://ikhdanjoban.vercel.app/nontech/fs/${contentId}.html`);
        
        contentCache[contentId] = html;
        contentContainer.innerHTML = html;
        initializeContentEvents(contentId);
        
    } catch (error) {
        // console.error('Error loading content:', error);
        
        // Fallback: coba load dengan cara lain
        if (predefinedContent[contentId]) {
            contentContainer.innerHTML = predefinedContent[contentId];
            contentCache[contentId] = predefinedContent[contentId];
            initializeContentEvents(contentId);
        } else {
            contentContainer.innerHTML = `
                <div class="error-message">
                    <h2>⚠️ Perhatian: Mode File Lokal</h2>
                    <p>Browser membatasi akses ke file lokal karena keamanan.</p>
                    <p>Gunakan salah satu cara berikut:</p>
                    <ol>
                        <li>Buka dengan Live Server di VS Code</li>
                        <li>Jalankan command: <code>python -m http.server 8000</code></li>
                        <li>Atau gunakan browser dengan flag <code>--allow-file-access-from-files</code></li>
                    </ol>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Fungsi untuk load file dengan XMLHttpRequest (lebih kompatibel)
function loadFileWithXHR(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
        };
        xhr.onerror = function() {
            reject(new Error('Network error atau CORS policy'));
        };
        xhr.send();
    });
}

// Fungsi untuk inisialisasi event listeners pada konten
function initializeContentEvents(contentId) {
    // Triple click to copy code blocks
    document.querySelectorAll('pre.tree').forEach(pre => {
        pre.replaceWith(pre.cloneNode(true));
    });
    
    document.querySelectorAll('pre.tree').forEach(pre => {
        pre.addEventListener('click', (e) => {
            if (e.detail === 3) {
                const text = pre.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    pre.style.border = '1px solid rgba(59,130,246,0.5)';
                    setTimeout(() => {
                        pre.style.border = '1px dashed rgba(255,255,255,0.03)';
                    }, 800);
                });
            }
        });
    });
    
    // Inisialisasi komponen khusus berdasarkan contentId
    switch(contentId) {
        case 'konverter-olt':
            setTimeout(() => initializeKonverterOlt(), 100);
            break;
        case 'up-down':
            setTimeout(() => initializeUpDown(), 100);
            break;
        case 'sns-shut-noshut':  
            setTimeout(() => {
                if (typeof initializeSnsShutNoshut === 'function') {
                    initializeSnsShutNoshut();
                }
            }, 100);
            break;
        case 'power':
            setTimeout(() => {
                if (typeof initializeSnsPower === 'function') {
                    initializeSnsPower();
                } else {
                    // console.warn('initializeSnsPower function not found');
                }
            }, 100);
            break;
        case 'ptt':
            setTimeout(() => initializeOltCs(), 100);
            break;
        case 'daily':
            setTimeout(() => {
                if (window.initTextStorage) {
                    window.initTextStorage();
                }
            }, 100);
            break;
        case 'prtg':
        setTimeout(() => {
            if (typeof initializePrtg === 'function') {
                initializePrtg();
            } else {
                // console.error('initializePrtg function not found');
            }
        }, 100);
        break;
    }
    
    // Update current article
    currentArticleId = contentId;
}

// Event listeners untuk tombol navigasi
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        
        // Update active button
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Load konten
        loadContent(targetId);
        
        // Scroll to top of content
        contentContainer.scrollTop = 0;
    });
});

// Load konten default saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
    // Cek apakah ada button active, jika tidak set yang pertama
    const activeButton = document.querySelector('.nav-list button.active');
    const firstButton = document.querySelector('.nav-list button');
    
    if (activeButton) {
        loadContent(activeButton.getAttribute('data-target'));
    } else if (firstButton) {
        firstButton.classList.add('active');
        loadContent(firstButton.getAttribute('data-target'));
    }
});

// ==================== OLT CS SCRIPT ====================
function initializeOltCs() {
    // Elements
    const oltCsTextarea = document.getElementById('oltCsTextarea');
    const saveOltCsBtn = document.getElementById('saveOltCsBtn');
    const clearOltCsBtn = document.getElementById('clearOltCsBtn');
    const copyOltCsBtn = document.getElementById('copyOltCsBtn');
    const charCountOLTCS = document.getElementById('charCountOLTCS');
    const storageStatus = document.getElementById('storageStatus');
    const lastSaved = document.getElementById('lastSaved');
    
    // Jika elemen tidak ditemukan, keluar
    if (!oltCsTextarea) {
        return;
    }
    
    // Constants
    const STORAGE_KEY = 'olt_cs_notes';
    const SAVE_DELAY = 1000;
    
    // Variables
    let saveTimeout = null;
    let autoSaveEnabled = true;
    
    // Initialize from localStorage
    function loadFromStorage() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                oltCsTextarea.value = savedData;
                updateCharCount();
                updateLastSavedTime();
                showStatus('Data dimuat dari penyimpanan', 'success');
            }
        } catch (error) {
            // console.error('Error loading from localStorage:', error);
            showStatus('Gagal memuat data dari penyimpanan', 'error');
        }
    }
    
    // Save to localStorage
    function saveToStorage() {
        try {
            const text = oltCsTextarea.value;
            localStorage.setItem(STORAGE_KEY, text);
            localStorage.setItem(`${STORAGE_KEY}_timestamp`, Date.now().toString());
            updateLastSavedTime();
            showStatus('Data disimpan', 'success');
            
            if (saveOltCsBtn) {
                saveOltCsBtn.classList.add('save-confirmation');
                setTimeout(() => {
                    saveOltCsBtn.classList.remove('save-confirmation');
                }, 500);
            }
        } catch (error) {
            // console.error('Error saving to localStorage:', error);
            showStatus('Gagal menyimpan data', 'error');
        }
    }
    
    // Clear data
    function clearData() {
        if (confirm('Apakah Anda yakin ingin menghapus semua teks?')) {
            oltCsTextarea.value = '';
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(`${STORAGE_KEY}_timestamp`);
            updateCharCount();
            showStatus('Data dihapus', 'info');
            if (lastSaved) lastSaved.textContent = '';
        }
    }
    
    // Copy to clipboard
    function copyToClipboard() {
        if (!oltCsTextarea.value.trim()) {
            showStatus('Tidak ada teks untuk disalin', 'error');
            return;
        }
        
        oltCsTextarea.select();
        oltCsTextarea.setSelectionRange(0, 99999);
        
        try {
            const successful = navigator.clipboard.writeText(oltCsTextarea.value);
            if (successful) {
                showStatus('Teks disalin ke clipboard', 'success');
            } else {
                document.execCommand('copy');
                showStatus('Teks disalin ke clipboard', 'success');
            }
        } catch (err) {
            document.execCommand('copy');
            showStatus('Teks disalin ke clipboard', 'success');
        }
    }
    
    // Update character count
    function updateCharCount() {
        if (!charCountOLTCS) return;
        
        const count = oltCsTextarea.value.length;
        charCountOLTCS.textContent = count;
        
        if (count > 1000) {
            charCountOLTCS.style.color = '#f56565';
        } else if (count > 500) {
            charCountOLTCS.style.color = '#ed8936';
        } else {
            charCountOLTCS.style.color = '#48bb78';
        }
    }
    
    // Update last saved time
    function updateLastSavedTime() {
        if (!lastSaved) return;
        
        try {
            const lastSavedData = localStorage.getItem(`${STORAGE_KEY}_timestamp`);
            if (lastSavedData) {
                const date = new Date(parseInt(lastSavedData));
                lastSaved.textContent = `Terakhir disimpan: ${formatTime(date)}`;
            } else {
                lastSaved.textContent = '';
            }
        } catch (error) {
            lastSaved.textContent = '';
        }
    }
    
    // Format time for display
    function formatTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 1) {
            return 'baru saja';
        } else if (diffMins < 60) {
            return `${diffMins} menit yang lalu`;
        } else if (diffHours < 24) {
            return `${diffHours} jam yang lalu`;
        } else {
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    // Show status message
    function showStatus(message, type = 'info') {
        if (!storageStatus) return;
        
        storageStatus.textContent = message;
        
        const icon = storageStatus.previousElementSibling;
        if (icon) {
            switch (type) {
                case 'success':
                    icon.style.color = '#48bb78';
                    break;
                case 'error':
                    icon.style.color = '#f56565';
                    break;
                case 'info':
                    icon.style.color = '#4299e1';
                    break;
            }
        }
        
        if (window.statusTimeout) {
            clearTimeout(window.statusTimeout);
        }
        
        window.statusTimeout = setTimeout(() => {
            if (storageStatus) {
                storageStatus.textContent = 'Data has been saved';
                if (icon) icon.style.color = '#48bb78';
            }
        }, 3000);
    }
    
    // Auto-save function
    function scheduleAutoSave() {
        if (!autoSaveEnabled) return;
        
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        
        saveTimeout = setTimeout(() => {
            if (oltCsTextarea.value.trim()) {
                saveToStorage();
            }
        }, SAVE_DELAY);
    }
    
    // Event Listeners
    oltCsTextarea.addEventListener('input', function() {
        updateCharCount();
        scheduleAutoSave();
    });
    
    oltCsTextarea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveToStorage();
        }
        
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            clearData();
        }
        
        if (e.ctrlKey && e.key === 'c' && window.getSelection().toString()) {
            setTimeout(copyToClipboard, 100);
        }
    });
    
    if (saveOltCsBtn) saveOltCsBtn.addEventListener('click', saveToStorage);
    if (clearOltCsBtn) clearOltCsBtn.addEventListener('click', clearData);
    if (copyOltCsBtn) copyOltCsBtn.addEventListener('click', copyToClipboard);
    
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            oltCsTextarea.focus();
        }
    });
    
    // Initialize
    loadFromStorage();
    
    window.addEventListener('beforeunload', function() {
        if (oltCsTextarea.value.trim() && autoSaveEnabled) {
            saveToStorage();
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && oltCsTextarea.value.trim() && autoSaveEnabled) {
            saveToStorage();
        }
    });
}

// ==================== TEXT STORAGE SYSTEM ====================
const DAILY_SECTION_ID = 'daily';
const TEXTAREA_ID = 'daily-textarea';
const SAVE_BUTTON_ID = 'save-daily';
const SERVER_URL = 'http://localhost:5500';

let textStorageInitialized = false;

function initTextStorage() {
    const textarea = document.getElementById('daily-textarea');
    const saveButton = document.getElementById('save-daily');
    
    if (!textarea || !saveButton) {
        // console.error('Textarea or save button not found');
        return false;
    }
    
    if (textarea._saveHandler) {
        textarea.removeEventListener('input', textarea._saveHandler);
    }
    if (saveButton._clickHandler) {
        saveButton.removeEventListener('click', saveButton._clickHandler);
    }
    
    async function checkServer() {
        try {
            const response = await fetch(`${SERVER_URL}/status`, {
                method: 'GET',
                mode: 'cors'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    async function loadData() {
        try {
            const response = await fetch(`${SERVER_URL}/load`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            textarea.value = data.text || "";
            showNotification('Data dimuat dari server', 'success');
            
        } catch (error) {
            // console.warn('Cannot load from server, using localStorage:', error);
            
            try {
                const savedText = localStorage.getItem('daily_backup');
                if (savedText) {
                    textarea.value = savedText;
                    showNotification('Data dimuat dari backup browser', 'info');
                }
            } catch (localError) {
                // console.error('LocalStorage error:', localError);
            }
        }
    }
    
    async function saveData() {
        const text = textarea.value;
        
        try {
            const response = await fetch(`${SERVER_URL}/save`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const result = await response.json();
            
            try {
                localStorage.setItem('daily_backup', text);
            } catch (e) {
                // console.warn('Cannot save to localStorage:', e);
            }
            
            showNotification(`Teks disimpan (${text.length} karakter)`, 'success');
            
        } catch (error) {
            // console.error('Save error:', error);
            
            try {
                localStorage.setItem('daily_backup', text);
                showNotification('Disimpan ke browser (server offline)', 'info');
            } catch (localError) {
                showNotification('Gagal menyimpan', 'error');
            }
        }
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    const debouncedSave = debounce(saveData, 2000);
    
    const inputHandler = function() {
        debouncedSave();
    };
    
    const clickHandler = function(e) {
        e.preventDefault();
        saveData();
    };
    
    textarea.addEventListener('input', inputHandler);
    saveButton.addEventListener('click', clickHandler);
    
    textarea._saveHandler = inputHandler;
    saveButton._clickHandler = clickHandler;
    
    setTimeout(() => {
        checkServer().then(isOnline => {
            if (isOnline) {
                loadData();
            } else {
                showNotification('Server offline, menggunakan mode lokal', 'warning');
                loadData();
            }
        });
    }, 500);
    
    return true;
}

function cleanupTextStorage() {
    const textarea = document.getElementById(TEXTAREA_ID);
    const saveButton = document.getElementById(SAVE_BUTTON_ID);
    
    if (textarea && textarea._inputHandler) {
        textarea.removeEventListener('input', textarea._inputHandler);
        delete textarea._inputHandler;
    }
    
    if (saveButton && saveButton._clickHandler) {
        saveButton.removeEventListener('click', saveButton._clickHandler);
        delete saveButton._clickHandler;
    }
    
    textStorageInitialized = false;
}

function showNotification(message, type = 'info') {
    let notification = document.querySelector('.text-storage-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'text-storage-notification';
        
        const style = document.createElement('style');
        style.textContent = `
            .text-storage-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }
            .text-storage-notification.success {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            .text-storage-notification.error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            .text-storage-notification.info {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `text-storage-notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function setupContentObserver() {
    const contentContainer = document.getElementById('content');
    
    if (!contentContainer) {
        // console.error('Content container not found');
        return;
    }
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const dailySection = document.getElementById(DAILY_SECTION_ID);
                if (dailySection && dailySection.offsetParent !== null) {
                    setTimeout(initTextStorage, 50);
                }
            }
        });
    });
    
    observer.observe(contentContainer, {
        childList: true,
        subtree: true
    });
}

window.initTextStorage = initTextStorage;

document.addEventListener('DOMContentLoaded', function() {
    setupContentObserver();
    
    setTimeout(() => {
        const dailySection = document.getElementById(DAILY_SECTION_ID);
        if (dailySection) {
            initTextStorage();
        }
    }, 500);
});

// ==================== HELPER FUNCTIONS ====================
function initializeKonverterOlt() {
    // Implementasi konverter OLT
    // console.log('Konverter OLT initialized');
}

function initializeUpDown() {
    // Implementasi up-down
    // console.log('Up-Down initialized');
}