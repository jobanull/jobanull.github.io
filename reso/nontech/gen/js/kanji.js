let japaneseWords = [
  ['一', 'ichi', 'satu'],
  ['二', 'ni', 'dua'],
  ['三', 'san', 'tiga'],
  ['四', 'shi / yon', 'empat'],
  ['五', 'go', 'lima'],
  ['六', 'roku', 'enam'],
  ['七', 'shichi / nana', 'tujuh'],
  ['八', 'hachi', 'delapan'],
  ['九', 'kyuu / ku', 'sembilan'],
  ['十', 'juu', 'sepuluh'],

  ['日', 'nichi / hi', 'hari / matahari'],
  ['月', 'getsu / tsuki', 'bulan (month/moon)'],
  ['火', 'ka / hi', 'api'],
  ['水', 'sui / mizu', 'air'],
  ['木', 'moku / ki', 'pohon / kayu'],
  ['金', 'kin / kane', 'emas / uang'],
  ['土', 'do / tsuchi', 'tanah'],
  ['山', 'san / yama', 'gunung'],
  ['川', 'sen / kawa', 'sungai'],
  ['田', 'den / ta', 'sawah / ladang'],

  ['人', 'jin / hito', 'orang'],
  ['口', 'kou / kuchi', 'mulut'],
  ['目', 'moku / me', 'mata'],
  ['耳', 'ji / mimi', 'telinga'],
  ['手', 'shu / te', 'tangan'],
  ['足', 'soku / ashi', 'kaki'],
  ['力', 'riki / chikara', 'kekuatan'],
  ['心', 'shin / kokoro', 'hati / perasaan'],
  ['雨', 'u / ame', 'hujan'],
  ['気', 'ki', 'energi / semangat'],

  ['空', 'kuu / sora', 'langit / udara'],
  ['花', 'ka / hana', 'bunga'],
  ['草', 'sou / kusa', 'rumput'],
  ['虫', 'chuu / mushi', 'serangga'],
  ['犬', 'ken / inu', 'anjing'],
  ['猫', 'byou / neko', 'kucing'],
  ['魚', 'gyo / sakana', 'ikan'],
  ['鳥', 'chou / tori', 'burung'],
  ['名', 'mei / na', 'nama'],
  ['年', 'nen / toshi', 'tahun'],

  ['早', 'sou / haya', 'cepat / pagi'],
  ['学', 'gaku / mana', 'belajar'],
  ['校', 'kou', 'sekolah'],
  ['先', 'sen / saki', 'sebelumnya / depan'],
  ['生', 'sei / nama', 'hidup / lahir'],
  ['大', 'dai / oo', 'besar'],
  ['小', 'shou / chiisai', 'kecil'],
  ['中', 'chuu / naka', 'tengah / dalam'],
  ['上', 'jou / ue', 'atas'],
  ['下', 'ka / shita', 'bawah']
];


// --- Fungsi acak array ---
function acakArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

acakArray(japaneseWords);

// Isi teks h3 dengan kata Jepang
const allElements = document.querySelectorAll('h3');
allElements.forEach((el, i) => {
  if (japaneseWords[i]) {
    el.textContent = japaneseWords[i][0]; // Bahasa Jepang
    el.dataset.romaji = japaneseWords[i][1]; // simpan romaji
    el.dataset.meaning = japaneseWords[i][2]; // simpan arti

    // Tambahkan elemen arti (hidden dulu)
    const meaning = document.createElement('div');
    meaning.className = 'meaning';
    meaning.textContent = japaneseWords[i][2];
    el.appendChild(meaning);
  }
});

// --- Tooltip Dinamis (muncul di kanan cursor) ---
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

document.querySelectorAll('h3').forEach(item => {
  item.addEventListener('mouseenter', e => {
    tooltip.textContent = item.dataset.romaji; // tampilkan romaji
    tooltip.style.opacity = '1';
  });

  item.addEventListener('mousemove', e => {
    tooltip.style.left = e.pageX + 15 + 'px'; // posisi kanan cursor
    tooltip.style.top = e.pageY + 10 + 'px';
  });

  item.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });

  // Klik = toggle arti Bahasa Indonesia
  item.addEventListener('click', () => {
    const meaningEl = item.querySelector('.meaning');
    if (meaningEl) {
      meaningEl.style.display =
        meaningEl.style.display === 'block' ? 'none' : 'block';
    }
  });
});
