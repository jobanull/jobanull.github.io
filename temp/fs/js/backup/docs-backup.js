// ==================== CENTRAL CONFIGURATION ====================
const VENDOR_CONFIG = {
    huawei: {
        folder: 'configsHuawei',
        cases: {
            '📌 HUAWEI NE Standard Configuration': 'case0',
            '📌 HUAWEI NE MPLS L2VPN': 'case1',
            '📌 HUAWEI NE MPLS L3VPN': 'case2',
            '📌 HUAWEI NE MPLS RR': 'case3',
            '📌 HUAWEI NE MPLS LSP': 'case4'
        },
        titles: {
            'case0': '📌 HUAWEI NE Standard Configuration',
            'case1': '📌 HUAWEI NE MPLS L2VPN',
            'case2': '📌 HUAWEI NE MPLS L3VPN',
            'case3': '📌 HUAWEI NE MPLS RR',
            'case4': '📌 HUAWEI NE MPLS LSP'
        }
    },
    cisco: {
        folder: 'configsCisco',
        cases: {
            '📌 CISCO MPLS L2VPN': 'case0',
            '📌 CISCO MPLS L3VPN': 'case1',
            '📌 CISCO MPLS RR': 'case2',
            '📌 CISCO MPLS LSP': 'case3',
        },
        titles: {
            'case0': '📌 CISCO MPLS L2VPN',
            'case1': '📌 CISCO MPLS L3VPN',
            'case2': '📌 CISCO MPLS RR',
            'case3': '📌 CISCO MPLS LSP'
        }
    }
};

// Base URL untuk config files
const BASE_CONFIG_URL = 'https://ikhdanjoban.vercel.app/nontech/fs';

// Cache untuk menyimpan konfigurasi yang sudah di-load
const configCache = {};

// ==================== MODAL POPUP SYSTEM ====================
function initializeKonverterOlt() {
    console.log('Konverter OLT initialized');
}

function initializeUpDown() {
    console.log('Up-Down initialized');
}

// Fungsi untuk load konfigurasi dari file external
async function loadConfig(vendor, caseId) {
    const cacheKey = `${vendor}_${caseId}`;
    
    // Jika sudah ada di cache, langsung return
    if (configCache[cacheKey]) {
        return configCache[cacheKey];
    }
    
    const vendorConfig = VENDOR_CONFIG[vendor];
    if (!vendorConfig) {
        console.error(`Vendor ${vendor} not found`);
        return null;
    }
    
    const filePath = `${BASE_CONFIG_URL}/${vendorConfig.folder}/${caseId}.js`;
    
    try {
        // Dynamic import untuk ES modules
        const module = await import(filePath);
        
        // Ambil config (support export const config atau export default)
        const configContent = module.config || module.default;
        
        // Simpan ke cache
        configCache[cacheKey] = configContent;
        return configContent;
        
    } catch (error) {
        console.error(`Failed to load ${filePath}:`, error);
        
        // Fallback: coba load dengan fetch
        try {
            const response = await fetch(filePath);
            const text = await response.text();
            
            // Regex yang lebih flexible untuk menangkap konten
            let match = text.match(/export\s+const\s+config\s*=\s*`([\s\S]*?)`\s*;?/);
            if (!match) {
                match = text.match(/export\s+default\s+`([\s\S]*?)`\s*;?/);
            }
            if (!match) {
                match = text.match(/`([\s\S]*?)`/);
            }
            
            if (match && match[1]) {
                configCache[cacheKey] = match[1];
                return match[1];
            }
        } catch (fetchError) {
            console.error('Fetch fallback also failed:', fetchError);
        }
        
        return null;
    }
}

