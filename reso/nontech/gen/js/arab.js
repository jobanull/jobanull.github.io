let arabicWords = [
    ['بَيْتٌ', 'rumah'],
    ['مَسْجِدٌ', 'masjid'],
    ['مَدْرَسَةٌ', 'sekolah'],
    ['بَابٌ', 'pintu'],
    ['كِتَابٌ', 'buku'],
    ['قَلَمٌ', 'pulpen'],
    ['سَرِيرٌ', 'tempat tidur'],
    ['كُرْسِيٌّ', 'kursi'],
    ['مِفْتَاحٌ', 'kunci'],
    ['مَاءٌ', 'air'],
    ['رَجُلٌ', 'laki-laki'],
    ['وَلَدٌ', 'anak laki-laki'],
    ['طَالِبٌ', 'murid (laki-laki)'],
    ['أُسْتَاذٌ', 'guru (laki-laki)'],
    ['مَدَرِّسٌ', 'pengajar'],
    ['إِمَامٌ', 'imam'],
    ['طَبِيبٌ', 'dokter (laki-laki)'],
    ['بِنْتٌ', 'anak perempuan'],
    ['طَالِبَةٌ', 'murid (perempuan)'],
    ['أُسْتَاذَةٌ', 'guru (perempuan)'],
    ['طَبِيبَةٌ', 'dokter (perempuan)'],
    ['هَذَا', 'ini (laki-laki / mudzakkar)'],
    ['هَذِهِ', 'ini (perempuan / mu"annats)'],
    ['ذَلِكَ', 'itu (laki-laki / mudzakkar)'],
    ['تِلْكَ', 'itu (perempuan / mu"annats)'],
    ['سُوقٌ', 'pasar'],
    ['مَطْبَخٌ', 'dapur'],
    ['غُرْفَةٌ', 'kamar'],
    ['حَمَّامٌ', 'kamar mandi'],
    ['مِرْحَاضٌ', 'toilet'],
    ['أَمَامَ', 'di depan'],
    ['خَلْفَ', 'di belakang'],
    ['تَحْتَ', 'di bawah'],
    ['فَوْقَ', 'di atas'],
    ['دَاخِلَ', 'di dalam'],
    ['خَارِجَ', 'di luar'],
    ['مَنْ', 'siapa'],
    ['مَا', 'apa'],
    ['أَيْنَ', 'di mana'],
    ['هَلْ', 'apakah (kata tanya “ya/tidak”)'],
    ['جَلَسَ', 'duduk'],
    ['وَقَفَ', 'berdiri'],
    ['خَرَجَ', 'keluar'],
    ['دَخَلَ', 'masuk'],
    ['ذَهَبَ', 'pergi'],
    ['جَاءَ', 'datang'],
    ['شَرِبَ', 'minum'],
    ['أَكَلَ', 'makan'],
    ['رِجَالٌ', 'laki-laki (jamak)'],
    ['أَوْلَادٌ', 'anak-anak laki-laki'],
    ['طُلَّابٌ', 'para murid (laki-laki)'],
    ['أَسَاتِذَةٌ', 'para guru (laki-laki)'],
    ['أَطِبَّاءُ', 'para dokter (laki-laki)'],
    ['بُيُوتٌ', 'rumah-rumah'],
    ['مَسَاجِدُ', 'masjid-masjid'],
    ['مَدَارِسُ', 'sekolah-sekolah'],
    ['أَبْوَابٌ', 'pintu-pintu'],
    ['كُتُبٌ', 'buku-buku'],
    ['أَقْلَامٌ', 'pena-pena'],
    ['بَنَاتٌ', 'anak-anak perempuan'],
    ['طَالِبَاتٌ', 'murid-murid perempuan'],
    ['مُدَرِّسَاتٌ', 'guru-guru perempuan'],
    ['طَبِيبَاتٌ', 'dokter-dokter perempuan'],
    ['سَيَّارَاتٌ', 'mobil-mobil'],
    ['سَاعَاتٌ', 'jam-jam'],
    ['غُرَفٌ', 'kamar-kamar'],
    ['لِمَنْ', 'milik siapa'],
    ['مَعَ مَنْ', 'bersama siapa'],
    ['مَاذَا', 'apa (untuk perbuatan)'],
    ['فِي', 'di / dalam'],
    ['عَلَى', 'di atas'],
    ['إِلَى', 'ke'],
    ['مِنْ', 'dari']
];


// --- Fungsi acak array ---
function acakArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Acak arabicWords
acakArray(arabicWords);

// Isi teks h3 dengan kata
const allElements = document.querySelectorAll('h3');
allElements.forEach((el, i) => {
    if (arabicWords[i]) {
        el.textContent = arabicWords[i][0];
        el.dataset.translation = arabicWords[i][1]; // simpan arti di data attribute
    }
});

// --- Tooltip Dinamis (muncul di kanan cursor) ---
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

document.querySelectorAll('h3').forEach(item => {
    item.addEventListener('mouseenter', e => {
        tooltip.textContent = item.dataset.translation;
        tooltip.style.opacity = '1';
    });
    item.addEventListener('mousemove', e => {
        tooltip.style.left = e.pageX + 15 + 'px'; // posisi kanan cursor
        tooltip.style.top = e.pageY + 10 + 'px';
    });
    item.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
});
