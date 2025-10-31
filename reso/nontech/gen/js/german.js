let germanWords = [
    ['das Mädchen', 'gadis'],
    ['die Mädchen', 'gadis-gadis'],
    ['das Buch', 'buku'],
    ['die Bücher', 'buku-buku'],
    ['die Mutter', 'ibu'],
    ['die Mütter', 'ibu-ibu'],
    ['der Vater', 'ayah'],
    ['die Väter', 'ayah-ayah'],
    ['das Haus', 'rumah'],
    ['die Häuser', 'rumah-rumah'],
    ['der Stuhl', 'kursi'],
    ['die Stühle', 'kursi-kursi'],
    ['der Baum', 'pohon'],
    ['die Bäume', 'pohon-pohon'],
    ['das Auto', 'mobil'],
    ['die Autos', 'mobil-mobil'],
    ['die Katze', 'kucing'],
    ['die Katzen', 'kucing-kucing'],
    ['die Straße', 'jalan'],
    ['die Straßen', 'jalan-jalan'],
    ['das Buchstabieren', 'pengejaan'],               // das → netral (kata benda dari verb)
    ['hat buchstabiert', 'telah mengeja'],            // bentuk perfekt (tanpa artikel, verba)
    ['die Zahlen', 'angka-angka'],                    // die → plural
    ['das Handy', 'ponsel'],                          // das → netral
    ['das Handtuch', 'handuk'],                       // das → netral
    ['genau', 'tepat / benar'],                       // adverb, tanpa artikel
    ['wie', 'bagaimana']                              // konjungsi / kata tanya, tanpa artikel
    ['der Mann', 'pria / laki-laki'],           // der → maskulin
    ['geht’s', 'bagaimana kabarnya?)'], // bentuk singkat dari "geht es"
    ['euch', 'kalian (bentuk dativ dari ihr)'], // kata ganti
    ['egal', 'tidak apa-apa / tidak peduli'],   // adjektiva
    ['das Jubiläum', 'perayaan / hari jadi']    // das → netral
    ['faul', 'malas'],                              // adjektiva → tidak pakai artikel
    ['der Freund', 'teman laki-laki / pacar'],      // der → maskulin
    ['das Bier', 'bir'],                            // das → netral
    ['der Kaiser', 'kaisar / raja'],                // der → maskulin
    ['die Information', 'informasi'],               // die → feminin
    ['genial', 'hebat / jenius'],                   // adjektiva
    ['ideal', 'ideal / sempurna']                   // adjektiva
    ['sehr', 'sangat'],                             // adverb → tanpa artikel
    ['schnell', 'cepat'],                           // adjektiva
    ['der Dschungel', 'hutan rimba'],               // der → maskulin
    ['der Spiegel', 'cermin'],                      // der → maskulin
    ['der Stau', 'macet / kemacetan'],              // der → maskulin
    ['zwei', 'dua'],                                // angka → tanpa artikel
    ['die Zwiebeln', 'bawang-bawang'],              // die → plural dari die Zwiebel
    ['die Maßnahme', 'tindakan / langkah']          // die → feminin
    ['der Spaß', 'kesenangan / hal yang lucu'],       // der → maskulin
    ['heißen', 'bernama / disebut'],                  // verba (tanpa artikel)
    ['süß', 'manis'],                                 // adjektiva (perbaikan dari "subß")
    ['Tschüss', 'selamat tinggal / dadah'],           // interjeksi (tanpa artikel)
    ['dass', 'bahwa'],                                // konjungsi (tanpa artikel)
    ['essen', 'makan'],                               // verba (tanpa artikel)
    ['das Wasser', 'air'],                            // das → netral
    ['muss', 'harus'],                                // modalverb (tanpa artikel)
        ['schicken', 'mengirim'],                          // verba → tanpa artikel
    ['zwischen', 'di antara / antara'],                // preposisi → tanpa artikel
    ['bestimmte', 'tertentu'],                         // adjektiva
    ['verwirrt', 'bingung'],                           // adjektiva / partizip II
    ['das Frühjahr', 'musim semi'],                    // das → netral
    ['das Jahr', 'tahun'],                              // das → netral
       ['die Kindergärten', 'taman kanak-kanak (jamak)'],   // die → plural dari der Kindergarten
    ['der Kindergärtner', 'guru TK (laki-laki)'],        // der → maskulin
    ['die Kindergärtnerin', 'guru TK (perempuan)'],      // die → feminin
    ['die Beglaubigung', 'pengesahan / legalisasi'],      // die → feminin
    ['die Zeitung', 'koran / surat kabar'],               // die → feminin
    ['die Freundschaft', 'persahabatan']                  // die → feminin
       ['die Mannschaft', 'tim / regu'],                    // die → feminin
    ['das Gänseblümchen', 'bunga aster / daisy'],        // das → netral (akhiran -chen)
    ['die Sprache', 'bahasa'],                           // die → feminin
    ['die Finsternis', 'gerhana / kegelapan'],           // die → feminin (akhiran -nis)
    ['die Dunkelheit', 'kegelapan'],                     // die → feminin (akhiran -heit)
    ['die Mondfinsternis', 'gerhana bulan']              // die → feminin (berdasarkan kata dasar Finsternis)
        ['der Hase', 'kelinci'],                           // der → maskulin
    ['das Kaninchen', 'kelinci kecil'],                 // das → netral (akhiran -chen)
    ['der Affe', 'monyet'],                            // der → maskulin
    ['das Äffchen', 'anak monyet / monyet kecil'],     // das → netral (akhiran -chen)
    ['die Maus', 'tikus'],                             // die → feminin
    ['das Mäuschen', 'tikus kecil / sayang (panggilan)'], // das → netral (akhiran -chen)
    ['die Farbe', 'warna'],                            // die → feminin
    ['bin', 'saya adalah / aku (dari sein – ich bin)'], // verba (tanpa artikel)
    ['die Studentin', 'mahasiswa perempuan']            // die → feminin (akhiran -in)
        ['ich', 'saya / aku'],                            // pronomen → tanpa artikel
    ['habe', 'memiliki (saya punya)'],                // verba (dari haben) → tanpa artikel
    ['eine', 'sebuah / satu (feminin / akusatif)'],   // artikel tak tentu feminin
    ['die Lampe', 'lampu'],                           // die → feminin
    ['du', 'kamu'],                                   // pronomen → tanpa artikel
    ['hast', 'memiliki (kamu punya)'],                // verba (dari haben) → tanpa artikel
    ['das Handy', 'ponsel'],                          // das → netral
    ['ist', 'adalah / (dia) adalah'],                 // verba (dari sein) → tanpa artikel
       ['mein', 'milikku / punyaku'],                         // possessivartikel → tanpa artikel
    ['es', 'itu / dia (netral)'],                          // pronomen → tanpa artikel
    ['klingelt', 'berbunyi (bel / telepon)'],              // verba → tanpa artikel
    ['keine', 'tidak ada / bukan (bentuk feminin/plural)'], // artikel negatif
    ['die Antwort', 'jawaban'],                            // die → feminin
    ['abbrechen', 'batalkan / hentikan'],                  // verba (infinitiv)
    ['die Nachricht', 'pesan'],                            // die → feminin
    ['erneut', 'lagi / sekali lagi'],                      // adverb
    ['anrufen', 'menelepon'],                              // verba (infinitiv)
    ['zuletzt', 'terakhir kali / paling akhir'],            // adverb
    ['heute', 'hari ini'],                                 // adverb
    ['der Sprachanruf', 'panggilan suara'],                // der → maskulin
    ['wahr', 'benar / nyata'],                             // adjektiva
    ['aus', 'dari / keluar / mati'],                       // preposisi
    ['die Bildung', 'pendidikan / pembentukan'],           // die → feminin
    ['bist du', 'apakah kamu / kamu (adalah)'],            // bentuk dari sein (du bist)
    ['aufgestanden', 'bangun (partizip II dari aufstehen)'], // verba → tanpa artikel
    ['schon', 'sudah'],                                    // adverb
        ['die Begrüßungen', 'salam-salam / ucapan sapaan'],         // die → plural dari die Begrüßung
    ['guten', 'baik (bentuk akusatif dari gut, digunakan dalam salam)'], 
    ['guten Tag', 'selamat siang / halo'],
    ['Morgen', 'pagi'],                                         // bisa maskulin, tetapi sering digunakan tanpa artikel
    ['guten Morgen', 'selamat pagi'],
    ['Abend', 'malam / sore'],                                  // der → maskulin
    ['guten Abend', 'selamat malam / selamat sore'],
    ['Nacht', 'malam'],                                         // die → feminin
    ['auf Wiedersehen', 'sampai jumpa lagi'],                   // frasa → tanpa artikel
    ['Ciao', 'halo / sampai jumpa'],                            // serapan dari Italia
    ['bis später', 'sampai nanti'],
    ['bis morgen', 'sampai besok'],
    ['danke', 'terima kasih'],
    ['bitte', 'tolong / silakan / sama-sama'],
    ['Entschuldigung', 'maaf / permisi'],                       // die Entschuldigung → feminin
    ['wie geht es dir', 'apa kabar (untuk kamu)'],
    ['wie geht es Ihnen', 'apa kabar (untuk Anda)'],
    ['gut', 'baik'],
    ['schlecht', 'buruk / tidak baik'],
    ['und dir?', 'dan kamu?'],
       ['wo', 'di mana'],                                        // adverb tanya
    ['kommst du her', 'kamu berasal dari mana'],              // frasa
    ['komme', 'datang / berasal'],                            // verba (ich komme)
    ['aus', 'dari / keluar'],                                 // preposisi
    ['auch', 'juga'],                                         // adverb
    ['witzig', 'lucu'],                                       // adjektiva
    ['müde', 'lelah / capek'],                               // adjektiva
    ['kalt', 'dingin'],                                       // adjektiva
    ['warm', 'hangat'],                                       // adjektiva
    ['mir', 'aku / kepadaku (dativ dari ich)'],              // pronomen
    ['Hunger', 'lapar'],                                      // der → maskulin (tanpa artikel dalam ekspresi “Ich habe Hunger”)
    ['Durst', 'haus / kehausan'],                             // der → maskulin
    ['haben', 'memiliki / mempunyai'],                        // verba (infinitiv)
    ['satt', 'kenyang'],                                      // adjektiva
    ['das Klo', 'toilet / kamar kecil'],                      // das → netral
    ['die Toilette', 'toilet / WC'],                          // die → feminin
    ['aufs', 'ke / pada (gabungan dari auf das)'],            // preposisi + artikel
    ['suche', 'mencari'],                                     // verba (ich suche)
    ['darf', 'boleh / diizinkan'],                            // modalverb (ich darf)
    ['kurz', 'pendek / sebentar'],                            // adjektiva
    ['ihre', 'milik Anda / milik dia (feminin/plural)'],      // possessivartikel
    ['benutzen', 'menggunakan'],                              // verba (infinitiv)
    ['heiß', 'panas'],                                        // adjektiva
    ['langweilig', 'membosankan'],                            // adjektiva
    ['glücklich', 'bahagia'],                                 // adjektiva
    ['traurig', 'sedih'],                                     // adjektiva
    ['der Hund', 'anjing'],                                   // der → maskulin
    ['viele', 'banyak (jamak)'],                              // quantor
    ['vieles', 'banyak hal'],                                 // pronomen
    ['wir', 'kami / kita'],                                   // pronomen
    ['möchten', 'ingin / mau'],                               // modalverb
    ['gerne', 'dengan senang hati'],                          // adverb
    ['einladen', 'mengundang'],                               // verba (infinitiv)
    ['das Mitglied', 'anggota'],                              // das → netral
        ['von', 'dari / oleh'],                                   // preposisi
    ['werden', 'menjadi / akan'],                             // verba bantu (auxiliary)
    ['als', 'sebagai / ketika / daripada'],                   // konjungsi
    ['könnt', 'bisa / dapat (kalian bisa)'],                  // modalverb (ihr könnt)
    ['ihr', 'kalian / milik kalian'],                         // pronomen / possessivartikel
    ['noch', 'masih / lagi'],                                 // adverb
    ['intensiver', 'lebih intens / lebih mendalam'],          // komparatif dari “intensiv”
    ['uns', 'kami / kita (dativ/akusativ dari wir)'],         // pronomen
    ['denn', 'sebab / karena / lalu'],                        // konjungsi / partikel
    ['bekommt', 'mendapat / menerima'],                       // verba (er/sie/es bekommt)
    ['zu', 'ke / untuk'],                                     // preposisi
    ['jedem', 'setiap (dativ dari jeder)'],                   // artikel tak tentu dalam dativ
    ['die Übungen', 'latihan-latihan'],                       // die → plural dari die Übung
    ['um', 'untuk / sekitar'],                                // preposisi / konjungsi
    ['euer', 'milik kalian'],                                 // possessivartikel
    ['verbessern', 'memperbaiki / meningkatkan'],             // verba (infinitiv)
    ['wenn', 'jika / ketika'],                                // konjungsi
    ['ausprobieren', 'mencoba / menguji'],                    // verba (infinitiv)
    ['möchtet', 'ingin (kalian ingin)'],                      // modalverb (ihr möchtet)
    ['dann', 'maka / kemudian'],                              // adverb
    ['geht', 'pergi / berjalan / berfungsi'],                 // verba (er/sie/es geht)
    ['mal', 'sekali / coba / partikel penghalus'],            // partikel
    ['nur', 'hanya / saja'],                                  // adverb
    ['nicht', 'tidak / bukan'],                               // negasi
    ['tolle', 'bagus / hebat / keren'],                       // adjektiva
    ['Dinge', 'benda-benda / hal-hal'],                       // die → plural dari das Ding
    ['zum', 'untuk / ke (gabungan dari zu dem)'],             // preposisi + artikel
    ['chatten', 'mengobrol (secara daring)'],                 // verba (infinitiv)
    ['vielen Dank', 'terima kasih banyak'],                   // ungkapan
    ['die Preise', 'harga-harga'],                            // die → plural dari der Preis
    ['die Zahlungen', 'pembayaran-pembayaran']                // die → plural dari die Zahlung
        ['gelernt', 'belajar (partizip II dari lernen)'],              // verba
    ['hinzufügen', 'menambahkan'],                                // verba (infinitiv)
    ['geschafft', 'berhasil / menyelesaikan'],                    // partizip II dari schaffen
    ['angesehene', 'terkenal / terhormat'],                       // adjektiva (partizip dari ansehen)
    ['die Meldungen', 'laporan / pemberitahuan (jamak)'],         // die → plural
    ['der Supermarkt', 'supermarket'],                            // der → maskulin
    ['der Preis', 'harga'],                                       // der → maskulin
    ['das Angebot', 'penawaran / promo'],                         // das → netral
    ['sind', 'adalah / berada'],                                  // verba (bentuk plural dari sein)
    ['im', 'di / pada (gabungan dari in dem)'],                   // preposisi + artikel
    ['die Bananen', 'pisang-pisang'],                             // die → plural dari die Banane
    ['viel', 'banyak'],                                           // adverb
    ['kosten', 'berharga / biaya (jamak)'],                       // verba (sie kosten)
    ['kostet', 'berharga / seharga (tunggal)'],                   // verba (es kostet)
    ['billig', 'murah'],                                          // adjektiva
    ['teuer', 'mahal'],                                           // adjektiva
    ['zahlen', 'membayar'],                                       // verba
    ['die Karte', 'kartu'],                                       // die → feminin
    ['bar', 'tunai'],                                             // adverb
    ['die Barzahlung', 'pembayaran tunai'],                       // die → feminin
    ['nehmen', 'mengambil'],                                      // verba (infinitiv)
    ['bezahlen', 'membayar (lebih umum)'],                        // verba
    ['kann', 'bisa / dapat'],                                     // modalverb (ich/er/sie kann)
    ['nee', 'tidak / enggak'],                                    // informal (dari “nein”)
    ['die Orientierung', 'orientasi / penentuan arah'],           // die → feminin
    ['die Verkehrsmittel', 'alat transportasi'],                  // die → plural
    ['der Wald', 'hutan'],                                        // der → maskulin
    ['finde', 'menemukan / menganggap'],                          // verba (ich finde)
    ['links', 'kiri'],                                            // adverb
    ['rechts', 'kanan'],                                          // adverb
    ['geradeaus', 'lurus'],                                       // adverb
    ['der Bahnhof', 'stasiun'],                                   // der → maskulin
    ['der Zug', 'kereta'],                                        // der → maskulin
    ['der Bus', 'bus'],                                           // der → maskulin
    ['die Straßenbahn', 'trem / kereta listrik'],                 // die → feminin
    ['die Haltestelle', 'halte / perhentian'],                    // die → feminin
    ['der Fahrschein', 'tiket / karcis'],                         // der → maskulin
    ['der Flughafen', 'bandara / lapangan terbang'],              // der → maskulin
    ['der Flug', 'penerbangan'],                                  // der → maskulin
    ['das Flugzeug', 'pesawat terbang'],                          // das → netral
    ['die Verspätung', 'keterlambatan'],                          // die → feminin
    ['die Treppe', 'tangga'],                                     // die → feminin
    ['die Rolltreppe', 'eskalator'],                              // die → feminin
    ['der Aufzug', 'lift / elevator'],                            // der → maskulin
    ['der Eingang', 'pintu masuk'],                               // der → maskulin
    ['der Ausgang', 'pintu keluar'],                              // der → maskulin
    ['hier', 'di sini'],                                           // adverb
       ['die Ausbildung', 'pendidikan / pelatihan kerja'],                   // die → feminin
    ['das Essen', 'makanan'],                                             // das → netral
    ['das Abendessen', 'makan malam'],                                    // das → netral
    ['das Mittagessen', 'makan siang'],                                   // das → netral
    ['das Frühstück', 'sarapan'],                                         // das → netral
    ['der Tisch', 'meja'],                                                // der → maskulin
    ['die Speisekarte', 'daftar menu'],                                   // die → feminin
    ['die Karte', 'kartu / menu'],                                        // die → feminin
    ['bestellen', 'memesan'],                                             // verba (infinitiv)
    ['hätte', 'ingin / akan memiliki (bentuk konjunktif II dari haben)'], // modal (sopan)
    ['hätte gerne', 'ingin sekali / ingin dengan sopan'],                 // ungkapan sopan
    ['gerne', 'dengan senang hati / suka'],                               // adverb
    ['vegetarisch', 'vegetarian'],                                        // adjektiva
    ['vegan', 'vegan'],                                                   // adjektiva
    ['groß', 'besar'],                                                    // adjektiva
    ['klein', 'kecil'],                                                   // adjektiva
    ['kleines', 'kecil (bentuk netral dari klein)'],                      // adjektiva (neuter)
    ['das Bier', 'bir'],                                                  // das → netral
    ['alkoholfrei', 'tanpa alkohol'],                                     // adjektiva
    ['gibt es', 'ada / tersedia'],                                        // ungkapan (es gibt)
    ['lecker', 'lezat / enak'],                                           // adjektiva
    ['prost', 'bersulang!'],                                              // seruan
    ['guten Appetit', 'selamat makan'],                                   // ungkapan
    ['etwas', 'sesuatu / sedikit'],                                       // pronomina
    ['trinken', 'minum'],                                                 // verba
    ['bestellen', 'memesan'],                                             // verba (pengulangan dibiarkan)
    ['für', 'untuk'],                                                     // preposisi
    ['sehr gerne', 'sangat senang / dengan sangat senang hati'],          // ungkapan
    ['bitteschön', 'silakan / sama-sama'],                                // ungkapan sopan
    ['die Ofenkartoffeln', 'kentang panggang'],                           // die → plural
    ['der Quark', 'keju lembut / yogurt kental'],                         // der → maskulin
    ['hört', 'mendengar (er/sie hört)'],                                 // verba
    ['sich', 'diri sendiri (refleksif)'],                                 // pronomen refleksif
    ['ohne', 'tanpa'],                                                    // preposisi
        ['die Unterkünfte', 'akomodasi / tempat tinggal (jamak)'],            // die → plural
    ['das Zimmer', 'kamar'],                                              // das → netral
    ['die Wohnung', 'apartemen / tempat tinggal'],                        // die → feminin
    ['die Reservierung', 'pemesanan / reservasi'],                        // die → feminin
    ['der Reisepass', 'paspor'],                                          // der → maskulin
    ['der Stock', 'lantai / tingkat'],                                    // der → maskulin
    ['herzlich', 'dengan hangat / tulus'],                                // adjektiva
    ['willkommen', 'selamat datang'],                                     // ungkapan
    ['die Kreditkarte', 'kartu kredit'],                                  // die → feminin
    ['hätte', 'ingin / akan memiliki (bentuk konjunktif II dari haben)'], // modal
    ['der Schlüssel', 'kunci'],                                           // der → maskulin
    ['zweiten', 'kedua'],                                                 // ordinal / adjektiva
    ['können', 'bisa / dapat'],                                           // modalverb (infinitiv)
    ['wiederholen', 'mengulang'],                                         // verba
    ['Ja', 'ya'],                                                         // partikel jawaban
    ['Nein', 'tidak'],                                                    // partikel jawaban
    ['Nee', 'nggak / tidak (informal)'],                                  // partikel informal
    ['Stimmt', 'betul / benar'],                                          // ungkapan setuju
    ['Auf jeden Fall', 'tentu saja / pasti'],                             // ungkapan
    ['Na ja', 'yah / begitulah (ekspresi ragu)'],                         // ungkapan
    ['heiß', 'panas'],                                                    // adjektiva
    ['der Regen', 'hujan'],                                               // der → maskulin
    ['die Sonne', 'matahari'],                                            // die → feminin
    ['regnen', 'turun hujan'],                                            // verba
    ['Alles klar?', 'semuanya jelas? / paham?'],                          // ungkapan
    ['soll’s', 'haruskah? (bentuk singkat dari „soll es“)']               // bentuk percakapan
];


// --- Fungsi acak array ---
function acakArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Acak germanWords
acakArray(germanWords);

// Isi teks h3 dengan kata
const allElements = document.querySelectorAll('h3');
allElements.forEach((el, i) => {
    if (germanWords[i]) {
        el.textContent = germanWords[i][0];
        el.dataset.translation = germanWords[i][1]; // simpan arti di data attribute
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
