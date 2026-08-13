const FEATURE_TOGGLES = {
    KONVERTER_OLT: true, 
    UP_DOWN: true,        
    SNS_SHUT_NOSHUT: true,
    SNS_POWER: true
};

// ==================== CHECK FEATURE STATUS ====================
function checkFeatureStatus() {
    const allTrue = Object.values(FEATURE_TOGGLES).every(value => value === true);
    const allFalse = Object.values(FEATURE_TOGGLES).every(value => value === false);
    const someTrue = Object.values(FEATURE_TOGGLES).some(value => value === true);
    const someFalse = Object.values(FEATURE_TOGGLES).some(value => value === false);
    
    if (allTrue) {
        // console.log('✅✅✅ TERHUBUNG KE PUBLIC SERVER ✅✅✅');
        // console.log('Semua fitur aktif dan terhubung dengan server');
    } else if (allFalse) {
        // console.log('❌❌❌ TIDAK TERHUBUNG KE PUBLIC SERVER ❌❌❌');
        // console.log('Semua fitur non-aktif - tidak ada koneksi ke server');
    } else if (someTrue && someFalse) {
        // console.log('⚠️⚠️⚠️ KONEKSI SERVER TIDAK STABIL ⚠️⚠️⚠️');
        // console.log('Beberapa fitur terhubung, beberapa tidak:');
        // console.log('✅ TERHUBUNG KE PUBLIC SERVER (untuk fitur yang aktif)');
        // console.log('❌ TIDAK TERHUBUNG KE PUBLIC SERVER (untuk fitur yang non-aktif)');
        
        Object.entries(FEATURE_TOGGLES).forEach(([feature, status]) => {
            const icon = status ? '✅' : '❌';
            const statusText = status ? 'TERHUBUNG' : 'TIDAK TERHUBUNG';
            // console.log(`${icon} ${feature}: ${statusText} KE PUBLIC SERVER`);
        });
    } else if (someTrue) {
        // console.log('✅ TERHUBUNG KE PUBLIC SERVER ✅');
        // console.log('Beberapa fitur aktif dan terhubung ke server');
        
        const activeFeatures = Object.entries(FEATURE_TOGGLES)
            .filter(([_, status]) => status === true)
            .map(([feature]) => feature);
        // console.log('Fitur aktif:', activeFeatures.join(', '));
    } else if (someFalse) {
        // console.log('❌ TIDAK TERHUBUNG KE PUBLIC SERVER ❌');
        // console.log('Beberapa fitur non-aktif - koneksi server terputus');
        
        const inactiveFeatures = Object.entries(FEATURE_TOGGLES)
            .filter(([_, status]) => status === false)
            .map(([feature]) => feature);
        // console.log('Fitur non-aktif:', inactiveFeatures.join(', '));
    }
}

// ==================== ORIGINAL CODE WITH TOGGLES ====================

