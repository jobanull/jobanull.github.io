
// ==================== PRTG JS - VERSI GABUNGAN ====================

if (typeof window._prtgInitialized === 'undefined') {
    window._prtgInitialized = false;
}

function initializePrtg() {
    if (window._prtgInitialized) {
        // console.log('ℹ️ PRTG already initialized, reloading data...');
        if (typeof loadPRTGData === 'function') {
            loadPRTGData();
        }
        return;
    }

    // console.log('🚀 Initializing PRTG...');
    window._prtgInitialized = true;

    const content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = `
        <article id="prtg">
            <div class="prtg-container">
               <div style="margin-bottom: 15px;">
                    <h2 style="display: flex; align-items: center; gap: 10px; margin: 0 0 12px 0; font-size: 1.4rem; color: #e6eef8;">
                        <i class="fas fa-chart-bar" style="color: #3b82f6;"></i> 
                        <a href="https://ikhdanjoban.vercel.app/nontech/eng/index.html"
                           style="color: inherit; text-decoration: none; cursor: default;">
                            PRTG RECTI
                        </a>
                    </h2>
                    
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <button id="prtgTestBatteryBtn" class="prtg-btn prtg-btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-bolt" style="color: #fbbf24;"></i> Test Battery
                        </button>
                        <button id="prtgPopDownBtn" class="prtg-btn prtg-btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-arrow-down" style="color: #a78bfa;"></i> Pop Down
                        </button>
                        <button id="prtgPopUnmonitorBtn" class="prtg-btn prtg-btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; background: linear-gradient(135deg, #ec4899, #db2777); color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-eye-slash" style="color: #f472b6;"></i> Pop Unmonitor
                        </button>
                        <a href="#" id="prtgWABtnInline" class="prtg-btn prtg-btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #25D366, #128C7E); color: white; border-radius: 4px;">
                            <i class="fa-brands fa-whatsapp" style="color: white;"></i> WA
                        </a>
                        <a href="#" id="prtgDownloadBtn" class="prtg-btn prtg-btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-radius: 4px;">
                            <i class="fas fa-download" style="color: white;"></i> CSV
                        </a>
                    </div>
                </div>
                
                <div class="prtg-input-section">
                    <div class="prtg-input-group">
                        <div class="prtg-textarea-wrapper">
                            <textarea id="prtgSmartInputInline" placeholder="Contoh:&#10;Antapani pln off&#10;Statt Batt :&#10;6/19/2026 5:35:59 PM   50 V" rows="3" style="height: 193px;"></textarea>
                            <span class="prtg-input-hint">
                                <i class="fas fa-info-circle"></i> 
                                Enter untuk submit, Shift+Enter untuk new line
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="prtg-stats">
                    <span>📊 TOTAL: <span id="prtgTotalCountInline">0</span></span>
                    <span>🔴 PLN OFF: <span id="prtgActiveCountInline">0</span></span>
                    <span>✅ DONE: <span id="prtgDoneCountInline">0</span></span>
                    <span><i class="fas fa-bolt" style="color: #fbbf24;"></i> BY GENSET: <span id="prtgPausedCountInline">0</span></span>
                </div>
                
                <div class="prtg-table-wrapper">
                    <table class="prtg-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Lokasi</th>
                                <th>Start Time</th>
                                <th>Start Date</th>
                                <th>Stop Time</th>
                                <th>Stop Date</th>
                                <th style="text-align: center;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="prtgTableBodyInline">
                            <tr>
                                <td colspan="8" class="prtg-empty">
                                    <i class="fas fa-database"></i>
                                    Belum ada data.<br>
                                    <span style="font-size: 0.8rem; color: #94a3b8;">
                                        Paste input di atas atau tekan Enter
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="prtgToastInline" class="prtg-toast"></div>
        </article>

        <div id="prtgTestBatteryModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 99999; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div style="background: #0b1424; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <button onclick="closeTestBatteryModal()" style="position: absolute; top: 12px; right: 16px; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; transition: all 0.2s; z-index: 10;">
                    <i class="fas fa-times"></i>
                </button>
                
                <h3 style="color: #e6eef8; margin-top: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; padding-right: 30px;">
                    <i class="fas fa-bolt" style="color: #fbbf24; font-size: 1.5rem;"></i>
                    Test Battery
                </h3>
                
                <div id="testBatteryNotification" style="display: none; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 15px; color: #86efac;">
                    <i class="fas fa-check-circle" style="color: #22c55e; margin-right: 8px;"></i>
                    <span id="testBatteryNotificationMessage">Data berhasil ditambahkan!</span>
                </div>
                
                <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05);">
                    <label style="color: #94a3b8; font-size: 0.8rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-map-marker-alt" style="color: #fbbf24;"></i> Masukkan Nama Lokasi Test Battery:
                    </label>
                    <div style="display: flex; gap: 10px; flex-direction: column;">
                        <textarea id="testBatteryInput" rows="3" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #e6eef8; font-size: 0.9rem; font-family: inherit; resize: vertical; min-height: 60px; max-height: 120px; box-sizing: border-box;"></textarea>
                        <span style="font-size: 0.7rem; color: #94a3b8;">
                            <i class="fas fa-info-circle"></i> 
                            Masukkan persatu lokasi.
                            <span style="display: block; margin-top: 4px; color: #f59e0b;">
                                <i class="fas fa-arrow-right"></i> Enter untuk submit, Shift+Enter untuk new line
                            </span>
                        </span>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="color: #94a3b8; font-size: 0.75rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-table"></i> Data Test Battery saat ini:</span>
                        <span style="color: #f59e0b; font-size: 0.7rem;">Total: <span id="testBatteryCount">0</span> entries</span>
                    </div>
                   <div id="testBatteryDataDisplay" style="width: 100%; min-height: 200px; max-height: 300px; overflow-y: auto; box-sizing: border-box;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                            <thead>
                                <tr style="border-bottom: 2px solid rgba(255,255,255,0.1);">
                                    <th style="text-align: left; padding: 8px 6px; color: #94a3b8; font-weight: 600; width: 30px;">#</th>
                                    <th style="text-align: left; padding: 8px 6px; color: #94a3b8; font-weight: 600;">Lokasi</th>
                                    <th style="text-align: center; padding: 8px 6px; color: #94a3b8; font-weight: 600; width: 130px;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="testBatteryTableBody">
                                <tr>
                                    <td colspan="4" style="text-align: center; padding: 30px 20px; color: #94a3b8;">
                                        <i class="fas fa-database" style="font-size: 1.5rem; display: block; margin-bottom: 10px;"></i>
                                        Tidak ada data TEST_BATTERY
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL POP DOWN -->
        <div id="prtgPopDownModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 99999; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div style="background: #0b1424; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <button onclick="closePopDownModal()" style="position: absolute; top: 12px; right: 16px; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; transition: all 0.2s; z-index: 10;">
                    <i class="fas fa-times"></i>
                </button>
                
                <h3 style="color: #e6eef8; margin-top: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; padding-right: 30px;">
                    <i class="fas fa-arrow-down" style="color: #a78bfa; font-size: 1.5rem;"></i>
                    Pop Down
                </h3>
                
                <div id="popDownNotification" style="display: none; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 15px; color: #86efac;">
                    <i class="fas fa-check-circle" style="color: #22c55e; margin-right: 8px;"></i>
                    <span id="popDownNotificationMessage">Data berhasil ditambahkan!</span>
                </div>
                
                <div id="popDownError" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 15px; color: #fca5a5;">
                    <i class="fas fa-exclamation-circle" style="color: #ef4444; margin-right: 8px;"></i>
                    <span id="popDownErrorMessage">Lokasi masih ACTIVE. Selesaikan dulu dengan Done!</span>
                </div>
                
                <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05);">
                    <label style="color: #94a3b8; font-size: 0.8rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-map-marker-alt" style="color: #a78bfa;"></i> Masukkan Nama Lokasi Pop Down:
                    </label>
                    <div style="display: flex; gap: 10px; flex-direction: column;">
                        <textarea id="popDownInput" rows="5" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #e6eef8; font-size: 0.9rem; font-family: inherit; resize: vertical; min-height: 80px; max-height: 200px; box-sizing: border-box;"></textarea>
                        <span style="font-size: 0.7rem; color: #94a3b8;">
                            <i class="fas fa-info-circle"></i> 
                            Masukkan persatu lokasi.
                            <span style="display: block; margin-top: 4px; color: #8b5cf6;">
                                <i class="fas fa-arrow-right"></i> Enter untuk submit, Shift+Enter untuk new line
                            </span>
                        </span>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="color: #94a3b8; font-size: 0.75rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-table"></i> Data Pop Down saat ini:</span>
                        <span style="color: #8b5cf6; font-size: 0.7rem;">Total: <span id="popDownCount">0</span> entries</span>
                    </div>
                    <div id="popDownDataDisplay" style="width: 100%; min-height: 200px; max-height: 300px; overflow-y: auto; box-sizing: border-box;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                            <thead>
                                <tr style="border-bottom: 2px solid rgba(255,255,255,0.1);">
                                    <th style="text-align: left; padding: 8px 6px; color: #94a3b8; font-weight: 600; width: 30px;">#</th>                               <th style="text-align: left; padding: 8px 6px; color: #94a3b8; font-weight: 600;">Lokasi</th>
                                    <th style="text-align: center; padding: 8px 6px; color: #94a3b8; font-weight: 600; width: 100px;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="popDownTableBody">
                                <tr>
                                    <td colspan="4" style="text-align: center; padding: 30px 20px; color: #94a3b8;">
                                        <i class="fas fa-database" style="font-size: 1.5rem; display: block; margin-bottom: 10px;"></i>
                                        Tidak ada data POP_DOWN hari ini
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL POP UNMONITOR -->
        <div id="prtgPopUnmonitorModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 99999; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div style="background: #0b1424; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <button onclick="closePopUnmonitorModal()" style="position: absolute; top: 12px; right: 16px; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; transition: all 0.2s; z-index: 10;">
                    <i class="fas fa-times"></i>
                </button>
                
                <h3 style="color: #e6eef8; margin-top: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; padding-right: 30px;">
                    <i class="fas fa-eye-slash" style="color: #f472b6; font-size: 1.5rem;"></i>
                    Pop Unmonitor
                </h3>
                
                <div id="popUnmonitorNotification" style="display: none; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 15px; color: #86efac;">
                    <i class="fas fa-check-circle" style="color: #22c55e; margin-right: 8px;"></i>
                    <span id="popUnmonitorNotificationMessage">Data berhasil ditambahkan!</span>
                </div>
                
                <div id="popUnmonitorError" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 15px; color: #fca5a5;">
                    <i class="fas fa-exclamation-circle" style="color: #ef4444; margin-right: 8px;"></i>
                    <span id="popUnmonitorErrorMessage">Lokasi masih ACTIVE. Selesaikan dulu dengan Done!</span>
                </div>
                
                <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05);">
                    <label style="color: #94a3b8; font-size: 0.8rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-map-marker-alt" style="color: #f472b6;"></i> Masukkan Nama Lokasi Pop Unmonitor:
                    </label>
                    <div style="display: flex; gap: 10px; flex-direction: column;">
                        <textarea id="popUnmonitorInput" rows="5" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #e6eef8; font-size: 0.9rem; font-family: inherit; resize: vertical; min-height: 80px; max-height: 200px; box-sizing: border-box;"></textarea>
                        <span style="font-size: 0.7rem; color: #94a3b8;">
                            <i class="fas fa-info-circle"></i> 
                            Masukkan persatu lokasi.
                            <span style="display: block; margin-top: 4px; color: #ec4899;">
                                <i class="fas fa-arrow-right"></i> Enter untuk submit, Shift+Enter untuk new line
                            </span>
                        </span>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="color: #94a3b8; font-size: 0.75rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-table"></i> Data Pop Unmonitor saat ini:</span>
                        <span style="color: #ec4899; font-size: 0.7rem;">Total: <span id="popUnmonitorCount">0</span> entries</span>
                    </div>
                    <div id="popUnmonitorDataDisplay" style="width: 100%; min-height: 200px; max-height: 300px; overflow-y: auto; box-sizing: border-box;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                            <thead>
                                <tr style="border-bottom: 2px solid rgba(255,255,255,0.1);">
                                    <th style="text-align: left; padding: 8px 6px; color: #94a3b8; font-weight: 600; width: 30px;">#</th>                               <th style="text-align: left; padding: 8px 6px; color: #94a3b8; font-weight: 600;">Lokasi</th>
                                    <th style="text-align: center; padding: 8px 6px; color: #94a3b8; font-weight: 600; width: 100px;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="popUnmonitorTableBody">
                                <tr>
                                    <td colspan="4" style="text-align: center; padding: 30px 20px; color: #94a3b8;">
                                        <i class="fas fa-database" style="font-size: 1.5rem; display: block; margin-bottom: 10px;"></i>
                                        Tidak ada data POP_UNMONITOR hari ini
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL WA REPORT -->
        <div id="prtgWAModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 99999; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div style="background: #0b1424; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <button onclick="closeWAModal()" style="position: absolute; top: 12px; right: 16px; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; transition: all 0.2s; z-index: 10;">
                    <i class="fas fa-times"></i>
                </button>
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-right: 40px;">
                    <h3 style="color: #e6eef8; margin: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fab fa-whatsapp" style="color: #25D366; font-size: 1.5rem;"></i>
                        Report WhatsApp
                    </h3>
                    <button onclick="copyWAReport(this)" style="flex-shrink: 0; background: #25D366; border: none; color: #fff; padding: 8px 24px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); margin-right: 4px;">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                
                <div id="prtgWAReportContent" style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 20px; margin-bottom: 20px; color: #e6eef8; font-family: 'Courier New', monospace; font-size: 0.85rem; white-space: pre-wrap; max-height: 400px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.05); user-select: text; cursor: text;">
                    Loading...
                </div>
            </div>
        </div>
    `;

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes slideUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .prtg-container {
            padding: 10px 0;
            width: 100%;
        }
        .prtg-container .prtg-input-section {
            margin-bottom: 15px;
        }
        .prtg-container .prtg-input-group {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: flex-start;
        }
        .prtg-container .prtg-input-group .prtg-textarea-wrapper {
            flex: 1;
            min-width: 250px;
        }
        .prtg-container .prtg-input-group textarea {
            width: 100%;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(0,0,0,0.2);
            color: #e6eef8;
            font-size: 0.9rem;
            font-family: inherit;
            resize: vertical;
            min-height: 60px;
            max-height: 120px;
            box-sizing: border-box;
        }
        .prtg-container .prtg-input-group textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
        }
        .prtg-container .prtg-input-group textarea::placeholder {
            color: #94a3b8;
        }
        .prtg-container .prtg-input-hint {
            font-size: 0.7rem;
            color: #94a3b8;
            margin-top: 4px;
            display: block;
        }
        .prtg-container .prtg-btn {
            padding: 8px 18px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
        }
        .prtg-container .prtg-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .prtg-container .prtg-btn-primary {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
        }
        .prtg-container .prtg-btn-success {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
        }
        .prtg-container .prtg-btn-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }
        .prtg-container .prtg-btn-warning {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
        }
        .prtg-container .prtg-btn-secondary {
            background: rgba(255,255,255,0.08);
            color: #e6eef8;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .prtg-container .prtg-btn-pause {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
        }
        .prtg-container .prtg-btn-unpause {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
        }
        .prtg-container .prtg-table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.05);
            margin-top: 12px;
            max-height: 50vh;
            overflow-y: auto;
        }
        .prtg-container .prtg-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.82rem;
        }
        .prtg-container .prtg-table th {
            background: rgba(0,0,0,0.3);
            color: #3b82f6;
            font-weight: 600;
            padding: 10px 12px;
            text-align: left;
            border-bottom: 2px solid rgba(255,255,255,0.05);
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .prtg-container .prtg-table td {
            padding: 8px 12px;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            color: #e6eef8;
        }
        .prtg-container .prtg-table tr:hover td {
            background: rgba(59,130,246,0.05);
        }
        .prtg-container .prtg-status-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
        }
        .prtg-container .prtg-status-badge.active {
            background: rgba(148,163,184,0.2);
            color: #94a3b8;
        }
        .prtg-container .prtg-status-badge.done {
            background: rgba(148,163,184,0.2);
            color: #94a3b8;
        }
        .prtg-container .prtg-status-badge.paused {
            background: rgba(245,158,11,0.2);
            color: #f59e0b;
        }
        .prtg-container .prtg-empty {
            text-align: center;
            padding: 30px 20px;
            color: #94a3b8;
        }
        .prtg-container .prtg-empty i {
            font-size: 1.8rem;
            margin-bottom: 10px;
            display: block;
        }
        .prtg-container .prtg-stats {
            display: flex;
            gap: 20px;
            padding: 8px 0;
            flex-wrap: wrap;
            color: #94a3b8;
            font-size: 0.78rem;
        }
        .prtg-container .prtg-stats span {
            font-weight: 600;
            color: #e6eef8;
        }
        .prtg-container .prtg-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #0b1424;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 12px 20px;
            color: #e6eef8;
            font-size: 0.85rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.4s ease;
            z-index: 99999;
        }
        .prtg-container .prtg-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        .prtg-container .prtg-toast.success {
            border-left: 4px solid #22c55e;
        }
        .prtg-container .prtg-toast.error {
            border-left: 4px solid #ef4444;
        }
        .prtg-container .prtg-toast.info {
            border-left: 4px solid #3b82f6;
        }
        .prtg-container .prtg-toast.pause {
            border-left: 4px solid #f59e0b;
        }
        .prtg-container .prtg-table-wrapper::-webkit-scrollbar,
        #prtgWAReportContent::-webkit-scrollbar,
        #prtgWAModal > div::-webkit-scrollbar,
        #prtgTestBatteryModal > div::-webkit-scrollbar,
        #prtgPopDownModal > div::-webkit-scrollbar,
        #prtgPopUnmonitorModal > div::-webkit-scrollbar,
        #testBatteryDataDisplay::-webkit-scrollbar,
        #popDownDataDisplay::-webkit-scrollbar,
        #popUnmonitorDataDisplay::-webkit-scrollbar,
        #testBatteryInput::-webkit-scrollbar,
        #popDownInput::-webkit-scrollbar,
        #popUnmonitorInput::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .prtg-container .prtg-table-wrapper::-webkit-scrollbar-track,
        #prtgWAReportContent::-webkit-scrollbar-track,
        #prtgWAModal > div::-webkit-scrollbar-track,
        #prtgTestBatteryModal > div::-webkit-scrollbar-track,
        #prtgPopDownModal > div::-webkit-scrollbar-track,
        #prtgPopUnmonitorModal > div::-webkit-scrollbar-track,
        #testBatteryDataDisplay::-webkit-scrollbar-track,
        #popDownDataDisplay::-webkit-scrollbar-track,
        #popUnmonitorDataDisplay::-webkit-scrollbar-track,
        #testBatteryInput::-webkit-scrollbar-track,
        #popDownInput::-webkit-scrollbar-track,
        #popUnmonitorInput::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
        }
        #testBatteryDataDisplay table td {
            vertical-align: middle;
        }

        #testBatteryDataDisplay table td button {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }    
        .prtg-container .prtg-table-wrapper::-webkit-scrollbar-thumb,
        #prtgWAReportContent::-webkit-scrollbar-thumb,
        #prtgWAModal > div::-webkit-scrollbar-thumb,
        #prtgTestBatteryModal > div::-webkit-scrollbar-thumb,
        #prtgPopDownModal > div::-webkit-scrollbar-thumb,
        #prtgPopUnmonitorModal > div::-webkit-scrollbar-thumb,
        #testBatteryDataDisplay::-webkit-scrollbar-thumb,
        #popDownDataDisplay::-webkit-scrollbar-thumb,
        #popUnmonitorDataDisplay::-webkit-scrollbar-thumb,
        #testBatteryInput::-webkit-scrollbar-thumb,
        #popDownInput::-webkit-scrollbar-thumb,
        #popUnmonitorInput::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 10px;
        }
        @media (max-width: 768px) {
            .prtg-container .prtg-input-group {
                flex-direction: column;
                align-items: stretch;
            }
            .prtg-container .prtg-input-group .prtg-textarea-wrapper {
                min-width: unset;
            }
            .prtg-container .prtg-input-group textarea {
                min-height: 80px;
            }
            .prtg-container .prtg-table {
                font-size: 0.7rem;
            }
            .prtg-container .prtg-table th,
            .prtg-container .prtg-table td {
                padding: 6px 8px;
            }
        }
    `;
    document.head.appendChild(styleEl);

    initPRTGInline();
}

// ==================== MAIN FUNCTION ====================

function initPRTGInline() {
    var smartInput = document.getElementById('prtgSmartInputInline');
    if (!smartInput) {
        // console.warn('PRTG inline elements not found');
        return;
    }
    
    // console.log('✅ PRTG Inline initialized with PHP Backend');
    
    // ===== API URL tanpa query string =====
    var API_URL = 'api.php';
    var prtgData = [];
    var toastTimeout = null;
    
    var testBatteryBtn = document.getElementById('prtgTestBatteryBtn');
    var popDownBtn = document.getElementById('prtgPopDownBtn');
    var popUnmonitorBtn = document.getElementById('prtgPopUnmonitorBtn');
    var waBtn = document.getElementById('prtgWABtnInline');
    var downloadBtn = document.getElementById('prtgDownloadBtn');
    var tableBody = document.getElementById('prtgTableBodyInline');
    var totalCount = document.getElementById('prtgTotalCountInline');
    var activeCount = document.getElementById('prtgActiveCountInline');
    var doneCount = document.getElementById('prtgDoneCountInline');
    var pausedCount = document.getElementById('prtgPausedCountInline');
    var toast = document.getElementById('prtgToastInline');
    
    function showToast(message, type) {
        if (!toast) return;
        toast.textContent = message;
        toast.className = 'prtg-toast ' + (type || 'info');
        setTimeout(function() { toast.classList.add('show'); }, 10);
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function() { toast.classList.remove('show'); }, 4000);
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            if (m === '"') return '&quot;';
            return m;
        });
    }

    // ================== FUNGSI DOWNLOAD CSV ==================
    
    function formatDateToYYYYMMDD(dateStr) {
        if (!dateStr || dateStr === 'N/A') return '';
        
        try {
            var parts = dateStr.split('/');
            if (parts.length === 3) {
                var month = parts[0].padStart(2, '0');
                var day = parts[1].padStart(2, '0');
                var year = parts[2];
                if (year.length === 2) {
                    year = '20' + year;
                }
                return year + '-' + month + '-' + day;
            }
            return dateStr;
        } catch (e) {
            return dateStr;
        }
    }

    function convertTo24Hour(timeStr, ampm) {
        if (!timeStr) return '';
        
        try {
            var timeParts = timeStr.split(':');
            if (timeParts.length >= 2) {
                var hours = parseInt(timeParts[0]);
                var minutes = timeParts[1].padStart(2, '0');
                var seconds = timeParts.length > 2 ? timeParts[2].padStart(2, '0') : '00';
                
                if (ampm) {
                    var ampmUpper = ampm.toUpperCase();
                    if (ampmUpper === 'PM' && hours < 12) {
                        hours += 12;
                    } else if (ampmUpper === 'AM' && hours === 12) {
                        hours = 0;
                    }
                }
                
                return String(hours).padStart(2, '0') + ':' + minutes + ':' + seconds;
            }
            return timeStr;
        } catch (e) {
            return timeStr;
        }
    }

    // ================== FUNGSI DOWNLOAD CSV ==================
    function downloadCSV() {
        // Filter data hanya untuk PARENT
        var parentData = prtgData.filter(function(item) {
            return item.opt && item.opt.toUpperCase() === 'PARENT';
        });
        
        if (!parentData || parentData.length === 0) {
            showToast('⚠️ Tidak ada data PARENT untuk di-download!', 'error');
            return;
        }

        showToast('📥 Generating CSV...', 'info');

        try {
            var headers = ['id', 'type', 'location', 'start_datetime', 'stop_datetime', 'status', 'vdc'];
            var csvRows = [];
            csvRows.push(headers.join(','));

            parentData.forEach(function(item) {
                var type = item.opt || 'PARENT';
                
                var startDateTime = '';
                if (item.startDate && item.startTime) {
                    var startDate = formatDateToYYYYMMDD(item.startDate);
                    var startTime = item.startTime;
                    var startAmPm = item.startAmPm || '';
                    var startTime24 = convertTo24Hour(startTime, startAmPm);
                    startDateTime = startDate + ' ' + startTime24;
                }
                
                var stopDateTime = '';
                if (item.stopDate && item.stopTime) {
                    var stopDate = formatDateToYYYYMMDD(item.stopDate);
                    var stopTime = item.stopTime;
                    var stopAmPm = item.stopAmPm || '';
                    var stopTime24 = convertTo24Hour(stopTime, stopAmPm);
                    stopDateTime = stopDate + ' ' + stopTime24;
                }
                
                var row = [
                    item.id || '',
                    type,
                    item.location || '',
                    startDateTime,
                    stopDateTime,
                    item.status || 'active',
                    item.vdc || '50 V'
                ];
                
                var escapedRow = row.map(function(value) {
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        return '"' + value.replace(/"/g, '""') + '"';
                    }
                    return value;
                });
                
                csvRows.push(escapedRow.join(','));
            });

            var csvContent = csvRows.join('\n');
            var blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            
            var link = document.createElement('a');
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            
            var now = new Date();
            var timestamp = now.getFullYear() + 
                        String(now.getMonth() + 1).padStart(2, '0') + 
                        String(now.getDate()).padStart(2, '0') + '_' +
                        String(now.getHours()).padStart(2, '0') + 
                        String(now.getMinutes()).padStart(2, '0');
            var fileName = 'prtg_data_' + timestamp + '.csv';
            link.setAttribute('download', fileName);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast('✅ CSV downloaded successfully! (' + parentData.length + ' rows)', 'success');
            
        } catch (error) {
            // console.error('Error generating CSV:', error);
            showToast('❌ Gagal generate CSV: ' + error.message, 'error');
        }
    }

    // ================== SMART PARSE INPUT ==================
    function smartParseInput(text) {
        if (!text || text.trim() === '') return null;
        
        text = text.trim();
        var lines = text.split('\n').filter(function(line) { 
            var trimmed = line.trim();
            // Skip baris yang hanya berisi "Statt Batt :" atau kosong
            if (trimmed === '' || /^Statt\s*Batt\s*:\s*$/i.test(trimmed)) {
                return false;
            }
            return true;
        });
        
        var dateTimeRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}:\d{2})\s*(AM|PM)/i;
        var timeWithAmPmRegex = /(\d{1,2}:\d{2}:\d{2})\s*(AM|PM)/i;
        var dateRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})/;
        var timeRegex = /(\d{1,2}:\d{2}:\d{2})/;
        var vdcRegex = /([\d.]+)\s*V/i;
        
        var results = [];
        
        // Gabungkan baris yang memiliki hubungan (lokasi + timestamp)
        var mergedLines = [];
        var i = 0;
        while (i < lines.length) {
            var currentLine = lines[i].trim();
            
            // Skip jika baris kosong atau hanya "Statt Batt :"
            if (!currentLine || /^Statt\s*Batt\s*:\s*$/i.test(currentLine)) {
                i++;
                continue;
            }
            
            var hasFullDateTime = dateTimeRegex.test(currentLine);
            var hasTimeWithAmPm = timeWithAmPmRegex.test(currentLine);
            var hasDate = dateRegex.test(currentLine);
            var hasTime = timeRegex.test(currentLine);
            var hasTimestamp = hasFullDateTime || hasTimeWithAmPm || (hasDate && hasTime);
            
            // Jika baris saat ini memiliki timestamp, cek apakah baris sebelumnya memiliki lokasi
            if (hasTimestamp && i > 0) {
                var prevLine = lines[i - 1].trim();
                var prevHasTimestamp = dateTimeRegex.test(prevLine) || 
                                    timeWithAmPmRegex.test(prevLine) || 
                                    (dateRegex.test(prevLine) && timeRegex.test(prevLine));
                
                // Jika baris sebelumnya tidak memiliki timestamp dan bukan "Statt Batt :"
                if (!prevHasTimestamp && prevLine && !/^Statt\s*Batt\s*:\s*$/i.test(prevLine)) {
                    // Gabungkan baris sebelumnya dengan baris saat ini
                    var combined = prevLine + ' ' + currentLine;
                    // Hapus baris sebelumnya dari mergedLines jika sudah ada
                    if (mergedLines.length > 0 && mergedLines[mergedLines.length - 1] === prevLine) {
                        mergedLines.pop();
                    }
                    mergedLines.push(combined);
                    i++;
                    continue;
                }
            }
            
            // Cek apakah baris ini memiliki "Statt Batt :" dan baris berikutnya memiliki timestamp
            if (/Statt\s*Batt\s*:/i.test(currentLine) && i + 1 < lines.length) {
                var nextLine = lines[i + 1].trim();
                var nextHasTimestamp = dateTimeRegex.test(nextLine) || 
                                    timeWithAmPmRegex.test(nextLine) || 
                                    (dateRegex.test(nextLine) && timeRegex.test(nextLine));
                
                if (nextHasTimestamp) {
                    // Gabungkan "Statt Batt :" dengan timestamp-nya
                    var combined = currentLine + ' ' + nextLine;
                    mergedLines.push(combined);
                    i += 2;
                    continue;
                }
            }
            
            // Jika baris ini memiliki "pln off" dan baris berikutnya memiliki timestamp
            if (/pln\s*off/i.test(currentLine) && i + 1 < lines.length) {
                var nextLine2 = lines[i + 1].trim();
                var nextHasTimestamp2 = dateTimeRegex.test(nextLine2) || 
                                    timeWithAmPmRegex.test(nextLine2) || 
                                    (dateRegex.test(nextLine2) && timeRegex.test(nextLine2));
                
                if (nextHasTimestamp2) {
                    var combined2 = currentLine + ' ' + nextLine2;
                    mergedLines.push(combined2);
                    i += 2;
                    continue;
                }
            }
            
            mergedLines.push(currentLine);
            i++;
        }
        
        // Proses setiap merged line
        for (var idx = 0; idx < mergedLines.length; idx++) {
            var line = mergedLines[idx].trim();
            if (!line) continue;
            
            var extractedDate = '';
            var extractedTime = '';
            var extractedAmPm = '';
            var extractedVdc = '50 V';
            var location = '';
            
            // Cari VDC terlebih dahulu
            var vdcMatch = line.match(vdcRegex);
            if (vdcMatch) {
                extractedVdc = vdcMatch[1] + ' V';
                line = line.replace(vdcMatch[0], '').trim();
            }
            
            // Cek apakah ada "Statt Batt :" atau "Status Batt :" di line
            var hasStattBatt = /Statt\s*Batt\s*:/i.test(line) || /Status\s*Batt\s*:/i.test(line);
            if (hasStattBatt) {
                line = line.replace(/Statt\s*Batt\s*:/i, '').replace(/Status\s*Batt\s*:/i, '').trim();
            }
            
            // Hapus "pln off" atau "off pln"
            var hasPlnOff = /pln\s*off/i.test(line) || /off\s*pln/i.test(line);
            if (hasPlnOff) {
                line = line.replace(/pln\s*off/i, '').replace(/off\s*pln/i, '').trim();
            }
            
            var match = line.match(dateTimeRegex);
            if (match) {
                extractedDate = match[1];
                extractedTime = match[2];
                extractedAmPm = match[3].toUpperCase();
                line = line.replace(match[0], '').trim();
            } else {
                match = line.match(timeWithAmPmRegex);
                if (match) {
                    extractedTime = match[1];
                    extractedAmPm = match[2].toUpperCase();
                    line = line.replace(match[0], '').trim();
                }
                
                match = line.match(dateRegex);
                if (match) {
                    extractedDate = match[1];
                    line = line.replace(match[0], '').trim();
                }
                
                if (!extractedTime) {
                    match = line.match(timeRegex);
                    if (match) {
                        extractedTime = match[1];
                        line = line.replace(match[0], '').trim();
                    }
                }
            }
            
            // Jika masih ada teks yang tersisa, gunakan sebagai lokasi
            if (line.trim()) {
                location = line.trim();
            } else if (hasPlnOff || hasStattBatt) {
                // Jika line kosong setelah menghapus timestamp, coba ambil dari teks asli
                var originalLine = mergedLines[idx];
                var cleanLocation = originalLine
                    .replace(/Statt\s*Batt\s*:/i, '')
                    .replace(/Status\s*Batt\s*:/i, '')
                    .replace(/pln\s*off/i, '')
                    .replace(/off\s*pln/i, '')
                    .replace(/off/i, '')
                    .replace(dateTimeRegex, '')
                    .trim();
                
                if (cleanLocation) {
                    location = cleanLocation;
                }
            }
            
            // Jika location masih kosong, coba ambil dari teks asli
            if (!location) {
                var originalLine2 = mergedLines[idx];
                var fallbackLocation = originalLine2
                    .replace(/Statt\s*Batt\s*:/i, '')
                    .replace(/Status\s*Batt\s*:/i, '')
                    .replace(/pln\s*off/i, '')
                    .replace(/off\s*pln/i, '')
                    .replace(/off/i, '')
                    .replace(dateTimeRegex, '')
                    .trim();
                
                if (fallbackLocation) {
                    location = fallbackLocation;
                }
            }
            
            if (!location) continue;
            
            // Format date
            if (extractedDate) {
                var parts = extractedDate.split('/');
                if (parts.length === 3) {
                    var month = parseInt(parts[0]);
                    var day = parseInt(parts[1]);
                    var year = parts[2];
                    if (month > 12) {
                        extractedDate = String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0') + '/' + year;
                    } else {
                        extractedDate = String(month).padStart(2, '0') + '/' + String(day).padStart(2, '0') + '/' + year;
                    }
                }
            }
            
            if (!extractedDate || !extractedTime) {
                var now = new Date();
                extractedDate = extractedDate || now.toLocaleDateString('en-US', { 
                    month: '2-digit', 
                    day: '2-digit', 
                    year: 'numeric' 
                });
                if (!extractedTime) {
                    extractedTime = now.toLocaleTimeString('en-US', { 
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                }
                if (!extractedAmPm) {
                    extractedAmPm = now.getHours() >= 12 ? 'PM' : 'AM';
                }
            }
            
            results.push({
                location: location,
                date: extractedDate,
                time: extractedTime,
                ampm: extractedAmPm,
                vdc: extractedVdc
            });
        }
        
        return results;
    }

    function parseDateTime(dateStr, timeStr) {
        if (!dateStr || dateStr === 'N/A' || !timeStr || timeStr === 'N/A') {
            return null;
        }
        
        try {
            var dateParts = dateStr.split('/');
            if (dateParts.length === 3) {
                var month = parseInt(dateParts[0]) - 1;
                var day = parseInt(dateParts[1]);
                var year = parseInt(dateParts[2]);
                
                var timeClean = timeStr.trim();
                var isPM = timeClean.toLowerCase().includes('pm');
                var isAM = timeClean.toLowerCase().includes('am');
                
                var timeOnly = timeClean.replace(/\s*[ap]m\s*/i, '').trim();
                var timeParts = timeOnly.split(':');
                
                if (timeParts.length >= 2) {
                    var hours = parseInt(timeParts[0]);
                    var minutes = parseInt(timeParts[1]);
                    var seconds = timeParts.length > 2 ? parseInt(timeParts[2]) : 0;
                    
                    if (isPM && hours < 12) hours += 12;
                    if (isAM && hours === 12) hours = 0;
                    
                    return new Date(year, month, day, hours, minutes, seconds);
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }
    
    function isSameDate(dateStr1, dateStr2) {
        if (!dateStr1 || !dateStr2 || dateStr1 === 'N/A' || dateStr2 === 'N/A') {
            return false;
        }
        
        try {
            var parts1 = dateStr1.split('/');
            var parts2 = dateStr2.split('/');
            
            if (parts1.length === 3 && parts2.length === 3) {
                return parts1[0] === parts2[0] && 
                    parts1[1] === parts2[1] && 
                    parts1[2] === parts2[2];
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // ===== FUNGSI HELPER UNTUK HITUNG SELISIH HARI =====
    function getDaysDifference(startDateStr) {
        if (!startDateStr || startDateStr === 'N/A') return 0;
        
        try {
            var parts = startDateStr.split('/');
            if (parts.length === 3) {
                var month = parseInt(parts[0]) - 1;
                var day = parseInt(parts[1]);
                var year = parseInt(parts[2]);
                
                if (year < 100) {
                    year += 2000;
                }
                
                var startDate = new Date(year, month, day);
                var today = new Date();
                
                var startOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                var todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                
                var diffTime = todayOnly.getTime() - startOnly.getTime();
                var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return diffDays;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    // ===== FUNGSI HELPER UNTUK PARSE DATE =====
    function parseDateFromString(dateStr) {
        if (!dateStr || dateStr === 'N/A') return null;
        
        try {
            var parts = dateStr.split('/');
            if (parts.length === 3) {
                var month = parseInt(parts[0]) - 1;
                var day = parseInt(parts[1]);
                var year = parseInt(parts[2]);
                
                if (year < 100) {
                    year += 2000;
                }
                
                return new Date(year, month, day);
            }
            return null;
        } catch (e) {
            return null;
        }
    }
    
    // ================== LOAD DATA ==================
    function loadPRTGData() {
        // console.log('🔄 Loading PRTG data...');
        fetch(API_URL + '?path=prtg', { cache: 'no-store' })
            .then(function(res) { 
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json(); 
            })
            .then(function(result) {
                // console.log('📊 Data loaded:', result.total || 0, 'items');
                if (result.success) {
                    prtgData = result.data || [];
                    renderTable();
                    updateTestBatteryDisplay();
                    updatePopDownDisplay();
                    updatePopUnmonitorDisplay();
                    // console.log('✅ Table rendered with', prtgData.length, 'items');
                } else {
                    showToast('⚠️ Gagal memuat data', 'error');
                }
            })
            .catch(function(err) {
                // console.error('❌ Error loading PRTG data:', err);
                showToast('⚠️ Gagal terhubung ke server. Pastikan API berjalan', 'error');
                prtgData = [];
                renderTable();
                updateTestBatteryDisplay();
                updatePopDownDisplay();
                updatePopUnmonitorDisplay();
            });
    }
    
    // ================== RENDER TABLE ==================
    function renderTable() {
        if (!tableBody) return;

        var mainData = prtgData.filter(function(item) {
            return item.opt && item.opt.toUpperCase() === 'PARENT';
        });

        if (mainData.length === 0) {
            tableBody.innerHTML = 
                '<tr>' +
                    '<td colspan="7" class="prtg-empty">' +
                        '<i class="fas fa-database"></i>' +
                        'Belum ada data PARENT.<br>' +
                        '<span style="font-size: 0.8rem; color: #94a3b8;">' +
                            'Paste input di atas atau tekan Enter' +
                        '</span>' +
                    '</td>' +
                '</tr>';
            if (totalCount) totalCount.textContent = '0';
            if (activeCount) activeCount.textContent = '0';
            if (doneCount) doneCount.textContent = '0';
            if (pausedCount) pausedCount.textContent = '0';
            return;
        }

        var sortedData = mainData.slice().sort(function(a, b) {
            var aStart = a.startDate || '';
            var aTime = a.startTime || '';
            var bStart = b.startDate || '';
            var bTime = b.startTime || '';
            
            var aDate = parseDateTime(aStart, aTime + (a.startAmPm ? ' ' + a.startAmPm : ''));
            var bDate = parseDateTime(bStart, bTime + (b.startAmPm ? ' ' + b.startAmPm : ''));
            
            if (aDate && bDate) {
                return bDate - aDate;
            }
            if (aDate && !bDate) return -1;
            if (!aDate && bDate) return 1;
            return 0;
        });

        var html = '';
        var active = 0;
        var done = 0;
        var paused = 0;
        
        for (var idx = 0; idx < sortedData.length; idx++) {
            var item = sortedData[idx];
            var isDone = item.status === 'done';
            var isPaused = item.status === 'paused';
            
            if (isDone) { done++; } 
            else if (isPaused) { paused++; } 
            else { active++; }
            
            var startTime = item.startTime || '';
            var startAmPm = item.startAmPm || '';
            var startDisplay = startTime;
            if (startAmPm) { startDisplay += ' ' + startAmPm; }
            if (!startDisplay) { startDisplay = 'N/A'; }
            
            var stopTime = item.stopTime || '';
            var stopAmPm = item.stopAmPm || '';
            var stopDisplay = stopTime;
            if (stopAmPm) { stopDisplay += ' ' + stopAmPm; }
            if (!stopDisplay) { stopDisplay = 'N/A'; }
            
            var startDate = item.startDate || 'N/A';
            var stopDate = item.stopDate || 'N/A';
            
            var originalIndex = prtgData.indexOf(item);
            
            var actionHtml = '';
            
            if (isDone) {
                actionHtml = 
                    '<span style="color: #22c55e; font-size: 1rem;"><i class="fas fa-check-circle"></i></span>' +
                    '<button class="prtg-btn prtg-btn-warning" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 4px;" onclick="window.reopenPRTGInline(' + originalIndex + ')" title="Reopen">' +
                        '<i class="fas fa-undo"></i>' +
                    '</button>' +
                    '<button class="prtg-btn prtg-btn-danger" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 4px;" onclick="window.deletePRTGInline(' + originalIndex + ')" title="Delete">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>';
            } else if (isPaused) {
                actionHtml = 
                    '<button class="prtg-btn prtg-btn-unpause" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 4px;" onclick="window.unpausePRTGInline(' + originalIndex + ')" title="Stop By Genset">' +
                        '<i class="fas fa-play"></i>' +
                    '</button>' +
                    '<button class="prtg-btn prtg-btn-danger" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 4px;" onclick="window.deletePRTGInline(' + originalIndex + ')" title="Delete">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>';
            } else {
                actionHtml = 
                    '<button class="prtg-btn prtg-btn-success" style="padding: 4px 8px; font-size: 0.7rem;" onclick="window.markPRTGAsDoneInline(' + originalIndex + ')" title="Mark as Done">' +
                        '<i class="fas fa-check-circle"></i>' +
                    '</button>' +
                    '<button class="prtg-btn prtg-btn-warning" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 4px;" onclick="window.editPRTGInline(' + originalIndex + ')" title="Tambah VDC">' +
                        '<i class="fas fa-pencil-alt"></i>' +
                    '</button>' +
                    '<button class="prtg-btn prtg-btn-pause" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 4px;" onclick="window.pausePRTGInline(' + originalIndex + ')" title="By Genset">' +
                        '<i class="fas fa-pause"></i>' +
                    '</button>' +
                    '<button class="prtg-btn prtg-btn-danger" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 4px;" onclick="window.deletePRTGInline(' + originalIndex + ')" title="Delete">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>';
            }
            
            html += 
                '<tr>' +
                    '<td>' + (idx + 1) + '</td>' +
                    '<td><strong>' + escapeHtml(item.location) + '</strong> ' + '</td>' +
                    '<td>' + escapeHtml(startDisplay) + '</td>' +
                    '<td>' + escapeHtml(startDate) + '</td>' +
                    '<td>' + escapeHtml(stopDisplay) + '</td>' +
                    '<td>' + escapeHtml(stopDate) + '</td>' +
                    '<td style="text-align: center; white-space: nowrap;">' +
                        actionHtml +
                    '</td>' +
                '</tr>';
        }

        tableBody.innerHTML = html;
        if (totalCount) totalCount.textContent = mainData.length;
        if (activeCount) activeCount.textContent = active;
        if (doneCount) doneCount.textContent = done;
        if (pausedCount) pausedCount.textContent = paused;
    }

    // ================== PAUSE FUNCTIONS ==================
    window.pausePRTGInline = function(index) {
        if (index < 0 || index >= prtgData.length) return;
        
        var item = prtgData[index];
        var location = item.location;
        
        if (item.opt && item.opt.toUpperCase() !== 'PARENT') {
            showToast('⚠️ Data CHILD tidak bisa di-pause', 'error');
            return;
        }
        
        if (item.status === 'done') {
            showToast('⚠️ Data sudah DONE', 'error');
            return;
        }
        
        if (item.status === 'paused') {
            showToast('ℹ️ Data sudah PAUSED', 'info');
            return;
        }
        
        showToast('⏳ Mengirim request pause...', 'info');
        
        fetch(API_URL + '?path=prtg/pause-by-location', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: location })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('⏸️ ' + result.message, 'pause');
            } else {
                showToast(result.message || 'Gagal pause data', 'error');
            }
        })
        .catch(function(err) {
            // console.error('Error pausing PRTG data:', err);
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    };

    window.unpausePRTGInline = function(index) {
        if (index < 0 || index >= prtgData.length) return;
        
        var item = prtgData[index];
        var location = item.location;
        
        if (item.opt && item.opt.toUpperCase() !== 'PARENT') {
            showToast('⚠️ Data CHILD tidak bisa di-unpause', 'error');
            return;
        }
        
        if (item.status !== 'paused') {
            showToast('ℹ️ Data tidak dalam status PAUSED', 'info');
            return;
        }
        
        showToast('⏳ Mengirim request unpause...', 'info');
        
        fetch(API_URL + '?path=prtg/unpause-by-location', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: location })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('▶️ ' + result.message, 'success');
            } else {
                showToast(result.message || 'Gagal unpause data', 'error');
            }
        })
        .catch(function(err) {
            // console.error('Error unpausing PRTG data:', err);
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    };

    // ================== TEST BATTERY FUNCTIONS ==================
    function updateTestBatteryDisplay() {
        var tableBody = document.getElementById('testBatteryTableBody');
        var countSpan = document.getElementById('testBatteryCount');
        
        if (!tableBody) return;
        
        var testBatteryData = prtgData.filter(function(item) {
            return item.opt && item.opt === 'TEST_BATTERY';
        });
        
        // Kelompokkan berdasarkan lokasi + tanggal (startDate)
        var locationDateMap = {};
        testBatteryData.forEach(function(item) {
            var loc = item.location || '';
            var startDate = item.startDate || 'N/A';
            var key = loc + '|' + startDate;
            
            if (!locationDateMap[key]) {
                locationDateMap[key] = {
                    location: loc,
                    startDate: startDate,
                    total: 0,
                    activeCount: 0,
                    doneCount: 0,
                    items: [],
                    allDone: true
                };
            }
            locationDateMap[key].total++;
            locationDateMap[key].items.push(item);
            if (item.status === 'active') locationDateMap[key].activeCount++;
            else if (item.status === 'done') locationDateMap[key].doneCount++;
            else locationDateMap[key].allDone = false;
        });
        
        // Konversi ke array untuk sorting
        var groupedData = Object.values(locationDateMap);
        
        // Sorting: yang ada ACTIVE diurutkan lebih dulu, lalu berdasarkan tanggal terbaru
        groupedData.sort(function(a, b) {
            var aHasActive = a.activeCount > 0;
            var bHasActive = b.activeCount > 0;
            if (aHasActive && !bHasActive) return -1;
            if (!aHasActive && bHasActive) return 1;
            
            var aDate = parseDateFromString(a.startDate);
            var bDate = parseDateFromString(b.startDate);
            if (aDate && bDate) return bDate - aDate;
            if (aDate && !bDate) return -1;
            if (!aDate && bDate) return 1;
            return 0;
        });
        
        if (groupedData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 30px 20px; color: #94a3b8;">
                        <i class="fas fa-database" style="font-size: 1.5rem; display: block; margin-bottom: 10px;"></i>
                        Tidak ada data TEST_BATTERY
                    </td>
                </tr>
            `;
            if (countSpan) countSpan.textContent = '0';
            return;
        }
        
        var html = '';
        var idx = 1;
        
        groupedData.forEach(function(group) {
            var loc = group.location;
            var startDate = group.startDate;
            var totalCount = group.total;
            var isActive = group.activeCount > 0;
            var allDone = group.doneCount === group.total && group.total > 0;
            
            // Tampilkan counter jika total data di tanggal yang sama > 1
            var displayLoc = loc;
            if (totalCount > 1) {
                displayLoc = loc + ' (' + totalCount + 'X)';
            }
            
            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 8px 6px; color: #94a3b8; width: 30px;">${idx}</td>
                    <td style="padding: 8px 6px; color: #e6eef8;">
                        ${escapeHtml(displayLoc)}
                        ${startDate !== 'N/A' ? '<span style="color: #94a3b8; font-size: 0.65rem; margin-left: 6px;">(' + startDate + ')</span>' : ''}
                    </td>
                    <td style="padding: 8px 6px; text-align: center; white-space: nowrap; width: 130px;">
                        ${isActive ? `
                            <button onclick="window.markTestBatteryAsDone('${escapeHtml(loc)}', '${escapeHtml(startDate)}')" 
                                    style="background: #22c55e; border: none; color: white; padding: 4px 12px; border-radius: 6px; font-size: 0.7rem; cursor: pointer; font-weight: 600; transition: all 0.2s; margin-right: 4px;">
                                <i class="fas fa-check"></i> 
                            </button>
                        ` : `
                            <span style="color: #22c55e; font-size: 1rem;">
                                <i class="fas fa-check-circle"></i>
                            </span>
                        `}
                        ${!allDone ? `
                            <button onclick="window.deleteTestBatteryGroup('${escapeHtml(loc)}', '${escapeHtml(startDate)}')" 
                                    style="background: #ef4444; border: none; color: white; padding: 4px 12px; border-radius: 6px; font-size: 0.7rem; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
            idx++;
        });
        
        tableBody.innerHTML = html;
        if (countSpan) countSpan.textContent = testBatteryData.length;
    }

    // MARK TEST BATTERY AS DONE (with date parameter)
    window.markTestBatteryAsDone = function(location, startDate) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        // Cari data dengan lokasi, tanggal, dan status active
        var activeItems = prtgData.filter(function(item) {
            return item.location && 
                item.location.toUpperCase() === location.toUpperCase() &&
                item.startDate === startDate &&
                item.opt === 'TEST_BATTERY' && 
                item.status === 'active';
        });
        
        if (activeItems.length === 0) {
            showToast('⚠️ Tidak ada data TEST_BATTERY ACTIVE untuk "' + location + '" tanggal ' + startDate, 'error');
            return;
        }
        
        showToast('⏳ Mengirim request done...', 'info');
        
        fetch(API_URL + '?path=prtg/done-by-location-date-opt', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                location: location,
                startDate: startDate,
                opt: 'TEST_BATTERY'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('✅ ' + result.updated_count + ' data "' + location + '" marked as DONE!', 'success');
            } else {
                showToast(result.message || 'Gagal update data', 'error');
            }
        })
        .catch(function(err) {
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    };

    // DELETE TEST BATTERY GROUP (with date parameter)
    window.deleteTestBatteryGroup = function(location, startDate) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var items = prtgData.filter(function(item) {
            return item.location && 
                item.location.toUpperCase() === location.toUpperCase() &&
                item.startDate === startDate &&
                item.opt === 'TEST_BATTERY';
        });
        
        if (items.length === 0) {
            showToast('⚠️ Data TEST_BATTERY tidak ditemukan!', 'error');
            return;
        }
        
        var totalItems = items.length;
        var activeItems = items.filter(function(item) { return item.status === 'active'; });
        var msg = totalItems > 1 ? 
            'Hapus ' + totalItems + ' data TEST_BATTERY untuk "' + location + '" tanggal ' + startDate + '?\n' +
            '(Active: ' + activeItems.length + ', Done: ' + (totalItems - activeItems.length) + ')' :
            'Hapus data TEST_BATTERY untuk "' + location + '" tanggal ' + startDate + '?';
        
        if (confirm(msg)) {
            showToast('⏳ Menghapus data...', 'info');
            
            fetch(API_URL + '?path=prtg/delete-by-location-date-opt', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    location: location,
                    startDate: startDate,
                    opt: 'TEST_BATTERY'
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    loadPRTGData();
                    showToast('✅ ' + result.deleted_count + ' data TEST_BATTERY dihapus!', 'success');
                } else {
                    showToast(result.message || 'Gagal hapus data', 'error');
                }
            })
            .catch(function(err) {
                showToast('⚠️ Gagal terhubung ke server', 'error');
            });
        }
    };

    // MARK TEST BATTERY AS DONE
    window.markTestBatteryAsDone = function(location) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var activeItems = prtgData.filter(function(item) {
            return item.location && item.location.toUpperCase() === location.toUpperCase() &&
                item.opt === 'TEST_BATTERY' && item.status === 'active';
        });
        
        if (activeItems.length === 0) {
            showToast('⚠️ Tidak ada data TEST_BATTERY ACTIVE untuk "' + location + '"', 'error');
            return;
        }
        
        showToast('⏳ Mengirim request done...', 'info');
        
        fetch(API_URL + '?path=prtg/done-by-location-opt', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                location: location,
                opt: 'TEST_BATTERY'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('✅ ' + result.updated_count + ' data "' + location + '" marked as DONE!', 'success');
            } else {
                showToast(result.message || 'Gagal update data', 'error');
            }
        })
        .catch(function(err) {
            // console.error('Error marking TEST_BATTERY as done:', err);
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    };

    // DELETE TEST BATTERY
    window.deleteTestBattery = function(location) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var items = prtgData.filter(function(item) {
            return item.location && 
                item.location.toUpperCase() === location.toUpperCase() &&
                item.opt === 'TEST_BATTERY';
        });
        
        if (items.length === 0) {
            showToast('⚠️ Data TEST_BATTERY tidak ditemukan!', 'error');
            return;
        }
        
        var totalItems = items.length;
        var activeItems = items.filter(function(item) { return item.status === 'active'; });
        var msg = totalItems > 1 ? 
            'Hapus ' + totalItems + ' data TEST_BATTERY untuk "' + location + '"?\n' +
            '(Active: ' + activeItems.length + ', Done: ' + (totalItems - activeItems.length) + ')' :
            'Hapus data TEST_BATTERY untuk "' + location + '"?';
        
        if (confirm(msg)) {
            showToast('⏳ Menghapus data...', 'info');
            
            fetch(API_URL + '?path=prtg/delete-by-location-opt', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    location: location,
                    opt: 'TEST_BATTERY'
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    loadPRTGData();
                    showToast('✅ ' + result.deleted_count + ' data TEST_BATTERY dihapus!', 'success');
                } else {
                    showToast(result.message || 'Gagal hapus data', 'error');
                }
            })
            .catch(function(err) {
                // console.error('Error deleting TEST_BATTERY:', err);
                showToast('⚠️ Gagal terhubung ke server', 'error');
            });
        }
    };

    window.openTestBatteryModal = function() {
        var modal = document.getElementById('prtgTestBatteryModal');
        if (!modal) return;
        
        updateTestBatteryDisplay();
        modal.style.display = 'flex';
        
        var input = document.getElementById('testBatteryInput');
        if (input) {
            setTimeout(function() { input.focus(); }, 100);
        }
        
        modal.onclick = function(e) {
            if (e.target === modal) closeTestBatteryModal();
        };
    };

    window.closeTestBatteryModal = function() {
        var modal = document.getElementById('prtgTestBatteryModal');
        if (modal) modal.style.display = 'none';
    };

    function showTestBatteryNotification(message, isSuccess) {
        var notification = document.getElementById('testBatteryNotification');
        var messageEl = document.getElementById('testBatteryNotificationMessage');
        if (!notification || !messageEl) return;
        
        messageEl.textContent = message || (isSuccess ? 'Data berhasil ditambahkan!' : 'Gagal menambahkan data!');
        notification.style.display = 'block';
        notification.style.borderColor = isSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
        notification.style.background = isSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
        notification.style.color = isSuccess ? '#86efac' : '#fca5a5';
        
        setTimeout(function() {
            notification.style.display = 'none';
        }, 5000);
    }

    window.submitTestBattery = function() {
        var input = document.getElementById('testBatteryInput');
        if (!input) return;
        
        var text = input.value.trim();
        if (!text) {
            showToast('⚠️ Harap masukkan nama lokasi!', 'error');
            return;
        }
        
        var lines = text.split('\n').filter(function(line) { return line.trim() !== ''; });
        
        if (lines.length === 0) {
            showToast('⚠️ Harap masukkan nama lokasi!', 'error');
            return;
        }
        
        var successCount = 0;
        var errorCount = 0;
        var duplicateCount = 0;
        var totalLines = lines.length;
        
        input.disabled = true;
        var submitBtn = document.querySelector('#prtgTestBatteryModal button[onclick="window.submitTestBattery()"]');
        if (submitBtn) submitBtn.disabled = true;
        
        showToast('📤 Mengirim ' + totalLines + ' data...', 'info');
        
        var index = 0;
        
        function processNext() {
            if (index >= lines.length) {
                input.disabled = false;
                if (submitBtn) submitBtn.disabled = false;
                input.value = '';
                
                setTimeout(function() {
                    loadPRTGData();
                    setTimeout(function() {
                        updateTestBatteryDisplay();
                        // console.log('🔄 TEST_BATTERY display updated!');
                        
                        if (successCount > 0) {
                            showTestBatteryNotification('✅ DATA DITAMBAHKAN', true);
                        } else if (duplicateCount > 0 && errorCount === 0) {
                            showTestBatteryNotification('⚠️ DATA SUDAH DITAMBAHKAN', false);
                        } else if (errorCount > 0 && successCount === 0) {
                            showTestBatteryNotification('❌ GAGAL MENAMBAHKAN DATA', false);
                        } else {
                            showTestBatteryNotification('✅ Selesai! ' + successCount + ' data ditambahkan.', true);
                        }
                    }, 100);
                }, 300);
                
                var message = '';
                if (successCount > 0) {
                    message = '✅ DATA DITAMBAHKAN';
                }
                if (duplicateCount > 0) {
                    message += (message ? ' ' : '') + '⚠️ ' + duplicateCount + ' data duplikat dilewati.';
                }
                if (errorCount > 0 && successCount === 0) {
                    message = '❌ Gagal menambahkan semua data!';
                } else if (errorCount > 0) {
                    message += ' ❌ ' + errorCount + ' data gagal.';
                }
                
                showToast(message || '✅ Selesai!', successCount > 0 ? 'success' : 'error');
                return;
            }
            
            var location = lines[index].trim();
            if (!location) {
                errorCount++;
                index++;
                processNext();
                return;
            }
            
            var existing = prtgData.filter(function(item) {
                return item.location && 
                    item.location.toUpperCase() === location.toUpperCase() &&
                    item.opt === 'TEST_BATTERY';
            });
            
            if (existing.length > 0) {
                duplicateCount++;
                index++;
                processNext();
                return;
            }
            
            var now = new Date();
            var dateStr = (now.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                        now.getDate().toString().padStart(2, '0') + '/' + 
                        now.getFullYear();
            var timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0') + ':' + 
                        now.getSeconds().toString().padStart(2, '0');
            var ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            
            fetch(API_URL + '?path=prtg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: location,
                    opt: 'TEST_BATTERY',
                    vdc: '50 V',
                    startDate: dateStr,
                    startTime: timeStr,
                    ampm: ampm
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    successCount++;
                    prtgData.push(result.data);
                    // console.log('✅ Added TEST_BATTERY:', location);
                } else {
                    if (result.duplicate) {
                        duplicateCount++;
                    } else {
                        errorCount++;
                    }
                }
                index++;
                processNext();
            })
            .catch(function(err) {
                // console.error('Error:', err);
                errorCount++;
                index++;
                processNext();
            });
        }
        
        processNext();
    };

    var testBatteryInput = document.getElementById('testBatteryInput');
    if (testBatteryInput) {
        testBatteryInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.submitTestBattery();
            }
        });
    }

    // ================== POP DOWN FUNCTIONS ==================
    function updatePopDownDisplay() {
        var tableBody = document.getElementById('popDownTableBody');
        var countSpan = document.getElementById('popDownCount');
        
        if (!tableBody) return;
        
        var popDownData = prtgData.filter(function(item) {
            return item.opt && item.opt === 'POP_DOWN';
        });
        
        var locationMap = {};
        popDownData.forEach(function(item) {
            var loc = item.location || '';
            if (!locationMap[loc]) {
                locationMap[loc] = { 
                    total: 0, 
                    activeCount: 0, 
                    doneCount: 0,
                    items: [],
                    latestItem: null,
                    allDone: true // Tambahkan flag
                };
            }
            locationMap[loc].total++;
            locationMap[loc].items.push(item);
            if (item.status === 'active') locationMap[loc].activeCount++;
            else if (item.status === 'done') locationMap[loc].doneCount++;
            else locationMap[loc].allDone = false;
            
            if (!locationMap[loc].latestItem || item.id > locationMap[loc].latestItem.id) {
                locationMap[loc].latestItem = item;
            }
        });
        
        var locationKeys = Object.keys(locationMap);
        locationKeys.sort(function(a, b) {
            if (locationMap[a].activeCount > 0 && locationMap[b].activeCount === 0) return -1;
            if (locationMap[a].activeCount === 0 && locationMap[b].activeCount > 0) return 1;
            return 0;
        });
        
        if (locationKeys.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 30px 20px; color: #94a3b8;">
                        <i class="fas fa-database" style="font-size: 1.5rem; display: block; margin-bottom: 10px;"></i>
                        Tidak ada data POP_DOWN
                    </td>
                </tr>
            `;
            if (countSpan) countSpan.textContent = '0';
            return;
        }
        
        var html = '';
        var idx = 1;
        
        locationKeys.forEach(function(loc) {
            var data = locationMap[loc];
            var isActive = data.activeCount > 0;
            var totalCount = data.total;
            var displayLoc = totalCount > 1 ? loc + ' (' + totalCount + 'X)' : loc;
            var allDone = data.doneCount === data.total && data.total > 0;
            
            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 8px 6px; color: #94a3b8;">${idx}</td>
                    <td style="padding: 8px 6px; color: #e6eef8;">${escapeHtml(displayLoc)}</td>
                    <td style="padding: 8px 6px; text-align: center;">
                        ${isActive ? `
                            <button onclick="window.markPopDownAsDone('${escapeHtml(loc)}')" 
                                    style="background: #22c55e; border: none; color: white; padding: 4px 14px; border-radius: 6px; font-size: 0.7rem; cursor: pointer; font-weight: 600; transition: all 0.2s;"
                                    onmouseover="this.style.transform='scale(1.05)'" 
                                    onmouseout="this.style.transform='scale(1)'">
                                <i class="fas fa-check"></i> 
                            </button>
                        ` : `
                            <span style="color: #22c55e; font-size: 1rem;">
                                <i class="fas fa-check-circle"></i>
                            </span>
                        `}
                    </td>
                    <td style="padding: 8px 6px; text-align: center;">
                        ${!allDone ? `
                            <button onclick="window.deletePopDown('${escapeHtml(loc)}')" 
                                    style="background: #ef4444; border: none; color: white; padding: 4px 14px; border-radius: 6px; font-size: 0.7rem; cursor: pointer; font-weight: 600; transition: all 0.2s;"
                                    onmouseover="this.style.transform='scale(1.05)'" 
                                    onmouseout="this.style.transform='scale(1)'">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
            idx++;
        });
        
        tableBody.innerHTML = html;
        if (countSpan) countSpan.textContent = popDownData.length;
    }

    window.deletePopDown = function(location) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var items = prtgData.filter(function(item) {
            return item.location && 
                item.location.toUpperCase() === location.toUpperCase() &&
                item.opt === 'POP_DOWN';
        });
        
        if (items.length === 0) {
            showToast('⚠️ Data POP_DOWN tidak ditemukan!', 'error');
            return;
        }
        
        var totalItems = items.length;
        var activeItems = items.filter(function(item) { return item.status === 'active'; });
        var msg = totalItems > 1 ? 
            'Hapus ' + totalItems + ' data POP_DOWN untuk "' + location + '"?\n' +
            '(Active: ' + activeItems.length + ', Done: ' + (totalItems - activeItems.length) + ')' :
            'Hapus data POP_DOWN untuk "' + location + '"?';
        
        if (confirm(msg)) {
            showToast('⏳ Menghapus data...', 'info');
            
            fetch(API_URL + '?path=prtg/delete-by-location-opt', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    location: location,
                    opt: 'POP_DOWN'
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    loadPRTGData();
                    showToast('✅ ' + result.deleted_count + ' data POP_DOWN dihapus!', 'success');
                } else {
                    showToast(result.message || 'Gagal hapus data', 'error');
                }
            })
            .catch(function(err) {
                // console.error('Error deleting POP_DOWN:', err);
                showToast('⚠️ Gagal terhubung ke server', 'error');
            });
        }
    };

    window.markPopDownAsDone = function(location) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var activeItems = prtgData.filter(function(item) {
            return item.location && item.location.toUpperCase() === location.toUpperCase() &&
                item.opt === 'POP_DOWN' && item.status === 'active';
        });
        
        if (activeItems.length === 0) {
            showToast('⚠️ Tidak ada data POP_DOWN ACTIVE untuk "' + location + '"', 'error');
            return;
        }
        
        showToast('⏳ Mengirim request done...', 'info');
        
        fetch(API_URL + '?path=prtg/done-by-location-opt', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                location: location,
                opt: 'POP_DOWN'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('✅ ' + result.updated_count + ' data "' + location + '" marked as DONE!', 'success');
            } else {
                showToast(result.message || 'Gagal update data', 'error');
            }
        })
        .catch(function(err) {
            // console.error('Error marking POP_DOWN as done:', err);
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    };

    window.openPopDownModal = function() {
        var modal = document.getElementById('prtgPopDownModal');
        if (!modal) return;
        
        updatePopDownDisplay();
        modal.style.display = 'flex';
        
        var input = document.getElementById('popDownInput');
        if (input) {
            setTimeout(function() { input.focus(); }, 100);
        }
        
        modal.onclick = function(e) {
            if (e.target === modal) closePopDownModal();
        };
    };

    window.closePopDownModal = function() {
        var modal = document.getElementById('prtgPopDownModal');
        if (modal) modal.style.display = 'none';
    };

    function showPopDownNotification(message, isSuccess) {
        var notification = document.getElementById('popDownNotification');
        var messageEl = document.getElementById('popDownNotificationMessage');
        if (!notification || !messageEl) return;
        
        messageEl.textContent = message || (isSuccess ? 'Data POP DOWN berhasil ditambahkan!' : 'Gagal menambahkan data POP DOWN!');
        notification.style.display = 'block';
        notification.style.borderColor = isSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
        notification.style.background = isSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
        notification.style.color = isSuccess ? '#86efac' : '#fca5a5';
        
        setTimeout(function() {
            notification.style.display = 'none';
        }, 5000);
    }

    window.submitPopDown = function() {
        var input = document.getElementById('popDownInput');
        var errorDiv = document.getElementById('popDownError');
        var errorMessage = document.getElementById('popDownErrorMessage');
        
        if (!input) return;
        
        var text = input.value.trim();
        if (!text) {
            showToast('⚠️ Harap masukkan nama lokasi!', 'error');
            return;
        }
        
        var lines = text.split('\n').filter(function(line) { return line.trim() !== ''; });
        
        if (lines.length === 0) {
            showToast('⚠️ Harap masukkan nama lokasi!', 'error');
            return;
        }
        
        var hasActive = false;
        var activeLocations = [];
        lines.forEach(function(location) {
            location = location.trim();
            if (!location) return;
            
            var activeItem = prtgData.filter(function(item) {
                return item.location && 
                    item.location.toUpperCase() === location.toUpperCase() &&
                    item.opt === 'POP_DOWN' && 
                    item.status === 'active';
            });
            
            if (activeItem.length > 0) {
                hasActive = true;
                activeLocations.push(location);
            }
        });
        
        if (hasActive) {
            if (errorDiv && errorMessage) {
                errorMessage.textContent = 'POP MASIH DOWN: ' + activeLocations.join(', ');
                errorDiv.style.display = 'block';
                setTimeout(function() { errorDiv.style.display = 'none'; }, 5000);
            }
            if (errorDiv) {
                errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        
        var successCount = 0;
        var errorCount = 0;
        var duplicateCount = 0;
        var totalLines = lines.length;
        
        input.disabled = true;
        var submitBtn = document.querySelector('#prtgPopDownModal button[onclick="window.submitPopDown()"]');
        if (submitBtn) submitBtn.disabled = true;
        
        showToast('📤 Mengirim ' + totalLines + ' data...', 'info');
        
        var now = new Date();
        var dateStr = (now.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                    now.getDate().toString().padStart(2, '0') + '/' + 
                    now.getFullYear();
        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0') + ':' + 
                    now.getSeconds().toString().padStart(2, '0');
        var ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        
        var index = 0;
        
        function processNext() {
            if (index >= lines.length) {
                input.disabled = false;
                if (submitBtn) submitBtn.disabled = false;
                input.value = '';
                
                setTimeout(function() {
                    loadPRTGData();
                    setTimeout(function() {
                        updatePopDownDisplay();
                        // console.log('🔄 POP_DOWN display updated!');
                        
                        if (successCount > 0) {
                            showPopDownNotification('✅ DATA DITAMBAHKN', true);
                        } else if (duplicateCount > 0 && errorCount === 0) {
                            showPopDownNotification('⚠️ DATA SUDAH DITAMBAHKAN', false);
                        } else if (errorCount > 0 && successCount === 0) {
                            showPopDownNotification('❌ DATA GAGAL DITAMBAHKAN', false);
                        } else {
                            showPopDownNotification('✅ Selesai! ' + successCount + ' data POP_DOWN ditambahkan.', true);
                        }
                    }, 100);
                }, 300);
                
                var message = '';
                if (successCount > 0) {
                    message = '✅ DATA DITAMBAHKAN';
                }
                if (duplicateCount > 0) {
                    message += (message ? ' ' : '') + '⚠️ DATA SUDAH DITAMBAHKAN';
                }
                if (errorCount > 0 && successCount === 0) {
                    message = '❌ Gagal menambahkan semua data!';
                } else if (errorCount > 0) {
                    message += ' ❌ ' + errorCount + ' data gagal.';
                }
                
                showToast(message || '✅ Selesai!', successCount > 0 ? 'success' : 'error');
                return;
            }
            
            var location = lines[index].trim();
            if (!location) {
                errorCount++;
                index++;
                processNext();
                return;
            }
            
            var existing = prtgData.filter(function(item) {
                return item.location && 
                    item.location.toUpperCase() === location.toUpperCase() &&
                    item.opt === 'POP_DOWN' &&
                    item.status === 'active';
            });
            
            if (existing.length > 0) {
                duplicateCount++;
                index++;
                processNext();
                return;
            }
            
            fetch(API_URL + '?path=prtg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: location,
                    opt: 'POP_DOWN',
                    vdc: '50 V',
                    startDate: dateStr,
                    startTime: timeStr,
                    ampm: ampm
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    successCount++;
                    prtgData.push(result.data);
                    // console.log('✅ Added POP_DOWN:', location);
                } else {
                    if (result.duplicate) {
                        duplicateCount++;
                    } else {
                        errorCount++;
                    }
                }
                index++;
                processNext();
            })
            .catch(function(err) {
                // console.error('Error:', err);
                errorCount++;
                index++;
                processNext();
            });
        }
        
        processNext();
    };

    var popDownInput = document.getElementById('popDownInput');
    if (popDownInput) {
        popDownInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.submitPopDown();
            }
        });
    }

    // ================== POP UNMONITOR FUNCTIONS ==================
function updatePopUnmonitorDisplay() {
    var tableBody = document.getElementById('popUnmonitorTableBody');
    var countSpan = document.getElementById('popUnmonitorCount');
    
    if (!tableBody) return;
    
    var popUnmonitorData = prtgData.filter(function(item) {
        return item.opt && item.opt === 'POP_UNMONITOR';
    });
    
    // Kelompokkan berdasarkan lokasi + tanggal (startDate)
    var locationDateMap = {};
    popUnmonitorData.forEach(function(item) {
        var loc = item.location || '';
        var startDate = item.startDate || 'N/A';
        var key = loc + '|' + startDate;
        
        if (!locationDateMap[key]) {
            locationDateMap[key] = {
                location: loc,
                startDate: startDate,
                total: 0,
                activeCount: 0,
                doneCount: 0,
                items: [],
                allDone: true
            };
        }
        locationDateMap[key].total++;
        locationDateMap[key].items.push(item);
        if (item.status === 'active') locationDateMap[key].activeCount++;
        else if (item.status === 'done') locationDateMap[key].doneCount++;
        else locationDateMap[key].allDone = false;
    });
    
    // Konversi ke array untuk sorting
    var groupedData = Object.values(locationDateMap);
    
    // Sorting: yang ada ACTIVE diurutkan lebih dulu, lalu berdasarkan tanggal terbaru
    groupedData.sort(function(a, b) {
        var aHasActive = a.activeCount > 0;
        var bHasActive = b.activeCount > 0;
        if (aHasActive && !bHasActive) return -1;
        if (!aHasActive && bHasActive) return 1;
        
        var aDate = parseDateFromString(a.startDate);
        var bDate = parseDateFromString(b.startDate);
        if (aDate && bDate) return bDate - aDate;
        if (aDate && !bDate) return -1;
        if (!aDate && bDate) return 1;
        return 0;
    });
    
    if (groupedData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 30px 20px; color: #94a3b8;">
                    <i class="fas fa-database" style="font-size: 1.5rem; display: block; margin-bottom: 10px;"></i>
                    Tidak ada data POP_UNMONITOR
                </td>
            </tr>
        `;
        if (countSpan) countSpan.textContent = '0';
        return;
    }
    
    var html = '';
    var idx = 1;
    
    groupedData.forEach(function(group) {
        var loc = group.location;
        var startDate = group.startDate;
        var totalCount = group.total;
        var isActive = group.activeCount > 0;
        var allDone = group.doneCount === group.total && group.total > 0;
        
        // Tampilkan counter jika total data di tanggal yang sama > 1
        var displayLoc = loc;
        if (totalCount > 1) {
            displayLoc = loc + ' (' + totalCount + 'X)';
        }
        
        html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px 6px; color: #94a3b8;">${idx}</td>
                <td style="padding: 8px 6px; color: #e6eef8;">
                    ${escapeHtml(displayLoc)}
                    ${startDate !== 'N/A' ? '<span style="color: #94a3b8; font-size: 0.65rem; margin-left: 6px;">(' + startDate + ')</span>' : ''}
                </td>
                <td style="padding: 8px 6px; text-align: center;">
                    ${isActive ? `
                        <button onclick="window.markPopUnmonitorAsDone('${escapeHtml(loc)}', '${escapeHtml(startDate)}')" 
                                style="background: #22c55e; border: none; color: white; padding: 4px 14px; border-radius: 6px; font-size: 0.7rem; cursor: pointer; font-weight: 600; transition: all 0.2s;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-check"></i> 
                        </button>
                    ` : `
                        <span style="color: #22c55e; font-size: 1rem;">
                            <i class="fas fa-check-circle"></i>
                        </span>
                    `}
                </td>
                <td style="padding: 8px 6px; text-align: center;">
                    ${!allDone ? `
                        <button onclick="window.deletePopUnmonitorGroup('${escapeHtml(loc)}', '${escapeHtml(startDate)}')" 
                                style="background: #ef4444; border: none; color: white; padding: 4px 14px; border-radius: 6px; font-size: 0.7rem; cursor: pointer; font-weight: 600; transition: all 0.2s;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
        idx++;
    });
    
    tableBody.innerHTML = html;
    if (countSpan) countSpan.textContent = popUnmonitorData.length;
}

// MARK POP UNMONITOR AS DONE (with date parameter)
window.markPopUnmonitorAsDone = function(location, startDate) {
    if (!location) {
        showToast('⚠️ Lokasi tidak valid!', 'error');
        return;
    }
    
    var activeItems = prtgData.filter(function(item) {
        return item.location && 
            item.location.toUpperCase() === location.toUpperCase() &&
            item.startDate === startDate &&
            item.opt === 'POP_UNMONITOR' && 
            item.status === 'active';
    });
    
    if (activeItems.length === 0) {
        showToast('⚠️ Tidak ada data POP_UNMONITOR ACTIVE untuk "' + location + '" tanggal ' + startDate, 'error');
        return;
    }
    
    showToast('⏳ Mengirim request done...', 'info');
    
    fetch(API_URL + '?path=prtg/done-by-location-date-opt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            location: location,
            startDate: startDate,
            opt: 'POP_UNMONITOR'
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.success) {
            loadPRTGData();
            showToast('✅ ' + result.updated_count + ' data "' + location + '" marked as DONE!', 'success');
        } else {
            showToast(result.message || 'Gagal update data', 'error');
        }
    })
    .catch(function(err) {
        showToast('⚠️ Gagal terhubung ke server', 'error');
    });
};

// DELETE POP UNMONITOR GROUP (with date parameter)
window.deletePopUnmonitorGroup = function(location, startDate) {
    if (!location) {
        showToast('⚠️ Lokasi tidak valid!', 'error');
        return;
    }
    
    var items = prtgData.filter(function(item) {
        return item.location && 
            item.location.toUpperCase() === location.toUpperCase() &&
            item.startDate === startDate &&
            item.opt === 'POP_UNMONITOR';
    });
    
    if (items.length === 0) {
        showToast('⚠️ Data POP_UNMONITOR tidak ditemukan!', 'error');
        return;
    }
    
    var totalItems = items.length;
    var activeItems = items.filter(function(item) { return item.status === 'active'; });
    var msg = totalItems > 1 ? 
        'Hapus ' + totalItems + ' data POP_UNMONITOR untuk "' + location + '" tanggal ' + startDate + '?\n' +
        '(Active: ' + activeItems.length + ', Done: ' + (totalItems - activeItems.length) + ')' :
        'Hapus data POP_UNMONITOR untuk "' + location + '" tanggal ' + startDate + '?';
    
    if (confirm(msg)) {
        showToast('⏳ Menghapus data...', 'info');
        
        fetch(API_URL + '?path=prtg/delete-by-location-date-opt', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                location: location,
                startDate: startDate,
                opt: 'POP_UNMONITOR'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('✅ ' + result.deleted_count + ' data POP_UNMONITOR dihapus!', 'success');
            } else {
                showToast(result.message || 'Gagal hapus data', 'error');
            }
        })
        .catch(function(err) {
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    }
};

// ================== POP DOWN FUNCTIONS ==================

function updatePopDownDisplay() {
    var tableBody = document.getElementById('popDownTableBody');
    var countSpan = document.getElementById('popDownCount');
    
    if (!tableBody) return;
    
    var popDownData = prtgData.filter(function(item) {
        return item.opt && item.opt === 'POP_DOWN';
    });
    
    // Kelompokkan berdasarkan lokasi + tanggal (startDate)
    var locationDateMap = {};
    popDownData.forEach(function(item) {
        var loc = item.location || '';
        var startDate = item.startDate || 'N/A';
        var key = loc + '|' + startDate;
        
        if (!locationDateMap[key]) {
            locationDateMap[key] = {
                location: loc,
                startDate: startDate,
                total: 0,
                activeCount: 0,
                doneCount: 0,
                items: [],
                allDone: true
            };
        }
        locationDateMap[key].total++;
        locationDateMap[key].items.push(item);
        if (item.status === 'active') locationDateMap[key].activeCount++;
        else if (item.status === 'done') locationDateMap[key].doneCount++;
        else locationDateMap[key].allDone = false;
    });
    
    // Konversi ke array untuk sorting
    var groupedData = Object.values(locationDateMap);
    
    // Sorting: yang ada ACTIVE diurutkan lebih dulu, lalu berdasarkan tanggal terbaru
    groupedData.sort(function(a, b) {
        var aHasActive = a.activeCount > 0;
        var bHasActive = b.activeCount > 0;
        if (aHasActive && !bHasActive) return -1;
        if (!aHasActive && bHasActive) return 1;
        
        var aDate = parseDateFromString(a.startDate);
        var bDate = parseDateFromString(b.startDate);
        if (aDate && bDate) return bDate - aDate;
        if (aDate && !bDate) return -1;
        if (!aDate && bDate) return 1;
        return 0;
    });
    
    if (groupedData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 30px 20px; color: #94a3b8;">
                    <i class="fas fa-database" style="font-size: 1.5rem; display: block; margin-bottom: 10px;"></i>
                    Tidak ada data POP_DOWN
                </td>
            </tr>
        `;
        if (countSpan) countSpan.textContent = '0';
        return;
    }
    
    var html = '';
    var idx = 1;
    
    groupedData.forEach(function(group) {
        var loc = group.location;
        var startDate = group.startDate;
        var totalCount = group.total;
        var isActive = group.activeCount > 0;
        var allDone = group.doneCount === group.total && group.total > 0;
        
        // Tampilkan counter jika total data di tanggal yang sama > 1
        var displayLoc = loc;
        if (totalCount > 1) {
            displayLoc = loc + ' (' + totalCount + 'X)';
        }
        
        html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px 6px; color: #94a3b8;">${idx}</td>
                <td style="padding: 8px 6px; color: #e6eef8;">
                    ${escapeHtml(displayLoc)}
                    ${startDate !== 'N/A' ? '<span style="color: #94a3b8; font-size: 0.65rem; margin-left: 6px;">(' + startDate + ')</span>' : ''}
                </td>
                <td style="padding: 8px 6px; text-align: center;">
                    ${isActive ? `
                        <button onclick="window.markPopDownAsDone('${escapeHtml(loc)}', '${escapeHtml(startDate)}')" 
                                style="background: #22c55e; border: none; color: white; padding: 4px 14px; border-radius: 6px; font-size: 0.7rem; cursor: pointer; font-weight: 600; transition: all 0.2s;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-check"></i> 
                        </button>
                    ` : `
                        <span style="color: #22c55e; font-size: 1rem;">
                            <i class="fas fa-check-circle"></i>
                        </span>
                    `}
                </td>
                <td style="padding: 8px 6px; text-align: center;">
                    ${!allDone ? `
                        <button onclick="window.deletePopDownGroup('${escapeHtml(loc)}', '${escapeHtml(startDate)}')" 
                                style="background: #ef4444; border: none; color: white; padding: 4px 14px; border-radius: 6px; font-size: 0.7rem; cursor: pointer; font-weight: 600; transition: all 0.2s;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
        idx++;
    });
    
    tableBody.innerHTML = html;
    if (countSpan) countSpan.textContent = popDownData.length;
}

    // MARK POP DOWN AS DONE (with date parameter)
    window.markPopDownAsDone = function(location, startDate) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var activeItems = prtgData.filter(function(item) {
            return item.location && 
                item.location.toUpperCase() === location.toUpperCase() &&
                item.startDate === startDate &&
                item.opt === 'POP_DOWN' && 
                item.status === 'active';
        });
        
        if (activeItems.length === 0) {
            showToast('⚠️ Tidak ada data POP_DOWN ACTIVE untuk "' + location + '" tanggal ' + startDate, 'error');
            return;
        }
        
        showToast('⏳ Mengirim request done...', 'info');
        
        fetch(API_URL + '?path=prtg/done-by-location-date-opt', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                location: location,
                startDate: startDate,
                opt: 'POP_DOWN'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('✅ ' + result.updated_count + ' data "' + location + '" marked as DONE!', 'success');
            } else {
                showToast(result.message || 'Gagal update data', 'error');
            }
        })
        .catch(function(err) {
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    };

    // DELETE POP DOWN GROUP (with date parameter)
    window.deletePopDownGroup = function(location, startDate) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var items = prtgData.filter(function(item) {
            return item.location && 
                item.location.toUpperCase() === location.toUpperCase() &&
                item.startDate === startDate &&
                item.opt === 'POP_DOWN';
        });
        
        if (items.length === 0) {
            showToast('⚠️ Data POP_DOWN tidak ditemukan!', 'error');
            return;
        }
        
        var totalItems = items.length;
        var activeItems = items.filter(function(item) { return item.status === 'active'; });
        var msg = totalItems > 1 ? 
            'Hapus ' + totalItems + ' data POP_DOWN untuk "' + location + '" tanggal ' + startDate + '?\n' +
            '(Active: ' + activeItems.length + ', Done: ' + (totalItems - activeItems.length) + ')' :
            'Hapus data POP_DOWN untuk "' + location + '" tanggal ' + startDate + '?';
        
        if (confirm(msg)) {
            showToast('⏳ Menghapus data...', 'info');
            
            fetch(API_URL + '?path=prtg/delete-by-location-date-opt', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    location: location,
                    startDate: startDate,
                    opt: 'POP_DOWN'
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    loadPRTGData();
                    showToast('✅ ' + result.deleted_count + ' data POP_DOWN dihapus!', 'success');
                } else {
                    showToast(result.message || 'Gagal hapus data', 'error');
                }
            })
            .catch(function(err) {
                showToast('⚠️ Gagal terhubung ke server', 'error');
            });
        }
    };


    window.deletePopUnmonitor = function(location) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var items = prtgData.filter(function(item) {
            return item.location && 
                item.location.toUpperCase() === location.toUpperCase() &&
                item.opt === 'POP_UNMONITOR';
        });
        
        if (items.length === 0) {
            showToast('⚠️ Data POP_UNMONITOR tidak ditemukan!', 'error');
            return;
        }
        
        var totalItems = items.length;
        var activeItems = items.filter(function(item) { return item.status === 'active'; });
        var msg = totalItems > 1 ? 
            'Hapus ' + totalItems + ' data POP_UNMONITOR untuk "' + location + '"?\n' +
            '(Active: ' + activeItems.length + ', Done: ' + (totalItems - activeItems.length) + ')' :
            'Hapus data POP_UNMONITOR untuk "' + location + '"?';
        
        if (confirm(msg)) {
            showToast('⏳ Menghapus data...', 'info');
            
            fetch(API_URL + '?path=prtg/delete-by-location-opt', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    location: location,
                    opt: 'POP_UNMONITOR'
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    loadPRTGData();
                    showToast('✅ ' + result.deleted_count + ' data POP_UNMONITOR dihapus!', 'success');
                } else {
                    showToast(result.message || 'Gagal hapus data', 'error');
                }
            })
            .catch(function(err) {
                // console.error('Error deleting POP_UNMONITOR:', err);
                showToast('⚠️ Gagal terhubung ke server', 'error');
            });
        }
    };

    window.markPopUnmonitorAsDone = function(location) {
        if (!location) {
            showToast('⚠️ Lokasi tidak valid!', 'error');
            return;
        }
        
        var activeItems = prtgData.filter(function(item) {
            return item.location && item.location.toUpperCase() === location.toUpperCase() &&
                item.opt === 'POP_UNMONITOR' && item.status === 'active';
        });
        
        if (activeItems.length === 0) {
            showToast('⚠️ Tidak ada data POP_UNMONITOR ACTIVE untuk "' + location + '"', 'error');
            return;
        }
        
        showToast('⏳ Mengirim request done...', 'info');
        
        fetch(API_URL + '?path=prtg/done-by-location-opt', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                location: location,
                opt: 'POP_UNMONITOR'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('✅ ' + result.updated_count + ' data "' + location + '" marked as DONE!', 'success');
            } else {
                showToast(result.message || 'Gagal update data', 'error');
            }
        })
        .catch(function(err) {
            // console.error('Error marking POP_UNMONITOR as done:', err);
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    };

    window.openPopUnmonitorModal = function() {
        var modal = document.getElementById('prtgPopUnmonitorModal');
        if (!modal) return;
        
        updatePopUnmonitorDisplay();
        modal.style.display = 'flex';
        
        var input = document.getElementById('popUnmonitorInput');
        if (input) {
            setTimeout(function() { input.focus(); }, 100);
        }
        
        modal.onclick = function(e) {
            if (e.target === modal) closePopUnmonitorModal();
        };
    };

    window.closePopUnmonitorModal = function() {
        var modal = document.getElementById('prtgPopUnmonitorModal');
        if (modal) modal.style.display = 'none';
    };

    function showPopUnmonitorNotification(message, isSuccess) {
        var notification = document.getElementById('popUnmonitorNotification');
        var messageEl = document.getElementById('popUnmonitorNotificationMessage');
        if (!notification || !messageEl) return;
        
        messageEl.textContent = message || (isSuccess ? 'Data POP UNMONITOR berhasil ditambahkan!' : 'Gagal menambahkan data POP UNMONITOR!');
        notification.style.display = 'block';
        notification.style.borderColor = isSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
        notification.style.background = isSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
        notification.style.color = isSuccess ? '#86efac' : '#fca5a5';
        
        setTimeout(function() {
            notification.style.display = 'none';
        }, 5000);
    }

    window.submitPopUnmonitor = function() {
        var input = document.getElementById('popUnmonitorInput');
        var errorDiv = document.getElementById('popUnmonitorError');
        var errorMessage = document.getElementById('popUnmonitorErrorMessage');
        
        if (!input) return;
        
        var text = input.value.trim();
        if (!text) {
            showToast('⚠️ Harap masukkan nama lokasi!', 'error');
            return;
        }
        
        var lines = text.split('\n').filter(function(line) { return line.trim() !== ''; });
        
        if (lines.length === 0) {
            showToast('⚠️ Harap masukkan nama lokasi!', 'error');
            return;
        }
        
        var hasActive = false;
        var activeLocations = [];
        lines.forEach(function(location) {
            location = location.trim();
            if (!location) return;
            
            var activeItem = prtgData.filter(function(item) {
                return item.location && 
                    item.location.toUpperCase() === location.toUpperCase() &&
                    item.opt === 'POP_UNMONITOR' && 
                    item.status === 'active';
            });
            
            if (activeItem.length > 0) {
                hasActive = true;
                activeLocations.push(location);
            }
        });
        
        if (hasActive) {
            if (errorDiv && errorMessage) {
                errorMessage.textContent = 'POP MASIH UNMONITOR: ' + activeLocations.join(', ');
                errorDiv.style.display = 'block';
                setTimeout(function() { errorDiv.style.display = 'none'; }, 5000);
            }
            if (errorDiv) {
                errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        
        var successCount = 0;
        var errorCount = 0;
        var duplicateCount = 0;
        var totalLines = lines.length;
        
        input.disabled = true;
        var submitBtn = document.querySelector('#prtgPopUnmonitorModal button[onclick="window.submitPopUnmonitor()"]');
        if (submitBtn) submitBtn.disabled = true;
        
        showToast('📤 Mengirim ' + totalLines + ' data...', 'info');
        
        var now = new Date();
        var dateStr = (now.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                    now.getDate().toString().padStart(2, '0') + '/' + 
                    now.getFullYear();
        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0') + ':' + 
                    now.getSeconds().toString().padStart(2, '0');
        var ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        
        var index = 0;
        
        function processNext() {
            if (index >= lines.length) {
                input.disabled = false;
                if (submitBtn) submitBtn.disabled = false;
                input.value = '';
                
                setTimeout(function() {
                    loadPRTGData();
                    setTimeout(function() {
                        updatePopUnmonitorDisplay();
                        // console.log('🔄 POP_UNMONITOR display updated!');
                        
                        if (successCount > 0) {
                            showPopUnmonitorNotification('✅ DATA DITAMBAHKAN', true);
                        } else if (duplicateCount > 0 && errorCount === 0) {
                            showPopUnmonitorNotification('⚠️ DATA SUDAH DITAMBAHKAN', false);
                        } else if (errorCount > 0 && successCount === 0) {
                            showPopUnmonitorNotification('❌ DATA GAGAL DITAMBAHKAN', false);
                        } else {
                            showPopUnmonitorNotification('✅ Selesai! ' + successCount + ' data POP_UNMONITOR ditambahkan.', true);
                        }
                    }, 100);
                }, 300);
                
                var message = '';
                if (successCount > 0) {
                    message = '✅ DATA DITAMBAHKAN';
                }
                if (duplicateCount > 0) {
                    message += (message ? ' ' : '') + '⚠️ ' + duplicateCount + ' data duplikat ACTIVE hari ini dilewati.';
                }
                if (errorCount > 0 && successCount === 0) {
                    message = '❌ Gagal menambahkan semua data!';
                } else if (errorCount > 0) {
                    message += ' ❌ ' + errorCount + ' data gagal.';
                }
                
                showToast(message || '✅ Selesai!', successCount > 0 ? 'success' : 'error');
                return;
            }
            
            var location = lines[index].trim();
            if (!location) {
                errorCount++;
                index++;
                processNext();
                return;
            }
            
            var existing = prtgData.filter(function(item) {
                return item.location && 
                    item.location.toUpperCase() === location.toUpperCase() &&
                    item.opt === 'POP_UNMONITOR' &&
                    item.status === 'active';
            });
            
            if (existing.length > 0) {
                duplicateCount++;
                index++;
                processNext();
                return;
            }
            
            fetch(API_URL + '?path=prtg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: location,
                    opt: 'POP_UNMONITOR',
                    vdc: '50 V',
                    startDate: dateStr,
                    startTime: timeStr,
                    ampm: ampm
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    successCount++;
                    prtgData.push(result.data);
                    // console.log('✅ Added POP_UNMONITOR:', location);
                } else {
                    if (result.duplicate) {
                        duplicateCount++;
                    } else {
                        errorCount++;
                    }
                }
                index++;
                processNext();
            })
            .catch(function(err) {
                // console.error('Error:', err);
                errorCount++;
                index++;
                processNext();
            });
        }
        
        processNext();
    };

    var popUnmonitorInput = document.getElementById('popUnmonitorInput');
    if (popUnmonitorInput) {
        popUnmonitorInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.submitPopUnmonitor();
            }
        });
    }

    // ================== EDIT VDC FUNCTIONS ==================
   // ==================== EDIT VDC FUNCTIONS ==================
window.editPRTGInline = function(index) {
    if (index < 0 || index >= prtgData.length) return;
    
    var item = prtgData[index];
    var currentLocation = item.location || '';
    
    var childData = prtgData.filter(function(d) {
        return d.location && 
               d.location.toUpperCase() === currentLocation.toUpperCase() &&
               d.opt === 'CHILD';
    });
    
    childData.sort(function(a, b) {
        return (a.id || 0) - (b.id || 0);
    });
    
    var lastChild = childData.length > 0 ? childData[childData.length - 1] : null;
    
    var displayDate, displayTime, displayAmPm, displayVdc;
    
    if (lastChild) {
        displayDate = lastChild.startDate || '';
        displayTime = lastChild.startTime || '';
        displayAmPm = lastChild.startAmPm || '';
        displayVdc = lastChild.vdc || '50 V';
    } else {
        displayDate = item.startDate || '';
        displayTime = item.startTime || '';
        displayAmPm = item.startAmPm || '';
        displayVdc = item.vdc || '50 V';
    }
    
    var currentTimeDisplay = displayTime + (displayAmPm ? ' ' + displayAmPm : '');
    var currentDateTimeDisplay = displayDate + ' ' + currentTimeDisplay + '   ' + displayVdc;
    
    var allDataForLocation = prtgData.filter(function(d) {
        return d.location && 
               d.location.toUpperCase() === currentLocation.toUpperCase() &&
               d.status === 'active';
    });
    
    var existingEntries = [];
    allDataForLocation.forEach(function(d) {
        var timeDisplay = d.startTime || '';
        if (d.startAmPm) timeDisplay += ' ' + d.startAmPm;
        existingEntries.push({
            id: d.id,
            date: d.startDate || '',
            time: timeDisplay,
            vdc: d.vdc || '50 V',
            opt: d.opt || 'PARENT',
            status: d.status || 'active'
        });
    });
    
    existingEntries.sort(function(a, b) {
        var aDate = parseDateTime(a.date, a.time);
        var bDate = parseDateTime(b.date, b.time);
        if (aDate && bDate) return aDate - bDate;
        if (aDate && !bDate) return -1;
        if (!aDate && bDate) return 1;
        return 0;
    });
    
    var entriesHtml = '';
    if (existingEntries.length === 0) {
        entriesHtml = '<div style="color: #94a3b8; font-size: 0.8rem; padding: 8px 0;">Tidak ada data ACTIVE untuk lokasi ini</div>';
    } else {
        existingEntries.forEach(function(entry, idx) {
            var isParent = entry.opt === 'PARENT';
            var isChild = entry.opt === 'CHILD';
            var label = isParent ? 'PARENT' : (isChild ? 'CHILD' : entry.opt);
            var labelColor = isParent ? '#3b82f6' : (isChild ? '#f59e0b' : '#94a3b8');
            
            var isLastChild = isChild && (idx === 0 || (idx > 0 && existingEntries[idx-1].opt !== 'CHILD'));
            var lastChildMarker = isLastChild ? ' ⭐' : '';
            
            // Hanya tampilkan tombol hapus untuk data CHILD
            var deleteButton = '';
            if (isChild) {
                deleteButton = `
                    <button onclick="window.deleteChildData(${entry.id}, '${escapeHtml(currentLocation)}', ${idx})" 
                            style="background: #ef4444; border: none; color: white; width: 32px; height: 32px; border-radius: 50%; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: all 0.2s; margin-left: 8px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);"
                            onmouseover="this.style.transform='scale(1.1)'; this.style.background='#dc2626'; this.style.boxShadow='0 4px 8px rgba(239, 68, 68, 0.4)';" 
                            onmouseout="this.style.transform='scale(1)'; this.style.background='#ef4444'; this.style.boxShadow='0 2px 4px rgba(239, 68, 68, 0.3)';"
                            title="Hapus data VDC">
                        <i class="fas fa-trash" style="font-size: 0.8rem;"></i>
                    </button>
                `;
            }

            entriesHtml += `
                <div style="display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #94a3b8; font-size: 0.75rem;">${idx + 1}.</span>
                    <span style="color: #e6eef8; font-size: 0.85rem; flex: 1;">
                        ${entry.date} ${entry.time}   ${entry.vdc}
                    </span>
                    ${deleteButton}
                </div>
            `;
        });
    }
    
    var modalHtml = `
    <div id="editModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
        <div style="background: #0b1424; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); position: relative;">
            <button onclick="closeEditModal()" style="position: absolute; top: 12px; right: 16px; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; transition: all 0.2s; z-index: 10;">
                <i class="fas fa-times"></i>
            </button>
            
            <h3 style="color: #e6eef8; margin-top: 0; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; padding-right: 30px;">
                <i class="fas fa-pencil-alt" style="color: #f59e0b;"></i>
                Manage VDC - ${escapeHtml(currentLocation)}
                ${lastChild ? '<span style="font-size: 0.7rem; color: #f59e0b; font-weight: normal;"></span>' : '<span style="font-size: 0.7rem; color: #3b82f6; font-weight: normal;">(belum ada CHILD)</span>'}
            </h3>
            
            <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 12px; margin-bottom: 20px; max-height: 250px; overflow-y: auto;">
                <div style="color: #94a3b8; font-size: 0.7rem; margin-bottom: 8px; font-weight: 600;">
                    <i class="fas fa-list"></i> Data ACTIVE:
                    <span style="color: #22c55e; font-size: 0.65rem; margin-left: 8px;">
                        (${existingEntries.length} entries)
                    </span>
                </div>
                ${entriesHtml}
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin-bottom: 16px;">
                <label style="color: #94a3b8; font-size: 0.8rem; display: block; margin-bottom: 8px;">
                    <i class="fas fa-plus-circle" style="color: #22c55e;"></i> Tambah Data Baru (akan menjadi CHILD):
                </label>
                <div style="display: flex; gap: 8px; flex-direction: column;">
                    <textarea id="editNewVDCInput" placeholder="${escapeHtml(currentDateTimeDisplay)}" rows="3" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #e6eef8; font-size: 0.9rem; font-family: inherit; resize: vertical; min-height: 60px; max-height: 120px; box-sizing: border-box;"></textarea>
                    <span style="font-size: 0.7rem; color: #94a3b8;">
                        <i class="fas fa-info-circle"></i> 
                        Format: MM/DD/YYYY HH:MM:SS AM/PM   VDC
                        <span style="display: block; margin-top: 4px; color: #f59e0b;">
                            <i class="fas fa-arrow-right"></i> Enter untuk submit, Shift+Enter untuk new line
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
    `;
    
    var oldModal = document.getElementById('editModal');
    if (oldModal) oldModal.remove();
    
    var modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    var textarea = document.getElementById('editNewVDCInput');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.saveNewVDC(index);
            }
        });
        setTimeout(function() {
            textarea.focus();
            textarea.select();
        }, 100);
    }
    
    var escHandler = function(e) {
        if (e.key === 'Escape') {
            closeEditModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
};

// Fungsi untuk menghapus data CHILD
window.deleteChildData = function(id, location, index) {
    if (!id) {
        showToast('⚠️ ID data tidak ditemukan!', 'error');
        return;
    }
    
    // Cari data di prtgData
    var itemToDelete = null;
    var itemIndex = -1;
    for (var i = 0; i < prtgData.length; i++) {
        if (prtgData[i].id === id) {
            itemToDelete = prtgData[i];
            itemIndex = i;
            break;
        }
    }
    
    if (!itemToDelete) {
        showToast('⚠️ Data tidak ditemukan!', 'error');
        return;
    }
    
    if (confirm('Hapus data VDC untuk "' + location + '"?')) {
        showToast('⏳ Menghapus data...', 'info');
        
        var deleteUrl = API_URL + '?path=prtg/' + id;
        // console.log('🗑️ DELETE URL:', deleteUrl);
        
        fetch(deleteUrl, {
            method: 'DELETE'
        })
        .then(function(res) { 
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json(); 
        })
        .then(function(result) {
            if (result.success) {
                // Hapus dari prtgData
                prtgData.splice(itemIndex, 1);
                showToast('✅ Data CHILD berhasil dihapus!', 'success');
                
                // Refresh modal dan table
                setTimeout(function() {
                    closeEditModal();
                    loadPRTGData();
                    // Buka ulang modal dengan data terbaru
                    var parentIndex = -1;
                    for (var j = 0; j < prtgData.length; j++) {
                        if (prtgData[j].location && 
                            prtgData[j].location.toUpperCase() === location.toUpperCase() &&
                            prtgData[j].opt === 'PARENT') {
                            parentIndex = j;
                            break;
                        }
                    }
                    if (parentIndex !== -1) {
                        setTimeout(function() {
                            window.editPRTGInline(parentIndex);
                        }, 300);
                    }
                }, 300);
            } else {
                showToast(result.message || 'Gagal hapus data', 'error');
            }
        })
        .catch(function(err) {
            // console.error('Error deleting child data:', err);
            showToast('⚠️ Gagal terhubung ke server: ' + err.message, 'error');
        });
    }
};

window.saveNewVDC = function(index) {
    var textarea = document.getElementById('editNewVDCInput');
    if (!textarea) {
        showToast('⚠️ Textarea tidak ditemukan!', 'error');
        return;
    }
    
    var text = textarea.value.trim();
    if (!text) {
        showToast('⚠️ Harap isi input VDC!', 'error');
        return;
    }
    
    function parseVDCInput(inputText) {
        if (!inputText || inputText.trim() === '') return null;
        
        var text = inputText.trim();
        var lines = text.split('\n').filter(function(line) { return line.trim() !== ''; });
        var line = lines.length > 0 ? lines[0] : text;
        
        var dateTimeRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}:\d{2})\s*(AM|PM)/i;
        var vdcRegex = /([\d.]+)\s*V/i;
        
        var extractedDate = '';
        var extractedTime = '';
        var extractedAmPm = '';
        var extractedVdc = '50 V';
        
        var vdcMatch = line.match(vdcRegex);
        if (vdcMatch) {
            extractedVdc = vdcMatch[1] + ' V';
            line = line.replace(vdcMatch[0], '').trim();
        }
        
        var match = line.match(dateTimeRegex);
        if (match) {
            extractedDate = match[1];
            extractedTime = match[2];
            extractedAmPm = match[3].toUpperCase();
        } else {
            var timeAmPmRegex = /(\d{1,2}:\d{2}:\d{2})\s*(AM|PM)/i;
            var timeMatch = line.match(timeAmPmRegex);
            if (timeMatch) {
                extractedTime = timeMatch[1];
                extractedAmPm = timeMatch[2].toUpperCase();
                line = line.replace(timeMatch[0], '').trim();
            }
            
            var dateRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})/;
            var dateMatch = line.match(dateRegex);
            if (dateMatch) {
                extractedDate = dateMatch[1];
            }
        }
        
        if (extractedDate) {
            var parts = extractedDate.split('/');
            if (parts.length === 3) {
                var month = parseInt(parts[0]);
                var day = parseInt(parts[1]);
                var year = parts[2];
                if (month > 12) {
                    extractedDate = String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0') + '/' + year;
                } else {
                    extractedDate = String(month).padStart(2, '0') + '/' + String(day).padStart(2, '0') + '/' + year;
                }
            }
        }
        
        if (!extractedDate || !extractedTime || !extractedAmPm) {
            return null;
        }
        
        return {
            date: extractedDate,
            time: extractedTime,
            ampm: extractedAmPm,
            vdc: extractedVdc
        };
    }
    
    var parsed = parseVDCInput(text);
    if (!parsed) {
        showToast('⚠️ Format tidak valid. Gunakan: MM/DD/YYYY HH:MM:SS AM/PM   VDC', 'error');
        return;
    }
    
    var item = prtgData[index];
    if (!item) {
        showToast('⚠️ Data tidak ditemukan!', 'error');
        return;
    }
    
    var location = item.location || '';
    
    showToast('⏳ Menambahkan VDC...', 'info');
    
    fetch(API_URL + '?path=prtg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            location: location,
            startDate: parsed.date,
            startTime: parsed.time,
            ampm: parsed.ampm,
            vdc: parsed.vdc || '50 V',
            opt: 'CHILD'
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.success) {
            closeEditModal();
            loadPRTGData();
            showToast('✅ DATA DITAMBAHKAN', 'success');
        } else {
            showToast(result.message || 'Gagal menambahkan data', 'error');
        }
    })
    .catch(function(err) {
        // console.error('Error adding VDC:', err);
        showToast('⚠️ Gagal terhubung ke server: ' + err.message, 'error');
    });
};

window.closeEditModal = function() {
    var modal = document.getElementById('editModal');
    if (modal) modal.remove();
};

    window.closeEditModal = function() {
        var modal = document.getElementById('editModal');
        if (modal) modal.remove();
    };

   // ================== WA REPORT FUNCTIONS ==================
    function generateWAReport() {
        var allData = prtgData;

        if (!allData || allData.length === 0) {
            return '⚠️ Tidak ada data untuk report.';
        }

        var today = new Date();
        var days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
        var months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 
                    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
        
        var dayName = days[today.getDay()];
        var day = today.getDate();
        var monthName = months[today.getMonth()];
        var year = today.getFullYear();
        
        var dateStr = day + ' ' + monthName + ' ' + year;
        
        var report = dayName + ', ' + dateStr + '\n\n';
        report += '> PLN OFF \n';
        report += '> STATUS BATTERY \n';
        
        var locationGroups = {};
        var parentStatusMap = {};
        var plnOffLocations = {};
        var testBatteryCount = 0;
        var popDownActiveCount = 0;
        var popDownDoneCount = 0;
        var popUnmonitorActiveCount = 0;
        var popUnmonitorDoneCount = 0;
        var viaGensetCount = 0;
        
        var unresolvedPlnOff = {};
        var locationsWithPausedParent = {};
        
        var locationKeys = [];
        allData.forEach(function(item) {
            var loc = item.location || 'Unknown';
            if (!locationGroups[loc]) {
                locationGroups[loc] = [];
                locationKeys.push(loc);
            }
            locationGroups[loc].push(item);
            
            if (item.opt === 'PARENT') {
                if (!parentStatusMap[loc]) {
                    parentStatusMap[loc] = {};
                }
                // Simpan status terbaru (ambil yang active jika ada)
                if (item.status === 'active') {
                    parentStatusMap[loc].status = item.status;
                    parentStatusMap[loc].startDate = item.startDate;
                    parentStatusMap[loc].startTime = item.startTime;
                    parentStatusMap[loc].startAmPm = item.startAmPm;
                    parentStatusMap[loc].vdc = item.vdc;
                } else if (!parentStatusMap[loc].status || parentStatusMap[loc].status !== 'active') {
                    parentStatusMap[loc].status = item.status;
                    parentStatusMap[loc].startDate = item.startDate;
                    parentStatusMap[loc].startTime = item.startTime;
                    parentStatusMap[loc].startAmPm = item.startAmPm;
                    parentStatusMap[loc].vdc = item.vdc;
                }
            }
        });
        
        // Cek paused parent
        for (var l = 0; l < locationKeys.length; l++) {
            var loc = locationKeys[l];
            var items = locationGroups[loc];
            var hasPausedParent = items.some(function(item) {
                return item.opt === 'PARENT' && item.status === 'paused';
            });
            if (hasPausedParent) {
                locationsWithPausedParent[loc] = true;
            }
        }
        
        var hasPlnOffDisplay = false;
        var plnOffData = {};
        
        // ===== PERBAIKAN: Hanya filter data ACTIVE =====
        for (var l2 = 0; l2 < locationKeys.length; l2++) {
            var loc = locationKeys[l2];
            
            // Skip lokasi dengan paused parent
            if (locationsWithPausedParent[loc]) continue;
            
            var items = locationGroups[loc];
            
            // ===== PERBAIKAN: Hanya ambil data dengan status ACTIVE =====
            var activeParent = items.filter(function(item) {
                return item.opt === 'PARENT' && item.status === 'active';
            });
            
            var activeChild = items.filter(function(item) {
                return item.opt === 'CHILD' && item.status === 'active';
            });
            
            // Hanya tampilkan jika ada PARENT active ATAU ada CHILD active
            if (activeParent.length === 0 && activeChild.length === 0) {
                continue;
            }
            
            // Gabungkan semua data ACTIVE (PARENT + CHILD)
            var activeItems = activeParent.concat(activeChild);
            
            // Urutkan berdasarkan waktu (ASCENDING - paling lama ke paling baru)
            activeItems.sort(function(a, b) {
                var aDate = parseDateTime(a.startDate, a.startTime + (a.startAmPm ? ' ' + a.startAmPm : ''));
                var bDate = parseDateTime(b.startDate, b.startTime + (b.startAmPm ? ' ' + b.startAmPm : ''));
                if (aDate && bDate) return aDate - bDate;
                if (aDate && !bDate) return -1;
                if (!aDate && bDate) return 1;
                return 0;
            });
            
            // Cek apakah dari hari kemarin
            var isFromYesterday = false;
            var daysDiff = 0;
            activeItems.forEach(function(item) {
                if (item.startDate) {
                    var diff = getDaysDifference(item.startDate);
                    if (diff > 0) {
                        daysDiff = Math.max(daysDiff, diff);
                        isFromYesterday = true;
                    }
                }
            });
            
            // Simpan data
            if (isFromYesterday) {
                if (!unresolvedPlnOff[loc]) {
                    unresolvedPlnOff[loc] = { activeItems: [], daysDiff: 0 };
                }
                activeItems.forEach(function(item) {
                    unresolvedPlnOff[loc].activeItems.push(item);
                });
                unresolvedPlnOff[loc].daysDiff = Math.max(unresolvedPlnOff[loc].daysDiff, daysDiff);
            } else {
                plnOffData[loc] = { 
                    activeItems: activeItems, 
                    isYesterday: false, 
                    daysDiff: 0 
                };
            }
            
            plnOffLocations[loc] = true;
        }
        
        // Tampilkan unresolved (dari hari kemarin)
        var unresolvedKeys = Object.keys(unresolvedPlnOff);
        if (unresolvedKeys.length > 0) {
            unresolvedKeys.sort().forEach(function(loc) {
                var data = unresolvedPlnOff[loc];
                var daysText = data.daysDiff > 0 ? ' > ' + data.daysDiff + ' hari' : '';
                report += '⚠️ ' + loc + daysText + '\n';
                data.activeItems.forEach(function(item) {
                    var startTime = item.startTime || '';
                    var startAmPm = item.startAmPm || '';
                    var startDisplay = startTime;
                    if (startAmPm) startDisplay += ' ' + startAmPm;
                    var startDate = item.startDate || 'N/A';
                    var vdc = item.vdc || '50 V';
                    // HAPUS LABEL [CHILD] - Tampilkan tanpa label
                    report += '  ' + startDate + ' ' + startDisplay + '   ' + vdc + '\n';
                });
            });
            report += '\n';
            hasPlnOffDisplay = true;
        }
        
        // Tampilkan data hari ini
        var plnOffKeys = Object.keys(plnOffData);
        var todayOnlyKeys = plnOffKeys.filter(function(key) {
            return !unresolvedPlnOff[key];
        });
        
        if (todayOnlyKeys.length > 0) {
            todayOnlyKeys.sort().forEach(function(loc) {
                var data = plnOffData[loc];
                if (!hasPlnOffDisplay) hasPlnOffDisplay = true;
                
                report += loc + '\n';
                data.activeItems.forEach(function(item) {
                    var startTime = item.startTime || '';
                    var startAmPm = item.startAmPm || '';
                    var startDisplay = startTime;
                    if (startAmPm) startDisplay += ' ' + startAmPm;
                    var startDate = item.startDate || 'N/A';
                    var vdc = item.vdc || '50 V';
                    // HAPUS LABEL [CHILD] - Tampilkan tanpa label
                    report += startDate + ' ' + startDisplay + '   ' + vdc + '\n';
                });
                report += '\n';
            });
        }
        
        if (!hasPlnOffDisplay) {
            report += '✅ ALARM CLEAR\n';
            report += '\n';
        }
        
        // ===== UP BY GENSET =====
        var pausedLocations = Object.keys(locationsWithPausedParent);
        if (pausedLocations.length > 0) {
            report += '> UP BY GENSET\n';
            viaGensetCount = pausedLocations.length;
            pausedLocations.sort();
            pausedLocations.forEach(function(loc) {
                report += loc + '\n';
            });
            report += '\n';
        }
                
        // ===== TEST BATTERY - Tampilkan hanya ACTIVE =====
        var hasTestBatteryDisplay = false;
        var testBatteryLocationsList = [];
        var unresolvedTestBatteryLocations = [];
        
        for (var loc3 in locationGroups) {
            var testBatteryItems = locationGroups[loc3].filter(function(item) {
                return item.opt === 'TEST_BATTERY' && item.status === 'active'; // Hanya ACTIVE
            });
            
            if (testBatteryItems.length > 0) {
                var activeCount = testBatteryItems.length;
                var isFromYesterday = false;
                var daysDiff = 0;
                
                testBatteryItems.forEach(function(item) {
                    testBatteryCount++;
                    if (item.startDate) {
                        var diff = getDaysDifference(item.startDate);
                        if (diff > 0) {
                            daysDiff = Math.max(daysDiff, diff);
                            isFromYesterday = true;
                        }
                    }
                });
                
                if (activeCount > 0) {
                    if (isFromYesterday) {
                        unresolvedTestBatteryLocations.push({
                            loc: loc3,
                            activeCount: activeCount,
                            total: testBatteryItems.length,
                            daysDiff: daysDiff
                        });
                    } else {
                        testBatteryLocationsList.push({
                            loc: loc3,
                            activeCount: activeCount,
                            total: testBatteryItems.length
                        });
                    }
                }
            }
        }
        
        // Tampilkan TEST BATTERY hanya jika ada data aktif
        if (testBatteryCount > 0) {
            report += '> TEST BATTERY\n';
            
            if (unresolvedTestBatteryLocations.length > 0) {
                unresolvedTestBatteryLocations.sort(function(a, b) { return a.loc.localeCompare(b.loc); });
                unresolvedTestBatteryLocations.forEach(function(data) {
                    var displayLoc = data.total > 1 ? data.loc + ' (' + data.total + 'X)' : data.loc;
                    var daysText = data.daysDiff > 0 ? ' > ' + data.daysDiff + ' hari' : '';
                    report += '⚠️ ' + displayLoc + daysText + ' \n';
                });
                report += '\n';
            }
            
            if (testBatteryLocationsList.length > 0) {
                testBatteryLocationsList.sort(function(a, b) { return a.loc.localeCompare(b.loc); });
                testBatteryLocationsList.forEach(function(data) {
                    var displayLoc = data.total > 1 ? data.loc + ' (' + data.total + 'X)' : data.loc;
                    report += displayLoc + ' ❌\n';
                });
                report += '\n';
            }
        }
        
        // ===== POP DOWN - Tampilkan hanya ACTIVE =====
        var popDownLocations = [];
        var unresolvedPopDownLocations = [];
        popDownActiveCount = 0;
        
        for (var loc4 in locationGroups) {
            var popDownItems = locationGroups[loc4].filter(function(item) {
                return item.opt === 'POP_DOWN' && item.status === 'active'; // Hanya ACTIVE
            });
            
            if (popDownItems.length > 0) {
                var activeCount = popDownItems.length;
                var isFromYesterday = false;
                var daysDiff = 0;
                
                popDownItems.forEach(function(item) {
                    popDownActiveCount++;
                    if (item.startDate) {
                        var diff = getDaysDifference(item.startDate);
                        if (diff > 0) {
                            daysDiff = Math.max(daysDiff, diff);
                            isFromYesterday = true;
                        }
                    }
                });
                
                if (activeCount > 0) {
                    if (isFromYesterday) {
                        unresolvedPopDownLocations.push({
                            loc: loc4,
                            activeCount: activeCount,
                            total: popDownItems.length,
                            daysDiff: daysDiff
                        });
                    } else {
                        popDownLocations.push({
                            loc: loc4,
                            activeCount: activeCount,
                            total: popDownItems.length
                        });
                    }
                }
            }
        }
        
        if (popDownActiveCount > 0) {
            report += '> POP DOWN \n';
            
            if (unresolvedPopDownLocations.length > 0) {
                unresolvedPopDownLocations.sort(function(a, b) { return a.loc.localeCompare(b.loc); });
                unresolvedPopDownLocations.forEach(function(data) {
                    var displayLoc = data.total > 1 ? data.loc + ' (' + data.total + 'X)' : data.loc;
                    var daysText = data.daysDiff > 0 ? ' > ' + data.daysDiff + ' hari' : '';
                    report += '⚠️ ' + displayLoc + daysText + ' \n';
                });
                report += '\n';
            }
            
            if (popDownLocations.length > 0) {
                popDownLocations.sort(function(a, b) { return a.loc.localeCompare(b.loc); });
                popDownLocations.forEach(function(data) {
                    var displayLoc = data.total > 1 ? data.loc + ' (' + data.total + 'X)' : data.loc;
                    report += displayLoc + ' ❌\n';
                });
                report += '\n';
            }
        }
        
        // ===== POP UNMONITOR - Tampilkan hanya ACTIVE =====
        var popUnmonitorLocations = [];
        var unresolvedPopUnmonitorLocations = [];
        popUnmonitorActiveCount = 0;
        
        for (var loc5 in locationGroups) {
            var popUnmonitorItems = locationGroups[loc5].filter(function(item) {
                return item.opt === 'POP_UNMONITOR' && item.status === 'active'; // Hanya ACTIVE
            });
            
            if (popUnmonitorItems.length > 0) {
                var activeCount = popUnmonitorItems.length;
                var isFromYesterday = false;
                var daysDiff = 0;
                
                popUnmonitorItems.forEach(function(item) {
                    popUnmonitorActiveCount++;
                    if (item.startDate) {
                        var diff = getDaysDifference(item.startDate);
                        if (diff > 0) {
                            daysDiff = Math.max(daysDiff, diff);
                            isFromYesterday = true;
                        }
                    }
                });
                
                if (activeCount > 0) {
                    if (isFromYesterday) {
                        unresolvedPopUnmonitorLocations.push({
                            loc: loc5,
                            activeCount: activeCount,
                            total: popUnmonitorItems.length,
                            daysDiff: daysDiff
                        });
                    } else {
                        popUnmonitorLocations.push({
                            loc: loc5,
                            activeCount: activeCount,
                            total: popUnmonitorItems.length
                        });
                    }
                }
            }
        }
        
        if (popUnmonitorActiveCount > 0) {
            report += '> POP UNMONITOR\n';
            
            if (unresolvedPopUnmonitorLocations.length > 0) {
                unresolvedPopUnmonitorLocations.sort(function(a, b) { return a.loc.localeCompare(b.loc); });
                unresolvedPopUnmonitorLocations.forEach(function(data) {
                    var displayLoc = data.total > 1 ? data.loc + ' (' + data.total + 'X)' : data.loc;
                    var daysText = data.daysDiff > 0 ? ' > ' + data.daysDiff + ' hari' : '';
                    report += '⚠️ ' + displayLoc + daysText + ' \n';
                });
                report += '\n';
            }
            
            if (popUnmonitorLocations.length > 0) {
                popUnmonitorLocations.sort(function(a, b) { return a.loc.localeCompare(b.loc); });
                popUnmonitorLocations.forEach(function(data) {
                    var displayLoc = data.total > 1 ? data.loc + ' (' + data.total + 'X)' : data.loc;
                    report += displayLoc + ' ❌\n';
                });
                report += '\n';
            }
        }
        
        // ===== SUMMARY =====
        // Hitung ulang jumlah PLN OFF yang sebenarnya (hanya yang ACTIVE)
        var plnOffCount = 0;
        var activeLocations = {};
        for (var locKey in plnOffLocations) {
            // Cek apakah masih ada data ACTIVE untuk lokasi ini
            var hasActive = locationGroups[locKey].some(function(item) {
                return (item.opt === 'PARENT' || item.opt === 'CHILD') && item.status === 'active';
            });
            if (hasActive) {
                plnOffCount++;
                activeLocations[locKey] = true;
            }
        }
        
        report += 'SUMMARY\n';
        report += 'PLN OFF : ' + plnOffCount + '\n';
        report += 'TEST BATTERY : ' + testBatteryCount + '\n';
        report += 'POP DOWN : ' + popDownActiveCount + '\n';
        report += 'POP UNMONITOR : ' + popUnmonitorActiveCount + '\n';
        
        return report;
    }

    window.openWAModal = function() {
        var modal = document.getElementById('prtgWAModal');
        var content = document.getElementById('prtgWAReportContent');
        if (!modal || !content) return;
        
        var report = generateWAReport();
        content.textContent = report;
        modal.style.display = 'flex';
        
        modal.onclick = function(e) {
            if (e.target === modal) closeWAModal();
        };

        if (window._waModalKeydownHandler) {
            document.removeEventListener('keydown', window._waModalKeydownHandler);
        }
        
        window._waModalKeydownHandler = function(e) {
            var modal = document.getElementById('prtgWAModal');
            if (!modal || modal.style.display !== 'flex') return;
            
            if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
                var activeElement = document.activeElement;
                var isInsideModal = modal.contains(activeElement);
                if (isInsideModal || !activeElement || activeElement.tagName === 'BODY') {
                    e.preventDefault();
                    var content = document.getElementById('prtgWAReportContent');
                    if (content) {
                        var range = document.createRange();
                        range.selectNodeContents(content);
                        var selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        };
        document.addEventListener('keydown', window._waModalKeydownHandler);
    };

    window.closeWAModal = function() {
        var modal = document.getElementById('prtgWAModal');
        if (modal) modal.style.display = 'none';
        if (window._waModalKeydownHandler) {
            document.removeEventListener('keydown', window._waModalKeydownHandler);
            window._waModalKeydownHandler = null;
        }
    };

    window.copyWAReport = function(button) {
        var content = document.getElementById('prtgWAReportContent');
        if (!content) return;
        
        // Efek animasi tombol
        if (button) {
            button.style.transform = 'scale(0.95)';
            button.style.transition = 'transform 0.15s ease';
            setTimeout(function() { 
                button.style.transform = 'scale(1)'; 
            }, 150);
        }
        
        var text = content.textContent;
        
        // Metode 1: Coba dengan Clipboard API (modern)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(function() {
                    showToast('✅ Report copied to clipboard!', 'success');
                })
                .catch(function(err) {
                    // console.warn('Clipboard API failed, using fallback:', err);
                    fallbackCopy(text);
                });
        } else {
            // Fallback untuk browser lama
            fallbackCopy(text);
        }
    };

    // Fungsi fallback untuk copy
    function fallbackCopy(text) {
        // Buat textarea temporary
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.width = '1px';
        textarea.style.height = '1px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        // Pilih text
        textarea.focus();
        textarea.select();
        
        try {
            // Coba execCommand
            var success = document.execCommand('copy');
            if (success) {
                showToast('✅ Report copied to clipboard!', 'success');
            } else {
                // Jika execCommand gagal, coba manual selection
                var range = document.createRange();
                var content = document.getElementById('prtgWAReportContent');
                if (content) {
                    range.selectNodeContents(content);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    try {
                        document.execCommand('copy');
                        showToast('✅ Report copied!', 'success');
                    } catch (e) {
                        showToast('⚠️ Please copy manually (Ctrl+C)', 'error');
                    }
                    window.getSelection().removeAllRanges();
                }
            }
        } catch (err) {
            // console.error('Copy failed:', err);
            // Jika semua gagal, seleksi manual
            var content2 = document.getElementById('prtgWAReportContent');
            if (content2) {
                var range = document.createRange();
                range.selectNodeContents(content2);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                showToast('📋 Select text and press Ctrl+C', 'info');
            }
        }
        
        // Hapus textarea temporary
        document.body.removeChild(textarea);
    }

    // Tambahkan juga event listener untuk Ctrl+A di modal WA
    window.openWAModal = function() {
        var modal = document.getElementById('prtgWAModal');
        var content = document.getElementById('prtgWAReportContent');
        if (!modal || !content) return;
        
        var report = generateWAReport();
        content.textContent = report;
        modal.style.display = 'flex';
        
        modal.onclick = function(e) {
            if (e.target === modal) closeWAModal();
        };

        // Hapus handler lama jika ada
        if (window._waModalKeydownHandler) {
            document.removeEventListener('keydown', window._waModalKeydownHandler);
        }
        
        // Handler untuk Ctrl+A
        window._waModalKeydownHandler = function(e) {
            var modal = document.getElementById('prtgWAModal');
            if (!modal || modal.style.display !== 'flex') return;
            
            // Jika Ctrl+A ditekan
            if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
                var activeElement = document.activeElement;
                var isInsideModal = modal.contains(activeElement);
                // Cegah jika di dalam textarea/input yang editable
                var isEditable = activeElement && (
                    activeElement.tagName === 'INPUT' || 
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.isContentEditable
                );
                
                if ((isInsideModal || !activeElement || activeElement.tagName === 'BODY') && !isEditable) {
                    e.preventDefault();
                    var content = document.getElementById('prtgWAReportContent');
                    if (content) {
                        var range = document.createRange();
                        range.selectNodeContents(content);
                        var selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        };
        document.addEventListener('keydown', window._waModalKeydownHandler);
    };

    // ================== FUNGSI ADD PRTG DENGAN PARSER ==================
    function addPRTGWithParser() {
        var text = smartInput ? smartInput.value : '';
        
        if (!text || text.trim() === '') {
            showToast('Harap isi input teks!', 'error');
            if (smartInput) smartInput.focus();
            return;
        }

        var parsedResults = smartParseInput(text);
        
        if (!parsedResults || parsedResults.length === 0) {
            showToast('⚠️ Tidak ada data yang valid!', 'error');
            return;
        }

        var total = parsedResults.length;
        var successCount = 0;
        var errorCount = 0;
        var duplicateCount = 0;

        smartInput.disabled = true;
        showToast('📤 Memproses ' + total + ' data...', 'info');

        var index = 0;
        
        function processNext() {
            if (index >= parsedResults.length) {
                smartInput.disabled = false;
                smartInput.value = '';
                
                // console.log('📊 Selesai memproses ' + total + ' data. Success: ' + successCount + ', Errors: ' + errorCount + ', Duplicates: ' + duplicateCount);
                
                setTimeout(function() {
                    loadPRTGData();
                    // console.log('🔄 Data refreshed!');
                }, 300);
                
                var message = '';
                if (successCount > 0) {
                    message = '✅ DATA DITAMBAHKAN';
                }
                if (duplicateCount > 0) {
                    message += (message ? ' ' : '') + '⚠️ ' + duplicateCount + ' data duplikat dilewati.';
                }
                if (errorCount > 0 && successCount === 0) {
                    message = '❌ DATA SUDAH DITAMBAHKAN';
                } else if (errorCount > 0) {
                    message += ' ❌ ' + errorCount + ' data gagal.';
                }
                
                showToast(message || '✅ Selesai!', successCount > 0 ? 'success' : 'error');
                smartInput.focus();
                return;
            }

            var data = parsedResults[index];
            var location = data.location;
            
            var isDuplicate = false;
            for (var i = 0; i < prtgData.length; i++) {
                var item = prtgData[i];
                if (item.location && 
                    item.location.toUpperCase() === location.toUpperCase() &&
                    item.status === 'active' &&
                    item.opt !== 'TEST_BATTERY' && 
                    item.opt !== 'POP_DOWN' && 
                    item.opt !== 'POP_UNMONITOR') {
                    isDuplicate = true;
                    break;
                }
            }

            if (isDuplicate) {
                duplicateCount++;
                index++;
                processNext();
                return;
            }

            fetch(API_URL + '?path=prtg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: location,
                    startDate: data.date,
                    startTime: data.time,
                    ampm: data.ampm,
                    vdc: data.vdc || '50 V',
                    opt: 'PARENT'
                })
            })
            .then(function(res) { 
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json(); 
            })
            .then(function(result) {
                // console.log('POST result for ' + location + ':', result);
                
                if (result.success) {
                    successCount++;
                    prtgData.push(result.data);
                    // console.log('✅ Added:', location);
                } else {
                    errorCount++;
                    if (result.duplicate) duplicateCount++;
                    // console.warn('❌ Failed:', location, result.message);
                }
                index++;
                processNext();
            })
            .catch(function(err) {
                // console.error('❌ Error:', err);
                errorCount++;
                index++;
                processNext();
            });
        }

        processNext();
    }

    // Enter untuk submit, Shift+Enter untuk new line
    if (smartInput) {
        smartInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addPRTGWithParser();
            }
        });
    }
    
    window.markPRTGAsDoneInline = function(index) {
        if (index < 0 || index >= prtgData.length) return;
        
        var item = prtgData[index];
        var location = item.location;
        
        if (item.opt && item.opt.toUpperCase() !== 'PARENT') {
            showToast('⚠️ Data CHILD tidak bisa di-update', 'error');
            return;
        }
        
        var activeCount = 0;
        for (var i = 0; i < prtgData.length; i++) {
            if (prtgData[i].location && 
                prtgData[i].location.toUpperCase() === location.toUpperCase() &&
                (prtgData[i].status === 'active' || prtgData[i].status === 'paused')) {
                activeCount++;
            }
        }
        
        // if (activeCount > 1) {
        //     if (!confirm(`YANG BONENG KAMU??`)) {
        //         return;
        //     }
        // }

        showToast('⏳ Mengirim request done...', 'info');
        
        fetch(API_URL + '?path=prtg/done-by-location', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: location })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast(result.message, 'success');
            } else {
                showToast(result.message || 'Gagal update data', 'error');
            }
        })
        .catch(function(err) {
            // console.error('Error updating PRTG data:', err);
            showToast('⚠️ Gagal terhubung ke server', 'error');
        });
    };
    
    window.deletePRTGInline = function(index) {
        if (index < 0 || index >= prtgData.length) return;
        
        var item = prtgData[index];
        var location = item.location;
        var id = item.id;
        
        if (!id) {
            showToast('⚠️ ID data tidak ditemukan!', 'error');
            return;
        }
        
        if (confirm('Hapus data untuk "' + location + '"?')) {
            showToast('⏳ Menghapus data...', 'info');
            
            var deleteUrl = API_URL + '?path=prtg/' + id;
            // console.log('🗑️ DELETE URL:', deleteUrl);
            
            fetch(deleteUrl, {
                method: 'DELETE'
            })
            .then(function(res) { 
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json(); 
            })
            .then(function(result) {
                if (result.success) {
                    loadPRTGData();
                    showToast(result.message, 'info');
                } else {
                    showToast(result.message || 'Gagal hapus data', 'error');
                }
            })
            .catch(function(err) {
                // console.error('Error deleting PRTG data:', err);
                showToast('⚠️ Gagal terhubung ke server: ' + err.message, 'error');
            });
        }
    };


    // ================== REOPEN FUNCTIONS ==================
    window.reopenPRTGInline = function(index) {
        if (index < 0 || index >= prtgData.length) return;
        
        var item = prtgData[index];
        var location = item.location;
        
        if (item.opt && item.opt.toUpperCase() !== 'PARENT') {
            showToast('⚠️ Data CHILD tidak bisa di-reopen', 'error');
            return;
        }
        
        if (item.status !== 'done') {
            showToast('ℹ️ Data harus berstatus DONE untuk di-reopen', 'info');
            return;
        }
        
        // Cek apakah ada PARENT active dengan lokasi yang sama
        var hasActiveParent = false;
        for (var i = 0; i < prtgData.length; i++) {
            if (prtgData[i].location && 
                prtgData[i].location.toUpperCase() === location.toUpperCase() &&
                prtgData[i].opt && prtgData[i].opt.toUpperCase() === 'PARENT' &&
                prtgData[i].status === 'active') {
                hasActiveParent = true;
                break;
            }
        }
        
        if (hasActiveParent) {
            if (!confirm('⚠️ "' + location + '" masih ada data ACTIVE. Lanjutkan reopen?')) {
                return;
            }
        }
        
        showToast('⏳ Mengirim request reopen...', 'info');
        
        fetch(API_URL + '?path=prtg/reopen-by-location', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: location })
        })
        .then(function(res) { 
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json(); 
        })
        .then(function(result) {
            if (result.success) {
                loadPRTGData();
                showToast('🔄 ' + result.message, 'success');
            } else {
                showToast(result.message || 'Gagal reopen data', 'error');
            }
        })
        .catch(function(err) {
            showToast('⚠️ Gagal terhubung ke server: ' + err.message, 'error');
        });
    };
    
    // ===== EVENT LISTENERS =====
    if (testBatteryBtn) {
        testBatteryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.openTestBatteryModal();
        });
    }
    
    if (popDownBtn) {
        popDownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.openPopDownModal();
        });
    }
    
    if (popUnmonitorBtn) {
        popUnmonitorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.openPopUnmonitorModal();
        });
    }
    
    if (waBtn) {
        waBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.openWAModal();
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadCSV();
        });
    }
    
    loadPRTGData();
}

// ==================== SIDEBAR LOADER ====================
const originalLoadContent = window.loadContent;
if (typeof originalLoadContent === 'function') {
    window.loadContent = function(target) {
        if (target === 'prtg') {
            initializePrtg();
        } else {
            originalLoadContent(target);
        }
    };
}

// Init langsung jika PRTG aktif
document.addEventListener('DOMContentLoaded', function() {
    const activeBtn = document.querySelector('.nav-list button.active[data-target="prtg"]');
    if (activeBtn) {
        initializePrtg();
    }
});
