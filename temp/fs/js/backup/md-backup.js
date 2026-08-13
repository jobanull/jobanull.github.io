
document.addEventListener('DOMContentLoaded', function() {
    // Simpan referensi fungsi asli
    const originalRenderContent = window.renderContent;
    
    // Override fungsi render konten
    window.renderContent = function(target) {
        if (target === 'md' || target === 'master-device') {
            // Tampilkan overlay, bukan di content utama
            showMasterOverlay();
        } else {
            if (typeof originalRenderContent === 'function') {
                originalRenderContent(target);
            } else {
                const contentEl = document.getElementById('content');
                if (contentEl) {
                    contentEl.innerHTML = `<h2>${target}</h2><p>Konten untuk "${target}" sedang dalam pengembangan.</p>`;
                }
            }
        }
    };
    
    // ----- OVERLAY MASTER DEVICE -----
    const overlay = document.getElementById('masterOverlay');
    const overlayClose = document.getElementById('masterOverlayClose');
    const overlayBody = document.getElementById('masterOverlayBody');

    function showMasterOverlay() {
        if (!overlay) return;
        // Render CSV Reader di dalam overlay
        renderCSVReaderInsideOverlay();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scroll
    }

    function hideMasterOverlay() {
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close overlay via tombol close
    if (overlayClose) {
        overlayClose.addEventListener('click', hideMasterOverlay);
    }

    // Close overlay jika klik di luar konten (background)
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hideMasterOverlay();
            }
        });
    }

    // Close overlay dengan tombol ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
            hideMasterOverlay();
        }
    });

    // Fungsi render CSV Reader di dalam overlay
    function renderCSVReaderInsideOverlay() {
        if (!overlayBody) return;

        overlayBody.innerHTML = `
            <div class="csv-reader-wrapper" id="masterCsvWrapper">
                <div class="toolbar">
                    <div class="upload-area" style="display: none;"></div>
                    <div class="search-filter-area">
                        <div class="search-box">
                            <span>🔍</span>
                            <input type="text" id="masterSearchInput" placeholder="Search ...">
                        </div>
                        <div class="filter-group">
                            <label>Filter:</label>
                            <select id="masterColumnSelect"></select>
                        </div>
                        <button class="reset-btn" id="masterResetBtn">⟳ Reset</button>
                    </div>
                </div>

                <div class="stats">
                    <span>📊 Rows: <span id="masterRowCount">0</span> / <span id="masterTotalRows">0</span></span>
                    <span>📁 Source: <span id="masterSourceStatus">⏳ Loading ...</span></span>
                </div>

                <div id="masterWarningBanner" class="warning-banner" style="display: none;">
                    ⚠️ <strong>Warning</strong> 
                </div>

                <div class="table-wrapper" id="masterTableWrapper">
                    <table id="masterCsvTable">
                        <thead id="masterTableHeader">
                            <tr><th colspan="7">⏳ Loading ...</th></tr>
                        </thead>
                        <tbody id="masterTableBody">
                            <tr><td colspan="7" class="loading-indicator">
                                <i class="fas fa-spinner fa-spin"></i> Loading Data ...
                            </td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Inisialisasi CSV Reader untuk overlay
        initMasterCSVReader();
    }



function openSSH(host, username = SSH_USERNAME, password = SSH_PASSWORD) {
    if (!host) {
        alert('IP Address tidak valid');
        return;
    }

        console.log('Opening SSH to:', host);
        console.log('Username:', username);
        console.log('Password:', password);

        // Kirim request ke Flask backend
        fetch(`http://127.0.0.1:5000/ssh?host=${host}&user=${encodeURIComponent(username)}&pass=${encodeURIComponent(password)}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.text();
            })
            .then(data => {
                console.log('Response from server:', data);
                // Optional: show success message
                showNotification(`Opening connection to ${host}...`, 'success');
            })
            .catch(err => {
                console.error('Error opening SSH:', err);
                showNotification(`Failed to open SSH connection to ${host}`, 'error');
            });
    }

    // Fungsi show notification sederhana
    function showNotification(message, type = 'info') {
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#34d399' : '#f87171'};
            color: white;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        notif.textContent = message;
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // Tambahkan CSS untuk animasi notification
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    // Fungsi inisialisasi CSV Reader khusus overlay
    function initMasterCSVReader() {
        let rawData = [];
        let columns = [];
        let filteredData = [];

        const searchInput = document.getElementById('masterSearchInput');
        const columnSelect = document.getElementById('masterColumnSelect');
        const resetBtn = document.getElementById('masterResetBtn');
        const tableHeader = document.getElementById('masterTableHeader');
        const tableBody = document.getElementById('masterTableBody');
        const rowCountSpan = document.getElementById('masterRowCount');
        const totalRowsSpan = document.getElementById('masterTotalRows');
        const sourceStatusSpan = document.getElementById('masterSourceStatus');
        const warningBanner = document.getElementById('masterWarningBanner');
        const tableWrapper = document.getElementById('masterTableWrapper');

        const hiddenColumns = ['type'];

        function parseCSVToArray(csvText) {
            const rows = [];
            const lines = csvText.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                if (line === "") continue;
                const parsedRow = [];
                let inQuote = false;
                let current = '';
                for (let j = 0; j < line.length; j++) {
                    const ch = line[j];
                    if (ch === '"') {
                        if (inQuote && line[j+1] === '"') {
                            current += '"';
                            j++;
                        } else {
                            inQuote = !inQuote;
                        }
                    } else if (ch === ',' && !inQuote) {
                        parsedRow.push(current.trim());
                        current = '';
                    } else {
                        current += ch;
                    }
                }
                parsedRow.push(current.trim());
                for (let k = 0; k < parsedRow.length; k++) {
                    let val = parsedRow[k];
                    if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
                        val = val.substring(1, val.length-1);
                        val = val.replace(/""/g, '"');
                        parsedRow[k] = val;
                    }
                }
                rows.push(parsedRow);
            }
            return rows;
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }

        // Fungsi untuk mengecek apakah sebuah kolom adalah Addresses
        function isAddressesColumn(colName) {
            return colName.toLowerCase() === 'addresses';
        }

        function renderTable() {
            if (columns.length === 0) {
                tableHeader.innerHTML = `<tr><th colspan="7">Tidak ada kolom</th></tr>`;
                tableBody.innerHTML = `<tr><td colspan="7" class="empty-message">📂 Upload file CSV terlebih dahulu</td></tr>`;
                rowCountSpan.innerText = '0';
                totalRowsSpan.innerText = '0';
                return;
            }

            const displayColumns = columns.filter(col => {
                const colLower = col.toLowerCase();
                return !hiddenColumns.includes(colLower);
            });

            let headerHtml = `<tr>`;
            displayColumns.forEach(col => {
                headerHtml += `<th>${escapeHtml(col)}</th>`;
            });
            headerHtml += `</tr>`;
            tableHeader.innerHTML = headerHtml;

            if (!filteredData.length) {
                tableBody.innerHTML = `<tr><td colspan="${displayColumns.length}" class="empty-message">🔎 Tidak ada data yang cocok</td></tr>`;
                rowCountSpan.innerText = '0';
                totalRowsSpan.innerText = rawData.length;
                return;
            }

            let bodyHtml = '';
            for (let row of filteredData) {
                bodyHtml += `<tr>`;
                for (let col of displayColumns) {
                    let cellValue = row[col] !== undefined && row[col] !== null ? row[col] : '';
                    
                    // Cek apakah ini kolom Addresses
                    if (isAddressesColumn(col) && cellValue) {
                        // Escape HTML untuk nilai
                        const escapedValue = escapeHtml(cellValue);
                        // Buat hyperlink dengan data attribute
                        bodyHtml += `<td><a href="#" class="address-link" data-address="${escapedValue}">${escapedValue}</a></td>`;
                    } else {
                        bodyHtml += `<td>${escapeHtml(cellValue) || '—'}</td>`;
                    }
                }
                bodyHtml += `</tr>`;
            }
            tableBody.innerHTML = bodyHtml;
            rowCountSpan.innerText = filteredData.length;
            totalRowsSpan.innerText = rawData.length;

            // Tambahkan event listener untuk semua link address
            document.querySelectorAll('.address-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault(); // Mencegah navigasi
                    const addressValue = this.getAttribute('data-address');
                    console.log('Address clicked:', addressValue);
                    
                    // Panggil fungsi untuk membuka SSH
                    // Username dan password bisa diambil dari data lain atau hardcode
                    // Bisa juga ditambahkan sebagai data attribute pada link
                    const username = SSH_USERNAME; // default username
                    const password = SSH_PASSWORD; // default password
                    
                    // Bisa juga mengambil dari attribute jika ada
                    // const username = this.getAttribute('data-username') || 'admin';
                    // const password = this.getAttribute('data-password') || 'admin';
                    
                    openSSH(addressValue, username, password);
                    
                    // Opsional: tambahkan visual feedback
                    this.style.color = '#60a5fa';
                    setTimeout(() => {
                        this.style.color = '';
                    }, 200);
                });
            });
        }

        function updateColumnSelect() {
            columnSelect.innerHTML = '';
            const displayColumns = columns.filter(col => {
                const colLower = col.toLowerCase();
                return !hiddenColumns.includes(colLower);
            });
            if (!displayColumns.length) {
                const opt = document.createElement('option');
                opt.textContent = 'Tidak ada kolom';
                opt.disabled = true;
                columnSelect.appendChild(opt);
                return;
            }
            const allOpt = document.createElement('option');
            allOpt.value = 'ALL';
            allOpt.textContent = 'ALL';
            columnSelect.appendChild(allOpt);
            displayColumns.forEach(col => {
                const opt = document.createElement('option');
                opt.value = col;
                opt.textContent = col;
                columnSelect.appendChild(opt);
            });
            columnSelect.value = 'ALL';
        }

        function applyFilters() {
            if (!rawData.length || columns.length === 0) {
                filteredData = [];
                renderTable();
                return;
            }
            const searchTerm = searchInput.value.trim().toLowerCase();
            const selectedColumn = columnSelect.value;
            if (searchTerm === '') {
                filteredData = [...rawData];
            } else {
                filteredData = rawData.filter(row => {
                    if (selectedColumn === 'ALL') {
                        for (let col of columns) {
                            let val = row[col];
                            if (val && String(val).toLowerCase().includes(searchTerm)) return true;
                        }
                        return false;
                    } else {
                        let val = row[selectedColumn];
                        return val && String(val).toLowerCase().includes(searchTerm);
                    }
                });
            }
            renderTable();
        }

        function loadDataFromCSV(csvText, filename) {
            const rowsArray = parseCSVToArray(csvText);
            if (!rowsArray || rowsArray.length === 0) {
                return false;
            }
            const headerRow = rowsArray[0];
            if (headerRow.length === 0) return false;
            const newColumns = headerRow.map(h => h.trim());
            const dataRows = rowsArray.slice(1);
            const parsedData = [];
            for (let row of dataRows) {
                const obj = {};
                newColumns.forEach((col, idx) => {
                    obj[col] = (idx < row.length) ? row[idx] : "";
                });
                parsedData.push(obj);
            }
            columns = newColumns;
            rawData = parsedData;
            updateColumnSelect();
            searchInput.value = '';
            columnSelect.value = 'ALL';
            applyFilters();
            sourceStatusSpan.innerText = `✅ ${rawData.length} rows`;
            sourceStatusSpan.style.color = '#34d399';
            if (warningBanner) warningBanner.style.display = 'none';
            return true;
        }

        // Event listeners
        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (columnSelect) columnSelect.addEventListener('change', applyFilters);
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                searchInput.value = '';
                columnSelect.value = 'ALL';
                applyFilters();
            });
        }

        // Drag & Drop support
        if (tableWrapper) {
            tableWrapper.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.background = 'rgba(59,130,246,.05)';
            });
            tableWrapper.addEventListener('dragleave', function() {
                this.style.background = '';
            });
            tableWrapper.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.background = '';
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].name.endsWith('.csv')) {
                    const file = files[0];
                    const reader = new FileReader();
                    reader.onload = function(ev) { loadDataFromCSV(ev.target.result, file.name); };
                    reader.readAsText(file, 'UTF-8');
                } else {
                    alert('Drop file CSV saja');
                }
            });
        }

        // Auto-load md.csv
        function loadMdFile() {
            fetch('./md.csv', { cache: 'no-store' })
                .then(res => {
                    if (res.ok) return res.text();
                    throw new Error('md.csv tidak ditemukan');
                })
                .then(csvText => {
                    loadDataFromCSV(csvText, 'md.csv');
                })
                .catch(err => {
                    if (warningBanner) {
                        warningBanner.style.display = 'block';
                    }
                    if (sourceStatusSpan) {
                        sourceStatusSpan.innerHTML = '⚠️ Gagal memuat md.csv. Silakan drag & drop file CSV.';
                        sourceStatusSpan.style.color = '#f87171';
                    }
                });
        }

        setTimeout(function() {
            loadMdFile();
        }, 300);
    }

    // === TOMBOL "BUKA MASTER DEVICE" ===
    const goToMdBtn = document.getElementById('goToMdBtn');
    if (goToMdBtn) {
        goToMdBtn.addEventListener('click', function() {
            // Update active menu (opsional)
            document.querySelectorAll('.nav-list button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-target') === 'md') {
                    btn.classList.add('active');
                }
            });
            // Tampilkan overlay
            showMasterOverlay();
        });
    }
    
    // === CEK TARGET DEFAULT ===
    setTimeout(function() {
        const activeMenu = document.querySelector('.nav-list button.active');
        if (activeMenu && activeMenu.getAttribute('data-target') === 'md') {
            // Tampilkan overlay jika default md
            showMasterOverlay();
        }
    }, 100);
});