function initializeKonverterOlt() {
    if (!FEATURE_TOGGLES.KONVERTER_OLT) {
        // console.log('⚠️ Konverter OLT feature is disabled');
        return;
    }
    
    // console.log('🔄 Initializing Konverter OLT...');
    
    const inputData = document.getElementById('inputData');
    const outputData = document.getElementById('outputData');
    const processBtn = document.getElementById('processBtn');
    const totalPonContainer = document.querySelector('.total-pon-container');
    const totalPonText = document.getElementById('totalPonText');
    const lineCount = document.getElementById('lineCount');
    const oltCount = document.getElementById('oltCount');
    const gtghCount = document.getElementById('gtghCount');
    const portCount = document.getElementById('portCount');
    const copyBtn = document.getElementById('copyBtn');
    
    if (!inputData) {
        // console.warn('⚠️ Element Konverter OLT tidak ditemukan');
        return;
    }
    
    // console.log('✅ Konverter OLT elements found');
    
    function detectFormat(detailStr) {
        if (detailStr.includes('Rack=') && detailStr.includes('Shelf=')) {
            return 'format1';
        } else if (detailStr.includes('Frame=') && detailStr.includes('Subslot=')) {
            return 'format2';
        } else if (detailStr.includes('Slot=') && detailStr.includes('Port=')) {
            return 'format3';
        }
        return 'unknown';
    }
    
    function extractOLTInfo(name) {
        const fullName = name.trim();
        const nameParts = name.split('-');
        let oltNumber = null;
        let oltName = '';
        let ltIndex = -1;
        
        for (let i = 0; i < nameParts.length; i++) {
            if (nameParts[i].startsWith('LT')) {
                ltIndex = i;
                const match = nameParts[i].match(/LT(\d+)/i);
                if (match) {
                    oltNumber = parseInt(match[1]);
                    if (i + 1 < nameParts.length) {
                        oltName = nameParts.slice(i + 1).join('-');
                    } else {
                        oltName = '';
                    }
                }
                break;
            }
        }
        
        if (oltNumber === null) {
            const ltMatch = name.match(/LT(\d+)([A-Z\-]+)/i);
            if (ltMatch) {
                oltNumber = parseInt(ltMatch[1]);
                oltName = ltMatch[2];
            } else {
                return null;
            }
        }
        
        return { 
            oltNumber, 
            oltName: oltName || 'UNKNOWN',
            fullName: fullName,
            ltIndex: ltIndex 
        };
    }
    
    function extractDetails(detailStr, format) {
        const details = {};
        const parts = detailStr.split(',');
        parts.forEach(part => {
            const [key, value] = part.split('=');
            if (key && value) {
                const cleanKey = key.trim().toLowerCase();
                const numValue = parseInt(value.trim(), 10);
                details[cleanKey] = isNaN(numValue) ? value.trim() : numValue;
            }
        });
        
        if (details['slot'] !== undefined) {
            details['gtgh'] = details['slot'];
        }
        
        return details;
    }
    
    function processData() {
        const inputText = inputData.value.trim();
        if (!inputText) {
            outputData.value = "Please enter the data first.";
            if (totalPonContainer) totalPonContainer.style.display = 'none';
            if (lineCount) lineCount.textContent = "0 baris diproses";
            if (oltCount) oltCount.textContent = "0 OLT ditemukan";
            if (gtghCount) gtghCount.textContent = "0 GTGH ditemukan";
            if (portCount) portCount.textContent = "0 Port ditemukan";
            return;
        }
        
        const lines = inputText.split('\n');
        const dataMap = {};
        let currentFormat = null;
        let processedLines = 0;
        let skippedLines = 0;
        let totalPorts = 0;
        let uniquePortsSet = new Set();
        let allGtghs = new Set();
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            const lineParts = trimmedLine.split(/\s+/);
            if (lineParts.length < 2) {
                const tabParts = trimmedLine.split('\t');
                if (tabParts.length < 2) {
                    skippedLines++;
                    return;
                }
                var name = tabParts[0].trim();
                var details = tabParts[1].trim();
            } else {
                var name = lineParts[0].trim();
                var details = lineParts.slice(1).join(' ').trim();
            }
            
            const format = detectFormat(details);
            if (format === 'unknown') {
                skippedLines++;
                return;
            }
            
            if (currentFormat === null) {
                currentFormat = format;
            }
            
            const oltInfo = extractOLTInfo(name);
            if (!oltInfo) {
                skippedLines++;
                return;
            }
            
            const { oltNumber, oltName, fullName } = oltInfo;
            const oltKey = `${oltNumber}-${oltName}`;
            const detailObj = extractDetails(details, format);
            let gtgh;
            if (format === 'format1') {
                gtgh = detailObj['slot'];
            } else {
                gtgh = detailObj['slot'];
            }
            
            if (gtgh === undefined || gtgh === null) {
                skippedLines++;
                return;
            }
            
            const port = Number(detailObj['port']);
            if (Number.isNaN(port)) {
                skippedLines++;
                return;
            }
            
            if (!dataMap[oltKey]) {
                dataMap[oltKey] = {
                    oltNumber: oltNumber,
                    oltName: oltName,
                    fullName: fullName,
                    format: format,
                    gtghs: {}
                };
            }
            
            if (!dataMap[oltKey].gtghs[gtgh]) {
                dataMap[oltKey].gtghs[gtgh] = new Set();
            }
            
            const portSet = dataMap[oltKey].gtghs[gtgh];
            const beforeSize = portSet.size;
            portSet.add(port);
            const afterSize = portSet.size;
            
            if (afterSize > beforeSize) {
                totalPorts++;
                uniquePortsSet.add(`${oltKey}-${gtgh}-${port}`);
            }
            
            allGtghs.add(`${oltKey}-${gtgh}`);
            processedLines++;
        });
        
        const sortedOltKeys = Object.keys(dataMap).sort((a, b) => {
            return dataMap[a].oltNumber - dataMap[b].oltNumber;
        });
        
        let output = '';
        sortedOltKeys.forEach(oltKey => {
            const oltData = dataMap[oltKey];
            output += `> ${oltData.fullName}\n`;
            const sortedGtghKeys = Object.keys(oltData.gtghs).sort((a, b) => parseInt(a) - parseInt(b));
            sortedGtghKeys.forEach(gtghKey => {
                const portsSet = oltData.gtghs[gtghKey];
                if (portsSet.size > 0) {
                    const portsArray = Array.from(portsSet);
                    portsArray.sort((a, b) => a - b);
                    const portsStr = portsArray.join(',');
                    const label = oltData.format === 'format1' ? 'GTGH' : 'SLOT';
                    output += `${label} ${gtghKey} PON ${portsStr}\n`;
                }
            });
            output += '\n';
        });
        
        output = output.trim();
        
        const totalPon = uniquePortsSet.size;
        if (totalPon > 0 && totalPonContainer && totalPonText) {
            totalPonText.textContent = `Total PON : ${totalPon} PON`;
            totalPonContainer.style.display = 'block';
        } else if (totalPonContainer) {
            totalPonContainer.style.display = 'none';
        }
        
        outputData.value = output;
        if (lineCount) lineCount.textContent = `${processedLines} baris diproses`;
        if (oltCount) oltCount.textContent = `${sortedOltKeys.length} OLT ditemukan`;
        if (gtghCount) gtghCount.textContent = `${allGtghs.size} ${currentFormat === 'format1' ? 'GTGH' : 'SLOT'} ditemukan`;
        if (portCount) portCount.textContent = `${totalPorts} Port ditemukan`;
        
        if (skippedLines > 0 && lineCount) {
            lineCount.textContent += ` (${skippedLines} dilewati)`;
        }
    }
    
    function copyToClipboard() {
        if (outputData.value) {
            outputData.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Disalin!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }
    }
    
    if (processBtn) processBtn.addEventListener('click', processData);
    if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboard);
    }
    
    setTimeout(processData, 500);
    // console.log('✅ Konverter OLT initialized successfully');
}

