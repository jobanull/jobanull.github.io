let arabicWords = [
//   ['ア', 'a'], ['イ', 'i'], ['ウ', 'u'], ['エ', 'e'], ['オ', 'o']
//   ['カ', 'ka'], ['キ', 'ki'], ['ク', 'ku'], ['ケ', 'ke'], ['コ', 'ko'],
  ['サ', 'sa'], ['シ', 'shi'], ['ス', 'su'], ['セ', 'se'], ['ソ', 'so']
  ['タ', 'ta'], ['チ', 'chi'], ['ツ', 'tsu'], ['テ', 'te'], ['ト', 'to'],
//   ['ナ', 'na'], ['ニ', 'ni'], ['ヌ', 'nu'], ['ネ', 'ne'], ['ノ', 'no'],
//   ['ハ', 'ha'], ['ヒ', 'hi'], ['フ', 'fu'], ['ヘ', 'he'], ['ホ', 'ho'],
//   ['マ', 'ma'], ['ミ', 'mi'], ['ム', 'mu'], ['メ', 'me'], ['モ', 'mo'],
//   ['ヤ', 'ya'], ['ユ', 'yu'], ['ヨ', 'yo'],
//   ['ラ', 'ra'], ['リ', 'ri'], ['ル', 'ru'], ['レ', 're'], ['ロ', 'ro'],
//   ['ワ', 'wa'], ['ヲ', 'wo'],
//   ['ン', 'n']
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
