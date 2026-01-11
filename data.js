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
  { kod: 'CCA1012', nama: 'THE ART OF ARABIC KHAT', kredit: 2 },
  { kod: 'CCA1022', nama: 'ART OF DRAWING', kredit: 2 },
  { kod: 'CCB1012', nama: 'NASYID', kredit: 2 },
  { kod: 'CCB1022', nama: 'CHOIR', kredit: 2 },
  { kod: 'CCB1032', nama: 'THE ART OF THE ISLAMIC VOICE', kredit: 2 },
  { kod: 'CCC1012', nama: 'KOMPANG', kredit: 2 },
  { kod: 'CCD1012', nama: 'FOLK DANCE ART', kredit: 2 },
  { kod: 'CCE1012', nama: 'THEATER', kredit: 2 },
  { kod: 'CEA1012', nama: 'AGROSIS OF AGRICULTURAL ENTREPRENEURS', kredit: 2 },
  { kod: 'CEB1012', nama: 'DOWNSTREAM INDUSTRY STUDENT ENTREPRENEURS', kredit: 2 },
  { kod: 'CIA1012', nama: 'PROBLEM SOLVING - TRIZ', kredit: 2 },
  { kod: 'CIB1022', nama: 'CREATIVE MEDIA', kredit: 2 },
  { kod: 'CIB1032', nama: 'VIRTUAL SITE DEVELOPMENT', kredit: 2 },
  { kod: 'CLA1012', nama: 'HOLISTIC LEADERSHIP OF MUSLIM STUDENTS', kredit: 2 },
  { kod: 'CLA1022', nama: 'YOUNG STUDENT LEADERSHIP TRANSFORMATION', kredit: 2 },
  { kod: 'CPA1012', nama: 'MALAY LANGUAGE DEBATE', kredit: 2 },
  { kod: 'CPA1032', nama: 'MALAY SPEECHES', kredit: 2 },
  { kod: 'CPB1012', nama: 'ENGLISH DEBATE', kredit: 2 },
  { kod: 'CPB1022', nama: 'PUBLIC SPEAKING', kredit: 2 },
  { kod: 'CPC1012', nama: 'ARABIC DEBATE', kredit: 2 },
  { kod: 'CPC1022', nama: 'ARABIC RHETORIC', kredit: 2 },
  { kod: 'CSA1012', nama: 'HANDBALL', kredit: 2 },
  { kod: 'CSA1022', nama: 'SOCCER', kredit: 2 },
  { kod: 'CSA1032', nama: 'NETBALL', kredit: 2 },
  { kod: 'CSA1042', nama: 'FUTSAL', kredit: 2 },
  { kod: 'CSB1012', nama: 'SWIMMING AND RESCUE', kredit: 2 },
  { kod: 'CSB1022', nama: 'KAYAK', kredit: 2 },
  { kod: 'CSC1012', nama: 'BADMINTON', kredit: 2 },
  { kod: 'CSC1022', nama: 'TENNIS', kredit: 2 },
  { kod: 'CSC1032', nama: 'VOLLEYBALL', kredit: 2 },
  { kod: 'CSC1042', nama: 'TAKRAW', kredit: 2 },
  { kod: 'CSC1052', nama: 'LAWN BALL', kredit: 2 },
  { kod: 'CSC1062', nama: 'PING PONG', kredit: 2 },
  { kod: 'CSC1072', nama: 'TENPIN BOWLING', kredit: 2 },
  { kod: 'CSD1012', nama: 'CHESS', kredit: 2 },
  { kod: 'CSD1022', nama: 'GOLF', kredit: 2 },
  { kod: 'CSD1032', nama: 'ARCHERY', kredit: 2 },
  { kod: 'CSE1012', nama: 'TAEKWANDO', kredit: 2 },
  { kod: 'CSE1022', nama: 'SILAT', kredit: 2 },
  { kod: 'CTA1012', nama: 'STUDENT DEVOTION', kredit: 2 },
  { kod: 'CTB1012', nama: 'MOSQUE ADMINISTRATION', kredit: 2 }
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