function initializeUpDown() {
    if (!FEATURE_TOGGLES.UP_DOWN) {
        // console.log('⚠️ Up/Down feature is disabled');
        return;
    }
    
    // console.log('🔄 Initializing Up/Down...');
    
    const inputUpDown1 = document.getElementById('inputUpDown1');
    const inputUpDown2 = document.getElementById('inputUpDown2');
    const outputUpDown = document.getElementById('outputUpDown');
    const processBtnUpDown = document.getElementById('processBtnUpDown');
    const comparisonResultContainer = document.querySelector('.comparison-result-container');
    const comparisonResultText = document.getElementById('comparisonResultText');
    const upCount = document.getElementById('upCount');
    const downCount = document.getElementById('downCount');
    
    if (!inputUpDown1) {
        // console.warn('⚠️ Element Up/Down tidak ditemukan');
        return;
    }
    
    // console.log('✅ Up/Down elements found');
    
    // ==================== FORMAT DETECTION ====================
    function detectDataFormat(text) {
        const lines = text.trim().split('\n');
        let hasPon = false;
        let hasPort = false;
        
        for (let line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('>')) continue;
            
            // Cek format PON atau PORT
            if (trimmedLine.match(/(GTGH|SLOT)\s+\d+\s+PON\s+/i)) {
                hasPon = true;
            }
            if (trimmedLine.match(/(SLOT)\s+\d+\s+PORT\s+/i)) {
                hasPort = true;
            }
        }
        
        if (hasPon && hasPort) return 'mixed';
        if (hasPon) return 'pon';
        if (hasPort) return 'port';
        return 'unknown';
    }
    
    function parseOltData(text) {
        const data = {};
        const lines = text.trim().split('\n');
        let currentOlt = null;
        let currentOltLabel = null;
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            if (trimmedLine.startsWith('>')) {
                currentOlt = trimmedLine.substring(1).trim();
                if (!data[currentOlt]) {
                    data[currentOlt] = {
                        label: null,
                        gtghs: {}
                    };
                }
            } 
            else if (currentOlt) {
                // Support both PON and PORT formats
                let match = trimmedLine.match(/(GTGH|SLOT)\s+(\d+)\s+PON\s+(.+)/);
                let isPort = false;
                
                if (!match) {
                    match = trimmedLine.match(/(SLOT)\s+(\d+)\s+PORT\s+(.+)/);
                    if (match) {
                        isPort = true;
                    }
                }
                
                if (match) {
                    const label = match[1];
                    const gtgh = match[2];
                    const ports = match[3].split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
                    
                    if (!data[currentOlt].label) {
                        data[currentOlt].label = label;
                    }
                    
                    // Store format type
                    if (!data[currentOlt].formatType) {
                        data[currentOlt].formatType = isPort ? 'port' : 'pon';
                    }
                    
                    if (!data[currentOlt].gtghs[gtgh]) {
                        data[currentOlt].gtghs[gtgh] = new Set();
                    }
                    
                    ports.forEach(port => {
                        data[currentOlt].gtghs[gtgh].add(port);
                    });
                }
            }
        });
        
        return data;
    }
    
    function compareOltData(allData, downData) {
        const result = {};
        
        Object.keys(allData).forEach(oltName => {
            const oltAllData = allData[oltName];
            const oltDownData = downData[oltName];
            
            if (!result[oltName]) {
                result[oltName] = {
                    label: oltAllData.label || 'GTGH',
                    formatType: oltAllData.formatType || 'pon',
                    gtghs: {}
                };
            }
            
            Object.keys(oltAllData.gtghs || {}).forEach(gtgh => {
                const allPorts = oltAllData.gtghs[gtgh];
                const downPorts = oltDownData && oltDownData.gtghs && oltDownData.gtghs[gtgh] 
                    ? oltDownData.gtghs[gtgh] 
                    : new Set();
                
                const upPorts = [];
                const downPortsArray = [];
                
                allPorts.forEach(port => {
                    if (downPorts.has(port)) {
                        downPortsArray.push(port);
                    } else {
                        upPorts.push(port);
                    }
                });
                
                upPorts.sort((a, b) => a - b);
                downPortsArray.sort((a, b) => a - b);
                
                result[oltName].gtghs[gtgh] = {
                    up: upPorts,
                    down: downPortsArray
                };
            });
        });
        
        return result;
    }
    
    function formatComparisonResult(comparisonData) {
        let output = '';
        
        Object.keys(comparisonData).sort().forEach(oltName => {
            output += `> ${oltName}\n`;
            const oltData = comparisonData[oltName];
            const label = oltData.label || 'GTGH';
            const formatType = oltData.formatType || 'pon';
            const sortedGtghs = Object.keys(oltData.gtghs || {}).sort((a, b) => parseInt(a) - parseInt(b));
            
            sortedGtghs.forEach(gtgh => {
                const data = oltData.gtghs[gtgh];
                const keyword = formatType === 'port' ? 'PORT' : 'PON';
                
                if (data.up.length > 0) {
                    const upPortsStr = data.up.join(',');
                    output += `${label} ${gtgh} ${keyword} ${upPortsStr} ✅\n`;
                }
                if (data.down.length > 0) {
                    const downPortsStr = data.down.join(',');
                    output += `${label} ${gtgh} ${keyword} ${downPortsStr} ❌\n`;
                }
            });
            output += '\n';
        });
        
        return output.trim();
    }
    
    function showFormatMismatchAlert() {
        alert('⚠️ FORMAT TIDAK SESUAI!\n\n' +
              'ALL PON dan INACTIVE harus menggunakan format yang sama.\n\n' +
              'Jika ALL PON menggunakan PON, maka INACTIVE harus PON.\n' +
              'Jika ALL PON menggunakan PORT, maka INACTIVE harus PORT.\n\n' +
              'Silakan perbaiki format data Anda.');
    }
    
    function processComparison() {
        const text1 = inputUpDown1.value.trim();
        const text2 = inputUpDown2.value.trim();
        
        if (!text1) {
            outputUpDown.value = "Silakan masukkan data lengkap di Input 1.";
            if (comparisonResultContainer) comparisonResultContainer.style.display = 'none';
            return;
        }
        
        // Detect format
        const format1 = detectDataFormat(text1);
        const format2 = text2 ? detectDataFormat(text2) : 'unknown';
        
        // Validate format consistency
        if (text2 && format1 !== 'unknown' && format2 !== 'unknown') {
            if (format1 === 'mixed' || format2 === 'mixed') {
                showFormatMismatchAlert();
                outputUpDown.value = "❌ ERROR: Format campuran terdeteksi!\n\n" +
                                    "ALL PON atau INACTIVE tidak boleh mencampur format PON dan PORT.\n" +
                                    "Gunakan salah satu format secara konsisten.";
                if (comparisonResultContainer) comparisonResultContainer.style.display = 'none';
                return;
            }
            
            if (format1 !== format2) {
                showFormatMismatchAlert();
                outputUpDown.value = `❌ FORMAT TIDAK SESUAI!\n\n` +
                                    `ALL PON menggunakan format: ${format1.toUpperCase()}\n` +
                                    `INACTIVE menggunakan format: ${format2.toUpperCase()}\n\n` +
                                    `Kedua input harus menggunakan format yang sama.\n` +
                                    `Semua PON atau Semua PORT.`;
                if (comparisonResultContainer) comparisonResultContainer.style.display = 'none';
                return;
            }
        }
        
        const allData = parseOltData(text1);
        const downData = text2 ? parseOltData(text2) : {};
        const comparisonData = compareOltData(allData, downData);
        
        let totalUp = 0;
        let totalDown = 0;
        
        Object.values(comparisonData).forEach(oltData => {
            Object.values(oltData.gtghs || {}).forEach(gtghData => {
                totalUp += gtghData.up.length;
                totalDown += gtghData.down.length;
            });
        });
        
        let output = formatComparisonResult(comparisonData);
        
        if (comparisonResultContainer && comparisonResultText) {
            comparisonResultContainer.style.display = 'flex';
            if (upCount) upCount.textContent = `Total PON: UP: ${totalUp}`;
            if (downCount) downCount.textContent = `DOWN: ${totalDown}`;
        }
        
        
        outputUpDown.value = output;
    }
    
    if (processBtnUpDown) {
        processBtnUpDown.addEventListener('click', processComparison);
    }
    
    if (comparisonResultContainer) {
        comparisonResultContainer.style.display = 'none';
    }
    
    // console.log('✅ Up/Down initialized successfully');
}

