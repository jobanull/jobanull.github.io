let japaneseWords = [
    ['さくら', 'sakura', 'bunga sakura'],
    ['ねこ', 'neko', 'kucing'],
    ['いぬ', 'inu', 'anjing'],
    ['みず', 'mizu', 'air'],
    ['あめ', 'ame', 'hujan'],
    ['かぜ', 'kaze', 'angin'],
    ['ひ', 'hi', 'cahaya'],
    ['つき', 'tsuki', 'bulan'],
    ['そら', 'sora', 'langit'],
    ['はな', 'hana', 'bunga'],
    ['くさ', 'kusa', 'rumput'],
    ['き', 'ki', 'pohon'],
    ['やま', 'yama', 'gunung'],
    ['かわ', 'kawa', 'sungai'],
    ['うみ', 'umi', 'laut'],
    ['しま', 'shima', 'pulau'],
    ['もり', 'mori', 'hutan'],
    ['たべる', 'taberu', 'makan'],
    ['のむ', 'nomu', 'minum'],
    ['ねる', 'neru', 'tidur'],
    ['おきる', 'okiru', 'bangun'],
    ['あるく', 'aruku', 'berjalan'],
    ['はしる', 'hashiru', 'berlari'],
    ['かう', 'kau', 'membeli'],
    ['うる', 'uru', 'menjual'],
    ['いう', 'iu', 'mengatakan'],
    ['きく', 'kiku', 'mendengar / bertanya'],
    ['みる', 'miru', 'melihat / menonton'],
    ['よむ', 'yomu', 'membaca'],
    ['かく', 'kaku', 'menulis'],
    ['はなす', 'hanasu', 'berbicara'],
    ['あう', 'au', 'bertemu'],
    ['いく', 'iku', 'pergi'],
    ['くる', 'kuru', 'datang'],
    ['かえる', 'kaeru', 'pulang / kembali'],
    ['たつ', 'tatsu', 'berdiri'],
    ['すわる', 'suwaru', 'duduk'],
    ['およぐ', 'oyogu', 'berenang'],
    ['しぬ', 'shinu', 'mati'],
    ['いきる', 'ikiru', 'hidup'],
    ['あそぶ', 'asobu', 'bermain'],
    ['まつ', 'matsu', 'menunggu'],
    ['うた', 'uta', 'lagu'],
    ['え', 'e', 'gambar / lukisan'],
    ['おと', 'oto', 'suara'],
    ['こえ', 'koe', 'suara (manusia)'],
    ['かお', 'kao', 'wajah'],
    ['め', 'me', 'mata'],
    ['みみ', 'mimi', 'telinga'],
    ['くち', 'kuchi', 'mulut'],
    ['は', 'ha', 'gigi'],
    ['て', 'te', 'tangan'],
    ['あし', 'ashi', 'kaki'],
    ['ひざ', 'hiza', 'lutut'],
    ['せなか', 'senaka', 'punggung'],
    ['むね', 'mune', 'dada'],
    ['かた', 'kata', 'bahu'],
    ['て', 'te', 'tangan'],
    ['ゆび', 'yubi', 'jari'],
    ['こども', 'kodomo', 'anak'],
    ['おとな', 'otona', 'orang dewasa'],
    ['ともだち', 'tomodachi', 'teman'],
    ['いえ', 'ie', 'rumah'],
    ['へや', 'heya', 'kamar'],
    ['だいどころ', 'daidokoro', 'dapur'],
    ['おふろ', 'ofuro', 'bak mandi'],
    ['いす', 'isu', 'kursi'],
    ['つくえ', 'tsukue', 'meja'],
    ['まど', 'mado', 'jendela'],
    ['とびら', 'tobira', 'pintu'],
    ['かさ', 'kasa', 'payung'],
    ['くるま', 'kuruma', 'mobil'],
    ['じてんしゃ', 'jitensha', 'sepeda'],
    ['でんしゃ', 'densha', 'kereta'],
    ['くうこう', 'kuukou', 'bandara'],
    ['えき', 'eki', 'stasiun'],
    ['くうき', 'kuuki', 'udara'],
    ['ひ', 'hi', 'matahari'],
    ['つち', 'tsuchi', 'tanah'],
    ['みち', 'michi', 'jalan'],
    ['てんき', 'tenki', 'cuaca'],
    ['あさ', 'asa', 'pagi'],
    ['ひる', 'hiru', 'siang'],
    ['よる', 'yoru', 'malam'],
    ['ばん', 'ban', 'malam (lebih spesifik)'],
    ['きょう', 'kyou', 'hari ini'],
    ['あした', 'ashita', 'besok'],
    ['きのう', 'kinou', 'kemarin'],
    ['せんせい', 'sensei', 'guru'],
    ['がくせい', 'gakusei', 'murid / mahasiswa'],
    ['ほん', 'hon', 'buku'],
    ['ざっし', 'zasshi', 'majalah'],
    ['しんぶん', 'shinbun', 'koran'],
    ['え', 'e', 'gambar'],
    ['しゃしん', 'shashin', 'foto'],
    ['じかん', 'jikan', 'waktu'],
    ['とき', 'toki', 'saat / waktu'],
    ['こと', 'koto', 'hal / urusan'],
    ['もの', 'mono', 'benda / barang'],
    ['こころ', 'kokoro', 'hati / perasaan'],
    ['いのち', 'inochi', 'nyawa / kehidupan'],
    ['ちきゅう', 'chikyuu', 'bumi'],
    ['うたう', 'utau', 'bernyanyi'],
    ['おどる', 'odoru', 'menari'],
    ['かく', 'kaku', 'menulis / menggambar'],
    ['よむ', 'yomu', 'membaca'],
    ['みる', 'miru', 'melihat / menonton'],
    ['きく', 'kiku', 'mendengar / bertanya'],
    ['はなす', 'hanasu', 'berbicara'],
    ['いう', 'iu', 'mengatakan'],
    ['かう', 'kau', 'membeli'],
    ['うる', 'uru', 'menjual'],
    ['あるく', 'aruku', 'berjalan'],
    ['はしる', 'hashiru', 'berlari'],
    ['のる', 'noru', 'naik (kendaraan)'],
    ['おりる', 'oriru', 'turun (kendaraan)'],
    ['あそぶ', 'asobu', 'bermain'],
    ['まつ', 'matsu', 'menunggu'],
    ['いく', 'iku', 'pergi'],
    ['くる', 'kuru', 'datang'],
    ['かえる', 'kaeru', 'pulang / kembali'],
    ['ねる', 'neru', 'tidur'],
    ['おきる', 'okiru', 'bangun'],
    ['あける', 'akeru', 'membuka'],
    ['しめる', 'shimeru', 'menutup'],
    ['いれる', 'ireru', 'memasukkan'],
    ['だす', 'dasu', 'mengeluarkan'],
    ['つかう', 'tsukau', 'memakai / menggunakan'],
    ['つくる', 'tsukuru', 'membuat'],
    ['なおす', 'naosu', 'memperbaiki / menyembuhkan'],
    ['みせる', 'miseru', 'menunjukkan'],
    ['もつ', 'motsu', 'memegang / membawa'],
    ['おくる', 'okuru', 'mengirim'],
    ['あげる', 'ageru', 'memberi'],
    ['もらう', 'morau', 'menerima'],
    ['かりる', 'kariru', 'meminjam'],
    ['かえす', 'kaesu', 'mengembalikan'],
    ['まがる', 'magaru', 'berbelok'],
    ['でる', 'deru', 'keluar'],
    ['はいる', 'hairu', 'masuk'],
    ['のぼる', 'noboru', 'naik (tangga / gunung)'],
    ['おりる', 'oriru', 'turun (tangga / gunung)'],
    ['さがす', 'sagasu', 'mencari'],
    ['みつける', 'mitsukeru', 'menemukan'],
    ['あらう', 'arau', 'mencuci'],
    ['きる', 'kiru', 'memakai (baju)'],
    ['ぬぐ', 'nugu', 'melepas (baju / sepatu)'],
    ['すわる', 'suwaru', 'duduk'],
    ['たつ', 'tatsu', 'berdiri'],
    ['いそぐ', 'isogu', 'terburu-buru / cepat'],
    ['とぶ', 'tobu', 'melompat / terbang'],
    ['およぐ', 'oyogu', 'berenang'],
    ['しぬ', 'shinu', 'mati'],
    ['いきる', 'ikiru', 'hidup'],
    ['いくつ', 'ikutsu', 'berapa (jumlah)'],
    ['いくねん', 'ikunen', 'berapa tahun'],
    ['なに', 'nani', 'apa'],
    ['どこ', 'doko', 'di mana'],
    ['いつ', 'itsu', 'kapan'],
    ['だれ', 'dare', 'siapa'],
    ['どの', 'dono', 'yang mana'],
    ['どれ', 'dore', 'yang mana (dari beberapa)'],
    ['なぜ', 'naze', 'mengapa'],
    ['どうして', 'doushite', 'mengapa / bagaimana'],
    ['どのくらい', 'dono kurai', 'berapa lama / seberapa banyak'],
    ['いくら', 'ikura', 'berapa harga'],
    ['はやい', 'hayai', 'cepat / pagi'],
    ['おそい', 'osoi', 'lambat / sore'],
    ['おおきい', 'ookii', 'besar'],
    ['ちいさい', 'chiisai', 'kecil'],
    ['ながい', 'nagai', 'panjang'],
    ['みじかい', 'mijikai', 'pendek'],
    ['あつい', 'atsui', 'panas / tebal'],
    ['さむい', 'samui', 'dingin (cuaca)'],
    ['つめたい', 'tsumetai', 'dingin (benda)'],
    ['あたたかい', 'atatakai', 'hangat'],
    ['ひろい', 'hiroi', 'luas'],
    ['せまい', 'semai', 'sempit'],
    ['たかい', 'takai', 'tinggi / mahal'],
    ['ひくい', 'hikui', 'rendah'],
    ['いい', 'ii', 'baik / bagus'],
    ['わるい', 'warui', 'buruk'],
    ['たのしい', 'tanoshii', 'menyenangkan'],
    ['かなしい', 'kanashii', 'sedih'],
    ['うれしい', 'ureshii', 'senang'],
    ['おいしい', 'oishii', 'enak'],
    ['まずい', 'mazui', 'tidak enak'],
    ['あかるい', 'akarui', 'cerah / terang'],
    ['くらい', 'kurai', 'gelap'],
    ['しずか', 'shizuka', 'tenang / sepi'],
    ['うるさい', 'urusai', 'berisik / cerewet'],
    ['はやい', 'hayai', 'cepat'],
    ['おそい', 'osoi', 'lambat'],
    ['つよい', 'tsuyoi', 'kuat'],
    ['よわい', 'yowai', 'lemah'],
    ['かるい', 'karui', 'ringan'],
    ['おもい', 'omoi', 'berat'],
    ['きれい', 'kirei', 'bersih / cantik'],
    ['きたない', 'kitanai', 'kotor'],
    ['しろい', 'shiroi', 'putih'],
    ['くろい', 'kuroi', 'hitam'],
    ['あかい', 'akai', 'merah'],
    ['あおい', 'aoi', 'biru'],
    ['みどり', 'midori', 'hijau'],
    ['きいろ', 'kiiro', 'kuning'],
    ['ちゃいろ', 'chairo', 'coklat']
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
