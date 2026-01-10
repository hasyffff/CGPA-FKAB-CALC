// ============================================
// DATA STRUKTUR UNTUK KEDUA-DUA PROGRAM
// FAKULTI KEJURUTERAAN DAN ALAM BINA
// ============================================

// Grading System
const gradePoints = {
    'A+': 4.00,
    'A': 4.00,
    'A-': 3.75,
    'B+': 3.50,
    'B': 3.00,
    'B-': 2.75,
    'C+': 2.50,
    'C': 2.00,
    'C-': 1.75,
    'D': 1.00,
    'F': 0.00,
    '': 0.00
};

// KO-KURIKULUM (KOKU) – SAMPLE, BOLEH GANTI NANTI
const kokuSubjects = [
    { kod: "KOKU001", nama: "Kelab Robotik", kredit: 2 },
    { kod: "KOKU002", nama: "Sukarelawan Masyarakat", kredit: 1 },
    { kod: "KOKU003", nama: "Kelab Sukan (Badminton/Futsal)", kredit: 2 },
    { kod: "KOKU004", nama: "Persatuan Mahasiswa Kejuruteraan", kredit: 1 },
    { kod: "KOKU005", nama: "Projek Khidmat Komuniti", kredit: 3 }
];

// ============================================
// PROGRAM 1: ELECTRONIC ENGINEERING (SEM 1–8)
// ============================================
const electronicEngineering = {
    name: "Kejuruteraan Elektronik",
    fullName: "Bachelor of Electronic Engineering with Honours",
    semesters: {
        1: [
            { kod: "BAA1022", nama: "Bahasa Arab Praktikal", kredit: 2, taraf: "WF", optional: false },
            { kod: "BIA1012", nama: "Kemahiran Am Bahasa Inggeris", kredit: 2, taraf: "WF", optional: false },
            { kod: "UTC1012", nama: "Penghayatan Etika dan Peradaban", kredit: 2, taraf: "WU", optional: false },
            { kod: "KEE1133", nama: "Teknologi Elektrik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEH1123", nama: "Matematik Kejuruteraan I", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEK1113", nama: "Pengaturcaraan untuk Kejuruteraan", kredit: 3, taraf: "WF", optional: false }
        ],
        2: [
            { kod: "BAA2022", nama: "Bahasa Arab Komunikasi", kredit: 2, taraf: "WF", optional: true },
            { kod: "BIA2012", nama: "Bahasa Inggeris untuk Komunikasi", kredit: 2, taraf: "WF", optional: false },
            { kod: "UTP1012", nama: "Falsafah dan Isu Semasa", kredit: 2, taraf: "WU", optional: false },
            { kod: "KEE1223", nama: "Rekabentuk Logik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE1243", nama: "Peranti Elektronik Analog", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE1253", nama: "Instrumentasi dan Pengukuran", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEH1213", nama: "Matematik Kejuruteraan II", kredit: 3, taraf: "WF", optional: false }
        ],
        3: [
            { kod: "BAA3022", nama: "Bahasa Arab Sains", kredit: 2, taraf: "WF", optional: true },
            { kod: "BIA3012", nama: "Bahasa Inggeris untuk Keperluan Akademik", kredit: 2, taraf: "WF", optional: true },
            { kod: "KEE2333", nama: "Rekabentuk Litar Elektronik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2343", nama: "Kejuruteraan Kuasa Elektrik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2353", nama: "Amalan Kejuruteraan", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2363", nama: "Peranti Penderia", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEH2323", nama: "Kaedah Berangka untuk Kejuruteraan", kredit: 3, taraf: "WF", optional: false }
        ],
        4: [
            { kod: "BIS4022", nama: "Bahasa Inggeris untuk Keperluan Profesional", kredit: 2, taraf: "WF", optional: true },
            { kod: "UTU3012", nama: "Keusahawanan", kredit: 2, taraf: "WU", optional: false },
            { kod: "UTD1022", nama: "Akidah dan Tasawuf", kredit: 2, taraf: "WU", optional: false },
            { kod: "UTF1032", nama: "al-Madkhal Ila al-Fiqh al-Islami", kredit: 2, taraf: "WU", optional: false },
            { kod: "KEE2423", nama: "Teori Isyarat dan Litar", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2433", nama: "Teori Elektromagnetik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2443", nama: "Mikroelektronik", kredit: 3, taraf: "WP", optional: false },
            { kod: "KEH2412", nama: "Statistik Kejuruteraan", kredit: 2, taraf: "WF", optional: false }
        ],
        5: [
            { kod: "KEE3513", nama: "Teori Kawalan", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE3523", nama: "Mikropemproses dan Kawalan Terbenam", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE3553", nama: "Pengurusan Projek Kejuruteraan dan Kewangan", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEK3573", nama: "Senibina dan Organisasi Komputer", kredit: 3, taraf: "WP", optional: false },
            { kod: "KET3563", nama: "Komunikasi Elektronik", kredit: 3, taraf: "WF", optional: false }
        ],
        6: [
            { kod: "KEE3612", nama: "Jurutera dan Masyarakat", kredit: 2, taraf: "WF", optional: false },
            { kod: "KEE3624", nama: "Rekabentuk Projek Kejuruteraan Elektronik", kredit: 4, taraf: "WP", optional: false },
            { kod: "KEE3633", nama: "Rekabentuk Litar Terkamir", kredit: 3, taraf: "WP", optional: false },
            { kod: "KEE3653", nama: "Robotik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE3663", nama: "Elektronik Kuasa", kredit: 3, taraf: "WF", optional: false },
            { kod: "KET3643", nama: "Pemprosesan Isyarat Digit", kredit: 3, taraf: "WF", optional: false }
        ],
        7: [
            { kod: "KEE4712", nama: "Tesis I", kredit: 2, taraf: "WP", optional: false },
            { kod: "KEE4733", nama: "Pemacu dan Mesin Elektrik", kredit: 3, taraf: "EP", optional: false},
            { kod: "KEE4753", nama: "Rekabentuk FPGA", kredit: 3, taraf: "EP", optional: false},
            { kod: "KEK4783", nama: "Kecerdasan Buatan", kredit: 3, taraf: "EP", optional: false},
            { kod: "KET4763", nama: "Komunikasi Data dan Internet", kredit: 3, taraf: "EP", optional: false}
        ],
        8: [
            { kod: "KEE4814", nama: "Tesis II", kredit: 4, taraf: "WP", optional: false },
            { kod: "KEE4833", nama: "Elektronik Perubatan", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEE4843", nama: "Elektronik Opto", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEE4863", nama: "Sistem Kuasa", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KET4853", nama: "Kejuruteraan Frekuensi Radio dan Mikrogelombang", kredit: 3, taraf: "EP", optional: true, elektif: true }
        ]
    }
};

// ============================================
// PROGRAM 2: ELECTRICAL ENGINEERING (SEM 1–8)
// ============================================
const electricalEngineering = {
    name: "Kejuruteraan Elektrik",
    fullName: "Bachelor of Electrical Engineering with Honours",
    semesters: {
        1: [
            { kod: "BAA1022", nama: "Bahasa Arab Praktikal", kredit: 2, taraf: "WF", optional: false },
            { kod: "BIA1012", nama: "Kemahiran Am Bahasa Inggeris", kredit: 2, taraf: "WF", optional: false },
            { kod: "UTC1012", nama: "Penghayatan Etika dan Peradaban", kredit: 2, taraf: "WU", optional: false },
            { kod: "KEE1133", nama: "Teknologi Elektrik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEH1123", nama: "Matematik Kejuruteraan I", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEK1113", nama: "Pengaturcaraan untuk Kejuruteraan", kredit: 3, taraf: "WF", optional: false }
        ],
        2: [
            { kod: "BAA2022", nama: "Bahasa Arab Komunikasi", kredit: 2, taraf: "WF", optional: true },
            { kod: "BIA2012", nama: "Bahasa Inggeris untuk Komunikasi", kredit: 2, taraf: "WF", optional: false },
            { kod: "UTP1012", nama: "Falsafah dan Isu Semasa", kredit: 2, taraf: "WU", optional: false },
            { kod: "KEE1223", nama: "Rekabentuk Logik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE1243", nama: "Peranti Elektronik Analog", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE1253", nama: "Instrumentasi dan Pengukuran", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEH1213", nama: "Matematik Kejuruteraan II", kredit: 3, taraf: "WF", optional: false }
        ],
        3: [
            { kod: "BAA3022", nama: "Bahasa Arab Sains", kredit: 2, taraf: "WF", optional: true },
            { kod: "BIA3012", nama: "Bahasa Inggeris untuk Keperluan Akademik", kredit: 2, taraf: "WF", optional: true },
            { kod: "KEE2333", nama: "Rekabentuk Litar Elektronik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2343", nama: "Kejuruteraan Kuasa Elektrik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2353", nama: "Amalan Kejuruteraan", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2363", nama: "Peranti Penderia", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEH2323", nama: "Kaedah Berangka untuk Kejuruteraan", kredit: 3, taraf: "WF", optional: false }
        ],
        4: [
            { kod: "BIS4022", nama: "Bahasa Inggeris untuk Keperluan Profesional", kredit: 2, taraf: "WF", optional: true },
            { kod: "UTU3012", nama: "Keusahawanan", kredit: 2, taraf: "WU", optional: false },
            { kod: "UTD1022", nama: "Akidah dan Tasawuf", kredit: 2, taraf: "WU", optional: false },
            { kod: "UTF1032", nama: "al-Madkhal Ila al-Fiqh al-Islami", kredit: 2, taraf: "WU", optional: false },
            { kod: "KEE2423", nama: "Teori Isyarat dan Litar", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2433", nama: "Teori Elektromagnetik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE2443", nama: "Mikroelektronik", kredit: 3, taraf: "WP", optional: false },
            { kod: "KEH2412", nama: "Statistik Kejuruteraan", kredit: 2, taraf: "WF", optional: false }
        ],
        5: [
            { kod: "KEE3513", nama: "Teori Kawalan", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE3523", nama: "Mikropemproses dan Kawalan Terbenam", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE3553", nama: "Pengurusan Projek Kejuruteraan dan Kewangan", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEK3573", nama: "Senibina dan Organisasi Komputer", kredit: 3, taraf: "WP", optional: false },
            { kod: "KET3563", nama: "Komunikasi Elektronik", kredit: 3, taraf: "WF", optional: false }
        ],
        6: [
            { kod: "KEE3612", nama: "Jurutera dan Masyarakat", kredit: 2, taraf: "WF", optional: false },
            { kod: "KEE3624", nama: "Rekabentuk Projek Kejuruteraan Elektrik", kredit: 4, taraf: "WP", optional: false },
            { kod: "KEE3633", nama: "Sistem Kawalan Digital", kredit: 3, taraf: "WP", optional: false },
            { kod: "KEE3653", nama: "Sistem Kawalan Automatik", kredit: 3, taraf: "WF", optional: false },
            { kod: "KEE3663", nama: "Elektronik Kuasa", kredit: 3, taraf: "WF", optional: false },
            { kod: "KET3643", nama: "Sistem Kuasa", kredit: 3, taraf: "WF", optional: false }
        ],
        7: [
            { kod: "KEE4712", nama: "Tesis I", kredit: 2, taraf: "WP", optional: false },
            { kod: "KEE4733", nama: "Pemacu dan Mesin Elektrik", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEE4753", nama: "Sistem Kuasa Lanjutan", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEE4773", nama: "Peranti Semikonduktor Kuasa", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEK4743", nama: "Rangkaian Neural dan Logik Fuzzy", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEK4783", nama: "Kecerdasan Buatan", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEE4793", nama: "Automasi Industri", kredit: 3, taraf: "EP", optional: true, elektif: true }
        ],
        8: [
            { kod: "KEE4814", nama: "Tesis II", kredit: 4, taraf: "WP", optional: false },
            { kod: "KEE4833", nama: "Tenaga Boleh Baharu", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEE4843", nama: "Grid Pintar", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEE4863", nama: "Sistem Penjanaan Kuasa", kredit: 3, taraf: "EP", optional: true, elektif: true },
            { kod: "KEE4873", nama: "Kualiti Kuasa Elektrik", kredit: 3, taraf: "EP", optional: true, elektif: true }
        ]
    }
};

// EXPORT
const programmes = {
  Electronic: {
    fullName: 'Kejuruteraan Elektronik',
    semesters: electronicEngineering.semesters
  },
  Electrical: {
    fullName: 'Kejuruteraan Elektrik',
    semesters: electricalEngineering.semesters
  }
};