// ==================== SNS SHUT / NO SHUT FEATURE ====================
function initializeSnsShutNoshut() {
    if (!FEATURE_TOGGLES.SNS_SHUT_NOSHUT) {
        // console.log('⚠️ SNS Shut/No Shut feature is disabled');
        return;
    }
    
    // console.log('🔄 Initializing SNS Shut/No Shut...');
    
    const snsInputData = document.getElementById('snsInputData');
    const snsOutputData = document.getElementById('snsOutputData');
    const snsC320Disable = document.getElementById('snsC320Disable');
    const snsC320Enable = document.getElementById('snsC320Enable');
    const snsC620Disable = document.getElementById('snsC620Disable');
    const snsC620Enable = document.getElementById('snsC620Enable');
    const snsHwDisable = document.getElementById('snsHwDisable');
    const snsHwEnable = document.getElementById('snsHwEnable');
    const snsCopyBtn = document.getElementById('snsCopyBtn');
    const snsClearBtn = document.getElementById('snsClearBtn');
    const snsCommandCount = document.getElementById('snsCommandCount');
    
    if (!snsInputData) {
        // console.warn('⚠️ Element SNS tidak ditemukan');
        return;
    }
    
    // console.log('✅ SNS elements found');
    
    function parseSnsData(text) {
        const data = [];
        const lines = text.trim().split('\n');
        let currentOlt = null;
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            if (trimmedLine.startsWith('>')) {
                currentOlt = trimmedLine.substring(1).trim();
            } 
            else if (currentOlt && (trimmedLine.startsWith('GTGH') || trimmedLine.startsWith('SLOT'))) {
                // Support multiple formats:
                // 1. GTGH X PON Y,Y,Y (for C320/C620)
                // 2. SLOT X PON Y,Y,Y (for HW with PON)
                // 3. SLOT X PORT Y,Y,Y (for HW with PORT)
                let match = trimmedLine.match(/(GTGH|SLOT)\s+(\d+)\s+PON\s+(.+)/);
                let isPort = false;
                
                if (!match) {
                    match = trimmedLine.match(/(SLOT)\s+(\d+)\s+PORT\s+(.+)/);
                    if (match) {
                        isPort = true;
                    }
                }
                
                if (match) {
                    const ports = match[3].split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
                    const number = parseInt(match[2]);
                    const format = match[1];
                    
                    ports.forEach(port => {
                        data.push({
                            olt: currentOlt,
                            number: number,
                            port: port,
                            format: format,
                            isPort: isPort // Flag to indicate if using PORT keyword
                        });
                    });
                }
            }
        });
        
        return data;
    }
    
    function generateCommands(parsedData, deviceType, actionType) {
        const commands = [];
        
        if (parsedData.length === 0) {
            return commands;
        }
        
        // Handle Huawei (HW) device type
        if (deviceType === 'hw') {
            const groupedCommands = {};
            parsedData.forEach(item => {
                const key = `${item.number}`;
                if (!groupedCommands[key]) {
                    groupedCommands[key] = [];
                }
                groupedCommands[key].push(item.port);
            });
            
            Object.keys(groupedCommands).sort((a, b) => parseInt(a) - parseInt(b)).forEach(numberKey => {
                const ports = groupedCommands[numberKey].sort((a, b) => a - b);
                const slot = parseInt(numberKey);
                
                // Add interface gpon 0/slot
                commands.push(`interface gpon 0/${slot}`);
                
                // Add shutdown or undo shutdown for each port
                ports.forEach(port => {
                    if (actionType === 'disable') {
                        commands.push(`shutdown ${port}`);
                    } else {
                        commands.push(`undo shutdown ${port}`);
                    }
                });
                
                commands.push(''); // Empty line after each interface
            });
            
            return commands;
        }
        
        // Handle C320 and C620 (existing code)
        const groupedCommands = {};
        parsedData.forEach(item => {
            const key = `${item.number}`;
            if (!groupedCommands[key]) {
                groupedCommands[key] = [];
            }
            groupedCommands[key].push(item.port);
        });
        
        Object.keys(groupedCommands).sort((a, b) => parseInt(a) - parseInt(b)).forEach(gtghKey => {
            const ports = groupedCommands[gtghKey].sort((a, b) => a - b);
            const gtgh = parseInt(gtghKey);
            
            ports.forEach(port => {
                let interfaceName = '';
                
                if (deviceType === 'c320') {
                    interfaceName = `gpon-olt_1/${gtgh}/${port}`;
                } else if (deviceType === 'c620') {
                    interfaceName = `gpon_olt-1/${gtgh}/${port}`;
                }
                
                commands.push(`interface ${interfaceName}`);
                
                if (actionType === 'disable') {
                    commands.push('shutdown');
                } else {
                    commands.push('no shutdown');
                }
                
                commands.push('exit');
            });
        });
        
        return commands;
    }
    
    function processSns(deviceType, actionType) {
        const inputText = snsInputData.value.trim();
        
        if (!inputText) {
            snsOutputData.value = "❌ Please enter data first!";
            if (snsCommandCount) snsCommandCount.textContent = "Total: 0";
            return;
        }
        
        const parsedData = parseSnsData(inputText);
        
        if (parsedData.length === 0) {
            snsOutputData.value = "❌ No valid data found!\n\nMake sure the format matches the Konverter OLT output.\n\nSupported formats:\n• GTGH X PON Y,Y,Y (for C320/C620)\n• SLOT X PON Y,Y,Y (for HW)\n• SLOT X PORT Y,Y,Y (for HW)";
            if (snsCommandCount) snsCommandCount.textContent = "Total: 0";
            return;
        }
        
        // Validate format for HW device
        if (deviceType === 'hw') {
            const hasSlotFormat = parsedData.some(item => item.format === 'SLOT');
            if (!hasSlotFormat) {
                snsOutputData.value = "❌ HW only supports SLOT format!\n\nPlease use SLOT format:\n> NAMA_SITE\nSLOT 1 PON 1,2,3\n\nor\n> NAMA_SITE\nSLOT 1 PORT 1,2,3";
                if (snsCommandCount) snsCommandCount.textContent = "Total: 0";
                return;
            }
        }
        
        // Validate format for C320/C620
        if (deviceType === 'c320' || deviceType === 'c620') {
            const hasGtghFormat = parsedData.some(item => item.format === 'GTGH');
            if (!hasGtghFormat) {
                snsOutputData.value = `❌ ${deviceType.toUpperCase()} only supports GTGH format!\n\nPlease use GTGH format:\n> OLT-NAME\nGTGH 1 PON 1,2,3`;
                if (snsCommandCount) snsCommandCount.textContent = "Total: 0";
                return;
            }
        }
        
        const commands = generateCommands(parsedData, deviceType, actionType);
        
        // Remove all header comments, just output the commands directly
        snsOutputData.value = commands.join('\n');
        
        if (snsCommandCount) {
            const totalCommands = commands.filter(cmd => cmd && cmd !== '').length;
            snsCommandCount.textContent = `Total: ${parsedData.length} PON | Commands: ${totalCommands}`;
        }
        
        showButtonFeedback(deviceType, actionType);
    }
    
    function showButtonFeedback(deviceType, actionType) {
        let buttonId = '';
        if (deviceType === 'c320' && actionType === 'disable') buttonId = 'snsC320Disable';
        if (deviceType === 'c320' && actionType === 'enable') buttonId = 'snsC320Enable';
        if (deviceType === 'c620' && actionType === 'disable') buttonId = 'snsC620Disable';
        if (deviceType === 'c620' && actionType === 'enable') buttonId = 'snsC620Enable';
        if (deviceType === 'hw' && actionType === 'disable') buttonId = 'snsHwDisable';
        if (deviceType === 'hw' && actionType === 'enable') buttonId = 'snsHwEnable';
        
        const button = document.getElementById(buttonId);
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> DONE!';
            setTimeout(() => {
                button.innerHTML = originalHTML;
            }, 1000);
        }
    }
    
    function copySnsToClipboard() {
        const outputText = snsOutputData.value;
        
        if (!outputText || outputText.includes("❌ Please enter data first") || outputText.includes("❌ No valid data found")) {
            showSnsNotification('No commands to copy!', 'error');
            return;
        }
        
        snsOutputData.select();
        snsOutputData.setSelectionRange(0, 99999);
        
        try {
            navigator.clipboard.writeText(outputText).then(() => {
                showSnsNotification('✓ Commands copied to clipboard!', 'success');
            });
        } catch (err) {
            document.execCommand('copy');
            showSnsNotification('✓ Commands copied to clipboard!', 'success');
        }
        
        if (snsCopyBtn) {
            const originalText = snsCopyBtn.innerHTML;
            snsCopyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                snsCopyBtn.innerHTML = originalText;
            }, 1500);
        }
    }
    
    function clearSnsData() {
        if (snsInputData) snsInputData.value = '';
        if (snsOutputData) snsOutputData.value = '';
        if (snsCommandCount) snsCommandCount.textContent = 'Total: 0';
        showSnsNotification('Cleared!', 'info');
    }
    
    function showSnsNotification(message, type = 'info') {
        let notification = document.querySelector('.sns-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'sns-notification';
            
            const style = document.createElement('style');
            style.textContent = `
                .sns-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    animation: snsSlideIn 0.3s ease;
                    max-width: 300px;
                    font-size: 0.9rem;
                }
                .sns-notification.success {
                    background: linear-gradient(135deg, #10b981, #059669);
                }
                .sns-notification.error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }
                .sns-notification.info {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                }
                @keyframes snsSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.className = `sns-notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2500);
    }
    
    if (snsC320Disable) snsC320Disable.addEventListener('click', () => processSns('c320', 'disable'));
    if (snsC320Enable) snsC320Enable.addEventListener('click', () => processSns('c320', 'enable'));
    if (snsC620Disable) snsC620Disable.addEventListener('click', () => processSns('c620', 'disable'));
    if (snsC620Enable) snsC620Enable.addEventListener('click', () => processSns('c620', 'enable'));
    if (snsHwDisable) snsHwDisable.addEventListener('click', () => processSns('hw', 'disable'));
    if (snsHwEnable) snsHwEnable.addEventListener('click', () => processSns('hw', 'enable'));
    if (snsCopyBtn) snsCopyBtn.addEventListener('click', copySnsToClipboard);
    if (snsClearBtn) snsClearBtn.addEventListener('click', clearSnsData);
    
    if (snsInputData) {
        snsInputData.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                const activeBtn = document.querySelector('.sns-btn:hover');
                if (activeBtn && activeBtn.id) {
                    if (activeBtn.id === 'snsC320Disable') processSns('c320', 'disable');
                    else if (activeBtn.id === 'snsC320Enable') processSns('c320', 'enable');
                    else if (activeBtn.id === 'snsC620Disable') processSns('c620', 'disable');
                    else if (activeBtn.id === 'snsC620Enable') processSns('c620', 'enable');
                    else if (activeBtn.id === 'snsHwDisable') processSns('hw', 'disable');
                    else if (activeBtn.id === 'snsHwEnable') processSns('hw', 'enable');
                }
            }
        });
    }
    
    // console.log('✅ SNS Shut/No Shut initialized successfully');
}

