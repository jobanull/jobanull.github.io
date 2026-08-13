
<?php

$githubRawUrl = 'https://ikhdanjoban.vercel.app/nontech/fs/topull/index.txt';
$localCacheFile = __DIR__ . '/cache/index.html';
$cacheDir = __DIR__ . '/cache';

// Buat folder cache jika belum ada
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

// Fungsi untuk mendapatkan konten dari GitHub
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

// Fungsi untuk mendapatkan hash/konten
function getFileHash($content) {
    return md5($content);
}

// Cek apakah perlu update
function needUpdate($content, $cacheFile) {
    if (!file_exists($cacheFile)) {
        return true; // Belum ada cache
    }
    
    $currentHash = getFileHash($content);
    $cachedContent = file_get_contents($cacheFile);
    $cachedHash = getFileHash($cachedContent);
    
    return $currentHash !== $cachedHash;
}

// Fungsi untuk mengecek apakah sudah 10 menit sejak update terakhir
function shouldCheckUpdate($lastUpdateFile) {
    if (!file_exists($lastUpdateFile)) {
        return true;
    }
    
    $lastUpdate = (int)file_get_contents($lastUpdateFile);
    $timeDiff = time() - $lastUpdate;
    
    // Cek setiap 10 menit (600 detik)
    return $timeDiff >= 30;
}

// File untuk menyimpan waktu update terakhir
$lastUpdateFile = $cacheDir . '/last_update.txt';

// Variable untuk menyimpan apakah konten diambil dari cache atau GitHub
$source = 'cache';
$content = '';

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
            $content = $githubContent;
            $source = 'github_update';
            
            // Log perubahan
            $logFile = $cacheDir . '/update_log.txt';
            $logEntry = date('Y-m-d H:i:s') . " - Update dari GitHub\n";
            file_put_contents($logFile, $logEntry, FILE_APPEND);
        } else {
            // Tidak ada perubahan, gunakan cache
            if (file_exists($localCacheFile)) {
                $content = file_get_contents($localCacheFile);
                $source = 'cache_no_change';
            }
            // Update timestamp terakhir check
            file_put_contents($lastUpdateFile, time());
        }
    } else {
        // Gagal ambil dari GitHub, gunakan cache
        if (file_exists($localCacheFile)) {
            $content = file_get_contents($localCacheFile);
            $source = 'cache_fallback';
        }
    }
} else {
    // Belum waktunya update, gunakan cache
    if (file_exists($localCacheFile)) {
        $content = file_get_contents($localCacheFile);
        $source = 'cache_timed';
    }
}

// Jika masih tidak ada konten, tampilkan pesan error
if (empty($content)) {
    // Tampilkan konten default
    ?>
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>FS Documentation - Loading...</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                padding: 50px; 
                text-align: center;
                background: #f5f5f5;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .loading {
                color: #1976d2;
            }
            .error {
                color: #d32f2f;
            }
            .info {
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="loading">⏳ Memuat Konten...</h1>
            <p>Konten sedang dimuat. Silahkan refresh jika tidak muncul.</p>
            <p class="info">
                <small>Source: <?php echo htmlspecialchars($source); ?></small>
            </p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Tampilkan konten
echo $content;

// Tambahkan info debugging (opsional, bisa dihapus)
if (isset($_GET['debug'])) {
    echo "<!-- Source: $source -->";
    echo "<!-- Last Check: " . date('Y-m-d H:i:s', file_exists($lastUpdateFile) ? (int)file_get_contents($lastUpdateFile) : 0) . " -->";
}
?>


