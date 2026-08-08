# 🌍 MemleketNere (EthnoGuessr Türkiye)

**MemleketNere**, Türkiye'deki il ve ilçelerin (İstanbul hariç) Vikipedi Türkçe biyografi verilerinden ve fotoğraflarından elde edilen ortalama erkek ve kadın yüz imajlarını tahmin etmeye dayalı web ve mobil oyundur.

[EthnoGuessr](https://hbd.gg/) mantığından esinlenilmiş, Türkiye coğrafyası ve ilçe düzeyinde biyometrik yüz ortalama (face morphing / face averaging) metodolojisi ile geliştirilmiştir.

---

## 🚀 Proje Yapısı

```
memleketnere/
├── pipeline/             # Python Veri & Yüz Ortalama Boru Hattı
│   ├── wiki_scraper.py   # Türkçe Wikipedia biyografi & doğum yeri kazıyıcı
│   ├── face_aligner.py   # Yüz tespiti & hizalama (MediaPipe / OpenCV)
│   ├── face_averager.py  # Delaunay nirengisi & affine morphing yüz ortalama motoru
│   ├── generate_dataset.py # Veri seti derleyici
│   └── requirements.txt  # Python bağımlılıkları
└── web/                  # Vite + React İnteraktif Web Uygulaması
    ├── src/
    │   ├── components/   # İnteraktif harita, oyun motoru, keșif rehberi & boru hattı simülatörü
    │   ├── data/         # İlçe & koordinat veritabanı, yüz verisetleri
    │   └── utils/        # Mesafe (Haversine), puanlama ve ses üretici
    └── public/           # Yüz morf imajları & ikonlar
```

---

## 🔬 Veri Metodolojisi (Face Averaging & Morphing)

1. **Vikipedi Kazıma (`tr.wikipedia.org`)**:
   - Türkiye doğumlu kişilerin biyografi sayfaları analiz edilir.
   - Infobox / Biyografi metninden doğum il/ilçesi çıkartılır (`doğum_yeri` alanı).
   - **İstanbul hariç tutulur** (kozmopolit yapısı ve yüksek iç göç nedeniyle ilçe karakteristiğini korumak amacıyla).
2. **Yüz Tespiti ve Hizalama**:
   - Portre fotoğraflar tespit edilir.
   - Göz bebekleri yatay eksende hizalanır, $600 \times 600$ boyutunda standart çerçeveye oturtulur.
3. **Yüz Ortalaması Alımı (Morphing)**:
   - MediaPipe Face Mesh / OpenCV landmark noktaları çıkarılır.
   - Delaunay Üçgenlemesi (Triangulation) uygulanarak ortalama yüz nirengi haritası oluşturulur.
   - Her yüz, ortalama nirengi haritasına Affine Dönüşümü (Affine Transform) ile esnetilir ve piksel renk kanalları harmanlanarak **İlçe Ortalama Erkek / Kadın Yüzü** oluşturulur.

---

## 🎮 Oyun Modları

1. **Memleketi Tahmin Et (Oyun Modu)**:
   - Rastgele bir ilçenin ortalama erkek veya kadın yüzü gösterilir.
   - Harita üzerinden tahmin edilen ilçe seçilir.
   - Gerçek mesafe (km) hesaplanır ve üssel puanlama formülü ($0 - 5000$ puan) uygulanır.
2. **İlçe Yüz Atlası (Keşfet)**:
   - Türkiye'nin 80 ilindeki ilçeleri arayın ve ortalama kadın/erkek yüzlerini yan yana karşılaştırın.
3. **Veri Hattı Simülatörü**:
   - Biyografi kazıma, yüz nirengi (triangulation) ve harmanlama adımlarını canlı simüle edin.

---

## 📦 Kurulum & Çalıştırma

### Web Uygulaması
```bash
cd web
npm install
npm run dev
```

### Python Veri Boru Hattı
```bash
cd pipeline
pip install -r requirements.txt
python generate_dataset.py --sample
```

---

## 📱 Mobil Yol Haritası
Web uygulaması PWA ve React Native / Capacitor entegrasyonuna uygun modüler mimari ile geliştirilmiştir. iOS ve Android sürümleri aynı veri boru hattını tüketir.