// ==================== SNS POWER FEATURE ====================
function initializeSnsPower() {
    if (!FEATURE_TOGGLES.SNS_POWER) {
        // console.log('⚠️ SNS Power feature is disabled');
        return;
    }
    
    // console.log('🔄 Initializing SNS Power...');
    
    const snsPowerInputData = document.getElementById('snsPowerInputData');
    const snsPowerOutputData = document.getElementById('snsPowerOutputData');
    const snsPowerC320 = document.getElementById('snsPowerC320');
    const snsPowerC620 = document.getElementById('snsPowerC620');
    const snsPowerCopyBtn = document.getElementById('snsPowerCopyBtn');
    const snsPowerClearBtn = document.getElementById('snsPowerClearBtn');
    const snsPowerCommandCount = document.getElementById('snsPowerCommandCount');
    
    if (!snsPowerInputData) {
        // console.warn('⚠️ Element SNS POWER tidak ditemukan');
        return;
    }
    
    // console.log('✅ SNS Power elements found');
    
    function parsePowerData(text) {
        const data = [];
        const lines = text.trim().split('\n');
        let currentOlt = null;
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            if (trimmedLine.startsWith('>')) {
                currentOlt = trimmedLine.substring(1).trim();
            } 
            else if (currentOlt) {
                // Coba match format GTGH PON
                let match = trimmedLine.match(/(GTGH)\s+(\d+)\s+PON\s+(.+)/i);
                let format = null;
                let number = null;
                let portsStr = null;
                
                if (match) {
                    format = 'gtgh';
                    number = parseInt(match[2]);
                    portsStr = match[3];
                } else {
                    // Coba match format SLOT PORT
                    match = trimmedLine.match(/(SLOT)\s+(\d+)\s+PORT\s+(.+)/i);
                    if (match) {
                        format = 'slot';
                        number = parseInt(match[2]);
                        portsStr = match[3];
                    } else {
                        // TAMBAHAN: Coba match format SLOT PON
                        match = trimmedLine.match(/(SLOT)\s+(\d+)\s+PON\s+(.+)/i);
                        if (match) {
                            format = 'slot';
                            number = parseInt(match[2]);
                            portsStr = match[3];
                        }
                    }
                }
                
                if (format && number && portsStr) {
                    const ports = portsStr.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
                    
                    ports.forEach(port => {
                        data.push({
                            olt: currentOlt,
                            number: number,
                            port: port,
                            format: format
                        });
                    });
                }
            }
        });
        
        return data;
    }
    
    function detectDeviceType(parsedData) {
        if (parsedData.length === 0) return null;
        
        const hasSlotFormat = parsedData.some(item => item.format === 'slot');
        
        if (hasSlotFormat) {
            return 'hw';
        }
        
        return null;
    }
    
    function generateC320Commands(parsedData) {
        const commands = [];
        
        if (parsedData.length === 0) {
            return commands;
        }
        
        commands.push('terminal length 0');
        commands.push('');
        
        const groupedCommands = {};
        parsedData.forEach(item => {
            const key = `${item.number}`;
            if (!groupedCommands[key]) {
                groupedCommands[key] = [];
            }
            groupedCommands[key].push(item.port);
        });
        
        const sortedGtghs = Object.keys(groupedCommands).sort((a, b) => parseInt(a) - parseInt(b));
        
        sortedGtghs.forEach(gtghKey => {
            const ports = groupedCommands[gtghKey].sort((a, b) => a - b);
            const gtgh = parseInt(gtghKey);
            
            ports.forEach(port => {
                commands.push(`show pon power onu-rx gpon-olt_1/${gtgh}/${port}`);
            });
        });
        
        commands.push('');
        
        return commands;
    }
    
    function generateC620Commands(parsedData) {
        const commands = [];
        
        if (parsedData.length === 0) {
            return commands;
        }
        
        commands.push('terminal length 0');
        commands.push('');
        
        const groupedCommands = {};
        parsedData.forEach(item => {
            const key = `${item.number}`;
            if (!groupedCommands[key]) {
                groupedCommands[key] = [];
            }
            groupedCommands[key].push(item.port);
        });
        
        Object.keys(groupedCommands).sort((a, b) => parseInt(a) - parseInt(b)).forEach(numberKey => {
            const ports = groupedCommands[numberKey].sort((a, b) => a - b);
            const number = parseInt(numberKey);
            
            ports.forEach(port => {
                commands.push(`show pon power onu-rx gpon_olt-1/${number}/${port}`);
            });
        });
        
        commands.push('');
        
        return commands;
    }
    
    function generateHWCommands(parsedData) {
        const commands = [];
        
        if (parsedData.length === 0) {
            return commands;
        }
        
        commands.push('undo smart');
        commands.push('undo interactive');
        commands.push('scroll 512');
        commands.push('');
        
        const groupedCommands = {};
        parsedData.forEach(item => {
            const key = `${item.number}`;
            if (!groupedCommands[key]) {
                groupedCommands[key] = [];
            }
            groupedCommands[key].push(item.port);
        });
        
        Object.keys(groupedCommands).sort((a, b) => parseInt(a) - parseInt(b)).forEach(numberKey => {
            const ports = groupedCommands[numberKey].sort((a, b) => a - b);
            const number = parseInt(numberKey);
            
            ports.forEach(port => {
                commands.push(`display ont info summary 0/${number}/${port}`);
            });
        });
        
        commands.push('');
        
        return commands;
    }
    
    function autoProcessOnInput() {
        const inputText = snsPowerInputData.value.trim();
        
        if (!inputText) {
            snsPowerOutputData.value = "";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = "Total: 0 commands";
            return;
        }
        
        const parsedData = parsePowerData(inputText);
        
        if (parsedData.length === 0) {
            snsPowerOutputData.value = "❌ No valid data found!\n\nMake sure the format matches the Konverter OLT output.\n\nSupported formats:\n- GTGH X PON Y,Y,Y\n- SLOT X PORT Y,Y,Y\n- SLOT X PON Y,Y,Y";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = "Total: 0 commands";
            return;
        }
        
        const detectedDevice = detectDeviceType(parsedData);
        
        let commands = [];
        
        if (detectedDevice === 'hw') {
            const slotData = parsedData.filter(item => item.format === 'slot');
            commands = generateHWCommands(slotData);
        } else {
            snsPowerOutputData.value = "⚠️ GTGH format detected.\n\nPlease select C320 or C620 button to generate commands.\n\nOr use SLOT format for automatic Huawei detection.";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = `Total PON: ${parsedData.length} | Select device type`;
            return;
        }
        
        snsPowerOutputData.value = commands.join('\n');
        
        if (snsPowerCommandCount) {
            const totalCommands = commands.filter(cmd => cmd && cmd !== '').length;
            snsPowerCommandCount.textContent = `Total PON: ${parsedData.length} | Total Commands: ${totalCommands}`;
        }
    }
    
    function processC320() {
        const inputText = snsPowerInputData.value.trim();
        
        if (!inputText) {
            snsPowerOutputData.value = "❌ Please enter data first!";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = "Total: 0 commands";
            return;
        }
        
        const parsedData = parsePowerData(inputText);
        
        if (parsedData.length === 0) {
            snsPowerOutputData.value = "❌ No valid data found!\n\nSupported formats:\n- GTGH X PON Y,Y,Y\n- SLOT X PORT Y,Y,Y\n- SLOT X PON Y,Y,Y";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = "Total: 0 commands";
            return;
        }
        
        const gtghData = parsedData.filter(item => item.format === 'gtgh');
        
        if (gtghData.length === 0) {
            snsPowerOutputData.value = "❌ C320 only supports GTGH format!\n\nPlease use GTGH format:\n> OLT-NAME\nGTGH 1 PON 1,2,3";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = "Total: 0 commands";
            return;
        }
        
        const commands = generateC320Commands(gtghData);
        
        snsPowerOutputData.value = commands.join('\n');
        
        if (snsPowerCommandCount) {
            const totalCommands = commands.filter(cmd => cmd && cmd !== '').length;
            snsPowerCommandCount.textContent = `Total PON: ${gtghData.length} | Total Commands: ${totalCommands}`;
        }
        
        showPowerButtonFeedback('c320');
    }
    
    function processC620() {
        const inputText = snsPowerInputData.value.trim();
        
        if (!inputText) {
            snsPowerOutputData.value = "❌ Please enter data first!";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = "Total: 0 commands";
            return;
        }
        
        const parsedData = parsePowerData(inputText);
        
        if (parsedData.length === 0) {
            snsPowerOutputData.value = "❌ No valid data found!\n\nSupported formats:\n- GTGH X PON Y,Y,Y\n- SLOT X PORT Y,Y,Y\n- SLOT X PON Y,Y,Y";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = "Total: 0 commands";
            return;
        }
        
        const gtghData = parsedData.filter(item => item.format === 'gtgh');
        
        if (gtghData.length === 0) {
            snsPowerOutputData.value = "❌ C620 only supports GTGH format!\n\nPlease use GTGH format:\n> OLT-NAME\nGTGH 1 PON 1,2,3";
            if (snsPowerCommandCount) snsPowerCommandCount.textContent = "Total: 0 commands";
            return;
        }
        
        const commands = generateC620Commands(gtghData);
        
        snsPowerOutputData.value = commands.join('\n');
        
        if (snsPowerCommandCount) {
            const totalCommands = commands.filter(cmd => cmd && cmd !== '').length;
            snsPowerCommandCount.textContent = `Total PON: ${gtghData.length} | Total Commands: ${totalCommands}`;
        }
        
        showPowerButtonFeedback('c620');
    }
    
    function showPowerButtonFeedback(deviceType) {
        let buttonId = '';
        if (deviceType === 'c320') buttonId = 'snsPowerC320';
        if (deviceType === 'c620') buttonId = 'snsPowerC620';
        
        const button = document.getElementById(buttonId);
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> DONE!';
            setTimeout(() => {
                button.innerHTML = originalHTML;
            }, 1000);
        }
    }
    
    function copyPowerToClipboard() {
        const outputText = snsPowerOutputData.value;
        
        if (!outputText || outputText.includes("❌") || outputText.includes("⚠️")) {
            showPowerNotification('No commands to copy!', 'error');
            return;
        }
        
        snsPowerOutputData.select();
        snsPowerOutputData.setSelectionRange(0, 99999);
        
        try {
            navigator.clipboard.writeText(outputText).then(() => {
                showPowerNotification('✓ Commands copied to clipboard!', 'success');
            });
        } catch (err) {
            document.execCommand('copy');
            showPowerNotification('✓ Commands copied to clipboard!', 'success');
        }
        
        if (snsPowerCopyBtn) {
            const originalText = snsPowerCopyBtn.innerHTML;
            snsPowerCopyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                snsPowerCopyBtn.innerHTML = originalText;
            }, 1500);
        }
    }
    
    function clearPowerData() {
        if (snsPowerInputData) snsPowerInputData.value = '';
        if (snsPowerOutputData) snsPowerOutputData.value = '';
        if (snsPowerCommandCount) snsPowerCommandCount.textContent = 'Total: 0 commands';
        showPowerNotification('Cleared!', 'info');
    }
    
    function showPowerNotification(message, type = 'info') {
        let notification = document.querySelector('.sns-power-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'sns-power-notification';
            
            const style = document.createElement('style');
            style.textContent = `
                .sns-power-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    animation: snsPowerSlideIn 0.3s ease;
                    max-width: 300px;
                    font-size: 0.9rem;
                }
                .sns-power-notification.success {
                    background: linear-gradient(135deg, #10b981, #059669);
                }
                .sns-power-notification.error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }
                .sns-power-notification.info {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                }
                @keyframes snsPowerSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.className = `sns-power-notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2500);
    }
    
    if (snsPowerInputData) {
        snsPowerInputData.addEventListener('input', autoProcessOnInput);
    }
    
    if (snsPowerC320) snsPowerC320.addEventListener('click', processC320);
    if (snsPowerC620) snsPowerC620.addEventListener('click', processC620);
    if (snsPowerCopyBtn) snsPowerCopyBtn.addEventListener('click', copyPowerToClipboard);
    if (snsPowerClearBtn) snsPowerClearBtn.addEventListener('click', clearPowerData);
    
    // console.log('✅ SNS Power initialized successfully');
}

