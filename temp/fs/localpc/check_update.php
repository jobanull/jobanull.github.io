<?php
// check_update.php - Manual check update dari GitHub

$githubRawUrl = 'https://ikhdanjoban.vercel.app/nontech/fs/index.txt';
$localCacheFile = __DIR__ . '/cache/index.html';
$cacheDir = __DIR__ . '/cache';

if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

function fetchFromGithub($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200 && $response) {
        return $response;
    }
    return false;
}

$content = fetchFromGithub($githubRawUrl);

if ($content !== false) {
    // Simpan ke cache
    file_put_contents($localCacheFile, $content);
    file_put_contents($cacheDir . '/last_update.txt', time());
    
    echo "✅ Update berhasil! Konten diupdate dari GitHub.\n";
    echo "Waktu update: " . date('Y-m-d H:i:s') . "\n";
} else {
    echo "❌ Gagal mengambil konten dari GitHub.\n";
}
?>