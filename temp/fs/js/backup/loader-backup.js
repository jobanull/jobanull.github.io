(function() {
    'use strict';
    
    // ===== KONFIGURASI =====
    const OVERLAY_IMAGE_URL = 'https://ikhdanjoban.vercel.app/nontech/fs/img/impostor.png';
    
    // ===== QUEUE SYSTEM UNTUK INISIALISASI =====
    const INIT_QUEUE = {
        tasks: [],
        isProcessing: false,
        isInitialized: false,
        completed: {
            prtg: false,
            konverterOlt: false,
            upDown: false,
            snsShutNoshut: false,
            snsPower: false
        }
    };
    
    const scripts = [
        "https://ikhdanjoban.vercel.app/nontech/fs/js/backup/prtg-backup.js",
        "https://ikhdanjoban.vercel.app/nontech/fs/js/backup/script-backup.js",
        "https://ikhdanjoban.vercel.app/nontech/fs/js/backup/docs-backup.js",
        "https://ikhdanjoban.vercel.app/nontech/fs/js/backup/olt-backup.js"
    ];

    //  const scripts = [
    //     "https://ikhdanjoban.vercel.app/nontech/fs/js/prtg.min.js",
    //     "https://ikhdanjoban.vercel.app/nontech/fs/js/script.min.js",
    //     "https://ikhdanjoban.vercel.app/nontech/fs/js/docs.min.js",
    //     "https://ikhdanjoban.vercel.app/nontech/fs/js/olt.min.js"
    // ];


    // ===== BUAT ELEMEN LOADER =====
    function createLoader() {
        if (document.getElementById('fullpage-loader')) return;
        
        const loaderHTML = `
            <div id="fullpage-loader">
                <img 
                    src="${OVERLAY_IMAGE_URL}" 
                    alt="Loading" 
                    class="overlay-image"
                >
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <div class="loader-text">Memuat sumber daya...</div>
                    <div class="loader-progress">
                        <div class="loader-progress-bar" id="loaderProgressBar"></div>
                    </div>
                    <div class="loader-detail" id="loaderDetail">Mempersiapkan resource...</div>
                    <div class="loader-size-info" id="loaderSizeInfo">📦 Mendownload file</div>
                    <div class="loader-status" id="loaderStatus">⏳ Memuat script...</div>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            #fullpage-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0a0e1a;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                transition: opacity 0.8s ease, visibility 0.8s ease;
            }
            
            #fullpage-loader .overlay-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.15;
                z-index: 1;
                pointer-events: none;
            }
            
            #fullpage-loader .loader-content {
                position: relative;
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            #fullpage-loader.hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }
            
            .loader-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255, 255, 255, 0.1);
                border-top-color: #4f8cf7;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .loader-text {
                margin-top: 24px;
                color: #a0b4d0;
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                font-size: 16px;
                letter-spacing: 0.5px;
                font-weight: 400;
            }
            
            .loader-progress {
                margin-top: 16px;
                width: 300px;
                height: 4px;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .loader-progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #4f8cf7, #7c6df0, #e74c8b);
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            
            .loader-detail {
                margin-top: 12px;
                color: #6a7f9e;
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                font-size: 13px;
                letter-spacing: 0.3px;
                font-weight: 300;
            }
            
            .loader-size-info {
                margin-top: 8px;
                color: #4a5f7e;
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                font-size: 12px;
                letter-spacing: 0.3px;
                font-weight: 300;
            }
            
            .loader-status {
                margin-top: 8px;
                color: #4a5f7e;
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                font-size: 11px;
                letter-spacing: 0.3px;
                font-weight: 300;
                opacity: 0.7;
            }
            
            body:not(.loaded) main,
            body:not(.loaded) .burger-menu,
            body:not(.loaded) .sidebar-overlay,
            body:not(.loaded) .master-overlay {
                opacity: 0 !important;
                visibility: hidden !important;
            }
            
            body.loaded main,
            body.loaded .burger-menu,
            body.loaded .sidebar-overlay,
            body.loaded .master-overlay {
                opacity: 1 !important;
                visibility: visible !important;
                transition: opacity 0.4s ease;
            }
        `;
        document.head.appendChild(style);
        document.body.insertAdjacentHTML('beforebegin', loaderHTML);
    }

    createLoader();

    // ===== ELEMEN LOADER =====
    const loader = document.getElementById('fullpage-loader');
    const progressBar = document.getElementById('loaderProgressBar');
    const loaderDetail = document.getElementById('loaderDetail');
    const loaderSizeInfo = document.getElementById('loaderSizeInfo');
    const loaderStatus = document.getElementById('loaderStatus');
    const body = document.body;

    // ===== STATUS =====
    let totalResources = 0;
    let loadedResources = 0;
    let isResourcesLoaded = false;
    let isDelayFinished = false;
    let scriptsLoadedCount = 0;
    let totalScripts = scripts.length;
    let isLoaderHidden = false;

    // ===== KONFIGURASI =====
    const MIN_LOADING_DURATION = 2000;
    const EXTRA_DELAY_AFTER_LOAD = 1000;
    let startTime = Date.now();

    // ===== UPDATE PROGRESS =====
    function updateProgress() {
        const progress = Math.min((loadedResources / totalResources) * 100, 100);
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        if (loaderDetail) {
            if (progress < 20) {
                loaderDetail.textContent = '⏳ Mengunduh stylesheet...';
            } else if (progress < 40) {
                loaderDetail.textContent = '⚙️ Memuat script utama...';
            } else if (progress < 60) {
                loaderDetail.textContent = '📦 Menginisialisasi modul...';
            } else if (progress < 80) {
                loaderDetail.textContent = '🖼️ Mendownload gambar...';
            } else if (progress < 100) {
                loaderDetail.textContent = '✨ Mempersiapkan tampilan...';
            } else {
                loaderDetail.textContent = '✅ Semua resource selesai!';
            }
        }

        if (loaderSizeInfo) {
            if (progress < 80) {
                loaderSizeInfo.textContent = `📦 Mendownload file (${Math.round(progress)}%)`;
            } else if (progress < 100) {
                loaderSizeInfo.textContent = '🖼️ Memproses gambar...';
            } else {
                loaderSizeInfo.textContent = '✅ Semua resource selesai di-download';
            }
        }

        if (loaderStatus) {
            if (scriptsLoadedCount < totalScripts) {
                loaderStatus.textContent = `⏳ Memuat script ${scriptsLoadedCount + 1}/${totalScripts}...`;
            } else {
                loaderStatus.textContent = '✅ Semua script dimuat!';
            }
        }

        // Cek semua resource sudah dimuat
        if (loadedResources >= totalResources && !isResourcesLoaded) {
            isResourcesLoaded = true;
            // console.log('✅ Semua resource selesai di-download');
            
            // Tunggu sebentar lalu inisialisasi fitur
            setTimeout(() => {
                // console.log('⏱️ Memulai inisialisasi fitur...');
                initializeAllFeatures();
            }, 500);
        }
    }

    // ===== INISIALISASI FITUR DENGAN QUEUE =====
    function initializeAllFeatures() {
        if (INIT_QUEUE.isInitialized) {
            // console.log('ℹ️ Features already initialized');
            return;
        }

        // console.log('🚀 Starting feature initialization...');
        
        // Tambahkan task ke queue
        addToQueue('prtg', function() {
            if (typeof initializePrtg === 'function') {
                try {
                    initializePrtg();
                    INIT_QUEUE.completed.prtg = true;
                    // console.log('✅ PRTG initialized');
                    return true;
                } catch (e) {
                    // console.warn('⚠️ PRTG init error:', e.message);
                    return false;
                }
            }
            // console.warn('⚠️ initializePrtg not found');
            return false;
        });

        addToQueue('konverterOlt', function() {
            if (typeof initializeKonverterOlt === 'function') {
                try {
                    initializeKonverterOlt();
                    INIT_QUEUE.completed.konverterOlt = true;
                    // console.log('✅ Konverter OLT initialized');
                    return true;
                } catch (e) {
                    // console.warn('⚠️ Konverter OLT init error:', e.message);
                    return false;
                }
            }
            // console.warn('⚠️ initializeKonverterOlt not found');
            return false;
        });

        addToQueue('upDown', function() {
            if (typeof initializeUpDown === 'function') {
                try {
                    initializeUpDown();
                    INIT_QUEUE.completed.upDown = true;
                    // console.log('✅ Up/Down initialized');
                    return true;
                } catch (e) {
                    // console.warn('⚠️ Up/Down init error:', e.message);
                    return false;
                }
            }
            // console.warn('⚠️ initializeUpDown not found');
            return false;
        });

        addToQueue('snsShutNoshut', function() {
            if (typeof initializeSnsShutNoshut === 'function') {
                try {
                    initializeSnsShutNoshut();
                    INIT_QUEUE.completed.snsShutNoshut = true;
                    // console.log('✅ SNS Shut/No Shut initialized');
                    return true;
                } catch (e) {
                    // console.warn('⚠️ SNS Shut/No Shut init error:', e.message);
                    return false;
                }
            }
            // console.warn('⚠️ initializeSnsShutNoshut not found');
            return false;
        });

        addToQueue('snsPower', function() {
            if (typeof initializeSnsPower === 'function') {
                try {
                    initializeSnsPower();
                    INIT_QUEUE.completed.snsPower = true;
                    // console.log('✅ SNS Power initialized');
                    return true;
                } catch (e) {
                    // console.warn('⚠️ SNS Power init error:', e.message);
                    return false;
                }
            }
            // console.warn('⚠️ initializeSnsPower not found');
            return false;
        });

        // Proses queue
        processQueue();
    }

    // ===== QUEUE SYSTEM =====
    function addToQueue(name, task) {
        INIT_QUEUE.tasks.push({ name, task });
    }

    function processQueue() {
        if (INIT_QUEUE.isProcessing) return;
        if (INIT_QUEUE.tasks.length === 0) {
            finishInitialization();
            return;
        }

        INIT_QUEUE.isProcessing = true;
        const task = INIT_QUEUE.tasks.shift();
        
        // console.log(`⏳ Processing: ${task.name}`);
        if (loaderStatus) {
            loaderStatus.textContent = `⏳ Inisialisasi: ${task.name}...`;
        }

        try {
            const result = task.task();
            if (result === false) {
                // Jika gagal, coba lagi nanti
                // console.warn(`⚠️ ${task.name} failed, will retry later`);
                setTimeout(() => {
                    INIT_QUEUE.isProcessing = false;
                    processQueue();
                }, 500);
                return;
            }
        } catch (e) {
            // console.error(`❌ ${task.name} error:`, e);
        }

        INIT_QUEUE.isProcessing = false;
        
        // Lanjut ke task berikutnya
        setTimeout(processQueue, 100);
    }

    function finishInitialization() {
        // console.log('✅ All features initialized!');
        INIT_QUEUE.isInitialized = true;
        
        if (loaderStatus) {
            loaderStatus.textContent = '✅ Semua fitur siap!';
        }
        
        // Tunggu sebentar lalu hide loader
        setTimeout(() => {
            isDelayFinished = true;
            finishLoading();
        }, EXTRA_DELAY_AFTER_LOAD);
    }

    // ===== FINISH LOADING =====
    function finishLoading() {
        if (!isResourcesLoaded || !isDelayFinished) {
            return;
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_DURATION - elapsed);

        if (remaining > 0) {
            if (loaderDetail) {
                loaderDetail.textContent = `⏱️ Menunggu ${Math.ceil(remaining / 1000)} detik...`;
            }
            setTimeout(() => {
                hideLoaderAndShowContent();
            }, remaining);
        } else {
            hideLoaderAndShowContent();
        }
    }

    // ===== HIDE LOADER =====
    function hideLoaderAndShowContent() {
        if (isLoaderHidden) return;
        isLoaderHidden = true;

        if (loader) {
            loader.classList.add('hidden');
        }
        body.classList.add('loaded');

        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        // Trigger PRTG button
        setTimeout(() => {
            const prtgButton = document.querySelector('button[data-target="prtg"]');
            if (prtgButton && !prtgButton.classList.contains('active')) {
                // console.log("🔘 Trigger PRTG button");
                prtgButton.click();
            }
        }, 300);

        // console.log('✅ Loader hidden, content shown');
    }

    // ===== LOAD SCRIPTS =====
    function loadScripts() {
        scripts.forEach((src, index) => {
            totalResources++;
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            
            script.onload = function() {
                loadedResources++;
                scriptsLoadedCount++;
                // console.log(`✅ Script ${index + 1}/${totalScripts}:`, src.split('/').pop());
                updateProgress();
            };
            
            script.onerror = function() {
                loadedResources++;
                scriptsLoadedCount++;
                // console.error('❌ Failed to load:', src);
                updateProgress();
            };
            
            document.head.appendChild(script);
        });
    }

    // ===== TRACK CSS =====
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
        totalResources++;
        if (link.sheet || link.hasAttribute('data-loaded')) {
            loadedResources++;
            updateProgress();
        } else {
            link.addEventListener('load', function() {
                this.setAttribute('data-loaded', 'true');
                loadedResources++;
                updateProgress();
            });
            link.addEventListener('error', function() {
                this.setAttribute('data-loaded', 'true');
                loadedResources++;
                updateProgress();
            });
        }
    });

    // ===== TRACK OVERLAY IMAGE =====
    totalResources++;
    const overlayImage = document.querySelector('#fullpage-loader .overlay-image');
    if (overlayImage) {
        if (overlayImage.complete) {
            loadedResources++;
            updateProgress();
        } else {
            overlayImage.addEventListener('load', function() {
                loadedResources++;
                updateProgress();
            });
            overlayImage.addEventListener('error', function() {
                loadedResources++;
                updateProgress();
            });
        }
    }

    // ===== FALLBACK =====
    if (totalResources === 0) {
        totalResources = scripts.length + 1;
    }

    // ===== MULAI =====
    loadScripts();
    setTimeout(updateProgress, 50);

    // ===== FALLBACK TIMEOUT =====
    setTimeout(function() {
        if (!body.classList.contains('loaded')) {
            // console.warn('⏰ Force finish loading (timeout)');
            isResourcesLoaded = true;
            isDelayFinished = true;
            INIT_QUEUE.isInitialized = true;
            hideLoaderAndShowContent();
        }
    }, 20000);

    // console.log('🚀 Loader started');
    // console.log('📦 Total scripts:', totalScripts);
    // console.log('📊 Total resources:', totalResources);

    // ===== EXPOSE GLOBAL FUNCTIONS =====
    window.forceFinishLoading = function() {
        isResourcesLoaded = true;
        isDelayFinished = true;
        hideLoaderAndShowContent();
    };

    window.getLoaderStatus = function() {
        return {
            resourcesLoaded: isResourcesLoaded,
            delayFinished: isDelayFinished,
            scriptsLoaded: scriptsLoadedCount,
            totalScripts: totalScripts,
            initialized: INIT_QUEUE.isInitialized,
            completed: INIT_QUEUE.completed
        };
    };

    window.reloadPRTGData = function() {
        if (typeof loadPRTGData === 'function') {
            try {
                loadPRTGData();
                // console.log('🔄 PRTG data reloaded');
            } catch (e) {
                // console.warn('⚠️ Reload PRTG error:', e.message);
            }
        }
    };

    window.reinitializeAllFeatures = function() {
        // console.log('🔄 Re-initializing features...');
        INIT_QUEUE.isInitialized = false;
        INIT_QUEUE.tasks = [];
        Object.keys(INIT_QUEUE.completed).forEach(key => {
            INIT_QUEUE.completed[key] = false;
        });
        initializeAllFeatures();
    };

    window.initializeAllFeaturesOnce = function() {
        if (!INIT_QUEUE.isInitialized) {
            initializeAllFeatures();
        } else {
            // console.log('ℹ️ Features already initialized');
            // Tapi reload PRTG data
            window.reloadPRTGData();
        }
    };

    // console.log('📦 loader-backup.js loaded successfully');
})();