// Fungsi open modal global
async function openGlobalModal(vendor, caseKey) {
    ensureModalContainer();
    
    const vendorConfig = VENDOR_CONFIG[vendor];
    if (!vendorConfig) {
        console.error(`Vendor ${vendor} not configured`);
        return;
    }
    
    const caseId = vendorConfig.cases[caseKey];
    if (!caseId) {
        console.error(`Case "${caseKey}" not found for vendor ${vendor}`);
        return;
    }
    
    const modal = document.getElementById('global-modal');
    const modalTitle = document.getElementById('global-modal-title');
    const modalBody = document.getElementById('global-modal-body');
    
    // Tampilkan loading state
    modalTitle.textContent = 'Loading...';
    modalBody.innerHTML = '<div style="text-align: center; padding: 40px;">⏳ Loading configuration...</div>';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Load config dari file
    const configContent = await loadConfig(vendor, caseId);
    
    if (configContent) {
        // Set title
        modalTitle.textContent = vendorConfig.titles[caseId];
        
        // Extract image from config content
        const imgMatch = configContent.match(/<img[^>]*src="([^"]*)"[^>]*>/);
        const imageSrc = imgMatch ? imgMatch[1] : null;
        
        // Remove image tag from config content untuk ditampilkan di kanan
        let textContent = configContent;
        if (imageSrc) {
            textContent = textContent.replace(/<img[^>]*>/, '');
        }
        
        // Create two-column layout dengan gambar menggunakan object-fit contain
        modalBody.innerHTML = `
            <div class="modal-two-columns">
                <div class="modal-left-column">
                    ${imageSrc ? `<div class="image-container"><img src="${imageSrc}" alt="Network topology diagram" class="modal-contain-image" loading="lazy"></div>` : '<div class="modal-no-image">No Image Available</div>'}
                </div>
                <div class="modal-right-column">
                    <div class="modal-html-content">${textContent}</div>
                </div>
            </div>
        `;
        
        // Tambahkan CSS tambahan untuk styling command dan layout 2 kolom
        const styleFix = document.createElement('style');
        styleFix.id = 'modal-two-columns-style';
        
        // Remove existing style if any
        const existingStyle = document.getElementById('modal-two-columns-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        styleFix.textContent = `
            /* Layout 2 columns - Image besar di kiri, Text auto width di kanan */
            .modal-two-columns {
                display: flex;
                gap: 24px;
                height: 70vh;
                overflow: hidden;
            }
            
            /* Left column - Image container dengan ukuran besar */
            .modal-left-column {
                flex: 2;
                min-width: 400px;
                background: #0d1117;
                border-radius: 12px;
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #2d3748;
                overflow: auto;
                position: relative;
            }
            
            /* Image container untuk contain effect - gambar tidak kepotong */
            .image-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #0a0e14;
                border-radius: 8px;
                min-height: 400px;
            }
            
            /* Gambar dengan object-fit contain - TIDAK KEPOTONG */
            .modal-contain-image {
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                object-fit: contain;
                object-position: center;
                border-radius: 8px;
                transition: transform 0.3s ease;
                display: block;
            }
            
            .modal-contain-image:hover {
                transform: scale(1.02);
            }
            
            /* Right column - Text dengan auto width (mengikuti panjang teks) */
            .modal-right-column {
                flex: 1;
                min-width: 500px;
                max-width: 600px;
                overflow-y: auto;
                padding-right: 10px;
            }
            
            /* Scrollbar styling untuk right column */
            .modal-right-column::-webkit-scrollbar {
                width: 8px;
            }
            
            .modal-right-column::-webkit-scrollbar-track {
                background: #2d3748;
                border-radius: 4px;
            }
            
            .modal-right-column::-webkit-scrollbar-thumb {
                background: #4a5568;
                border-radius: 4px;
            }
            
            .modal-right-column::-webkit-scrollbar-thumb:hover {
                background: #718096;
            }
            
            /* No image styling */
            .modal-no-image {
                background: #1e1e2e;
                border: 2px dashed #4a5568;
                border-radius: 8px;
                padding: 60px 20px;
                text-align: center;
                color: #718096;
                font-family: monospace;
                width: 100%;
            }
            
            /* Content styling */
            .modal-html-content {
                white-space: pre-wrap !important;
                font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace !important;
                font-size: 0.85rem;
                line-height: 1.6;
                background: #0d1117;
                padding: 20px;
                border-radius: 8px;
                color: #f8f8f2;
            }
            
            .modal-html-content .cmd-bold {
                font-weight: 700;
                color: #ffd700;
                padding: 2px 0;
                display: block;
                font-family: monospace;
            }
            
            .modal-html-content .cmd-green {
                font-weight: 700;
                color: #00ff00;
                padding: 2px 0;
                display: block;
                font-family: monospace;
            }
            
            .modal-html-content .cmd-bold2 {
                font-weight: 700;
                color: #87ceeb;
                padding: 2px 0;
                display: block;
                font-family: monospace;
            }
            
            .modal-html-content img.case-image {
                display: none;
            }
            
            .modal-html-content pre {
                background: #1e1e2e;
                padding: 16px;
                border-radius: 8px;
                overflow-x: auto;
                border-left: 3px solid #1a4d8c;
            }
            
            /* Responsive untuk mobile */
            @media (max-width: 968px) {
                .modal-two-columns {
                    flex-direction: column;
                    height: auto;
                    overflow: visible;
                }
                
                .modal-left-column {
                    min-width: auto;
                    min-height: 300px;
                    flex: none;
                }
                
                .image-container {
                    min-height: 300px;
                }
                
                .modal-right-column {
                    max-width: 100%;
                    max-height: 50vh;
                    overflow-y: auto;
                }
            }
            
            /* Untuk layar sangat besar */
            @media (min-width: 1400px) {
                .modal-right-column {
                    max-width: 700px;
                }
                
                .image-container {
                    min-height: 500px;
                }
            }
        `;
        modalBody.appendChild(styleFix);
        
        // Enable copy untuk seluruh konten
        const contentDiv = modalBody.querySelector('.modal-html-content');
        if (contentDiv) {
            // Make content selectable
            contentDiv.style.userSelect = 'text';
            contentDiv.style.webkitUserSelect = 'text';
            
            // Select all text when Ctrl+A
            contentDiv.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                    e.preventDefault();
                    const range = document.createRange();
                    range.selectNodeContents(contentDiv);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                }
            });
            
            // Add copy button functionality
            contentDiv.setAttribute('tabindex', '0');
        }
        
        // Optional: Add zoom functionality for image
        const modalImage = modalBody.querySelector('.modal-contain-image');
        if (modalImage) {
            modalImage.style.cursor = 'pointer';
            modalImage.addEventListener('click', function() {
                // Toggle zoom class
                this.classList.toggle('zoomed');
                if (this.classList.contains('zoomed')) {
                    this.style.transform = 'scale(1.5)';
                    this.style.transition = 'transform 0.3s ease';
                    this.style.cursor = 'zoom-out';
                } else {
                    this.style.transform = 'scale(1)';
                    this.style.cursor = 'zoom-in';
                }
            });
        }
        
    } else {
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #f56565;">
                ❌ Failed to load configuration<br>
                <small>File not found: ${vendorConfig.folder}/${caseId}.js</small>
            </div>
        `;
    }
}