// ==================== RE-INITIALIZATION FUNCTION ====================
function reinitializeAllFeatures() {
    // console.log('🔄 Manual re-initialization triggered');
    
    // Reset status
    if (typeof window.snsInitialized !== 'undefined') {
        window.snsInitialized = false;
    }
    
    // Re-inisialisasi semua fitur
    try {
        checkFeatureStatus();
        initializeKonverterOlt();
        initializeUpDown();
        initializeSnsShutNoshut();
        initializeSnsPower();
        // console.log('✅ Re-initialization complete');
    } catch (error) {
        // console.error('❌ Error during re-initialization:', error);
    }
}

// ==================== EXPOSE FUNCTIONS TO GLOBAL ====================
window.reinitializeAllFeatures = reinitializeAllFeatures;

// ==================== DOM READY ====================
if (typeof window.snsInitialized === 'undefined') {
    window.snsInitialized = true;
    
    // Fungsi untuk inisialisasi
    function initAllFeatures() {
        // console.log('🔄 Initializing all features...');
        // console.log('📊 Document state:', document.readyState);
        
        // Cek elemen penting
        const elements = {
            inputData: !!document.getElementById('inputData'),
            processBtn: !!document.getElementById('processBtn'),
            snsInputData: !!document.getElementById('snsInputData'),
            snsPowerInputData: !!document.getElementById('snsPowerInputData')
        };
        // console.log('📊 Element status:', elements);
        
        checkFeatureStatus();
        initializeKonverterOlt();
        initializeUpDown();
        initializeSnsShutNoshut();
        initializeSnsPower();
        
        // console.log('✅ All features initialized');
    }
    
    // Inisialisasi jika DOM sudah siap
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // console.log('🔄 DOM sudah siap, inisialisasi langsung');
        setTimeout(initAllFeatures, 100);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            // console.log('🔄 DOMContentLoaded, inisialisasi');
            setTimeout(initAllFeatures, 100);
        });
    }
    
    // Fallback jika masih belum inisialisasi setelah beberapa saat
    setTimeout(function() {
        if (typeof window.snsInitialized !== 'undefined' && !window.snsInitialized) {
            // console.warn('⚠️ Fallback: Re-initializing after timeout');
            reinitializeAllFeatures();
        }
    }, 5000);
}

// console.log('📦 olt.min.js loaded successfully');
// console.log('🔄 Features available:', Object.keys(FEATURE_TOGGLES).join(', '));