// Function to add copy button to modal header - DIKOSONGKAN (NO COPY BUTTON)
function addCopyButtonToHeader() {
    // Button copy all telah dihapus - fungsi dikosongkan
    return;
}

// Modal container function
function ensureModalContainer() {
    if (document.getElementById('global-modal')) return;
    
    const modalHTML = `
        <div id="global-modal" class="global-modal" onclick="if(event.target === this) closeGlobalModal()">
            <div class="global-modal-content">
                <div class="global-modal-header">
                    <h2 id="global-modal-title">Configuration</h2>
                    <button class="global-modal-close" onclick="closeGlobalModal()">&times;</button>
                </div>
                <div class="global-modal-body" id="global-modal-body">
                    <!-- Content will be injected here -->
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .global-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
        }
        
        .global-modal-content {
            background-color: #1e1e2e;
            margin: 5% auto;
            padding: 0;
            border-radius: 16px;
            width: 90%;
            max-width: 1400px;
            max-height: 85%;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid #1a4d8c;
            animation: globalModalSlideIn 0.25s ease-out;
        }
        
        @keyframes globalModalSlideIn {
            from {
                transform: translateY(-30px) scale(0.98);
                opacity: 0;
            }
            to {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
        
        .global-modal-header {
            padding: 18px 24px;
            background: linear-gradient(135deg, #0d2b4d 0%, #1a4d8c 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #2a5a9c;
        }
        
        .global-modal-header h2 {
            margin: 0;
            font-size: 1.25rem;
            font-family: 'Segoe UI', sans-serif;
            flex: 1;
        }
        
        .global-modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            padding: 0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .global-modal-close:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.1);
        }
        
        .global-modal-body {
            padding: 24px;
            overflow: hidden;
            height: calc(85vh - 80px);
        }
        
        @media (max-width: 768px) {
            .global-modal-content {
                width: 95%;
                margin: 10% auto;
            }
            .global-modal-body {
                padding: 16px;
            }
        }
    `;
    document.head.appendChild(modalStyle);
}

function closeGlobalModal() {
    const modal = document.getElementById('global-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showModalNotification(message) {
    let notification = document.querySelector('.modal-copy-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'modal-copy-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a4d8c;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 10001;
            animation: fadeInOut 1.5s ease;
            font-family: monospace;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.animation = 'none';
    notification.offsetHeight;
    notification.style.animation = 'fadeInOut 1.5s ease';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 1500);
}

// Event listener untuk Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeGlobalModal();
    }
});

// Initialize content events
const originalInitializeContentEvents = window.initializeContentEvents || function() {};
window.initializeContentEvents = function(contentId) {
    if (typeof originalInitializeContentEvents === 'function') {
        originalInitializeContentEvents(contentId);
    }
    
    setTimeout(() => {
        // Cari semua link dengan class case-highlight-link
        const modalLinks = document.querySelectorAll('.case-highlight-link');
        modalLinks.forEach(link => {
            // Deteksi vendor berdasarkan article parent
            const article = link.closest('article');
            let vendor = null;
            
            if (article) {
                const articleId = article.getAttribute('id');
                // Cek apakah articleId ada di VENDOR_CONFIG
                if (VENDOR_CONFIG[articleId]) {
                    vendor = articleId;
                }
            }
            
            if (!vendor) return;
            
            // Dapatkan teks link (case key) - trim untuk menghilangkan spasi berlebih
            const caseKey = link.textContent.trim();
            const vendorConfig = VENDOR_CONFIG[vendor];
            
            // Cek apakah caseKey terdaftar untuk vendor ini
            if (vendorConfig && vendorConfig.cases[caseKey]) {
                // Hapus event listener lama jika ada
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                newLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openGlobalModal(vendor, caseKey);
                });
            } else {
                console.log(`Case key "${caseKey}" not found for vendor ${vendor}`);
            }
        });
    }, 100);
};