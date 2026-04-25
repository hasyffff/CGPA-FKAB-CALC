// ==========================================
// 1. KONFIGURASI FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBzl_3szw9vvap1z1ttxrX3hG_qvVvgUaI",
    authDomain: "cgpa-master-fkab.firebaseapp.com",
    projectId: "cgpa-master-fkab",
    storageBucket: "cgpa-master-fkab.firebasestorage.app",
    messagingSenderId: "353582709107",
    appId: "1:353582709107:web:87c10e33780e40a654ad06",
    measurementId: "G-BX9P0PEEF0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ==========================================
// 2. FUNGSI LOG MASUK GOOGLE
// ==========================================
const googleBtn = document.getElementById('google-login-btn');
if(googleBtn) {
    googleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then((result) => {
            checkAndCreateProfile(result.user);
        }).catch((error) => {
            alert("Ralat Log Masuk Google: " + error.message);
        });
    });
}

// ==========================================
// 3. FUNGSI DAFTAR BARU (Email & Password)
// ==========================================
const signupBtn = document.getElementById('btn-signup');
if(signupBtn) {
    signupBtn.addEventListener('click', () => {
        const matrik = document.getElementById('login-matrik').value;
        const pw = document.getElementById('login-pw').value;
        
        if(!matrik || !pw) {
            alert("Sila masukkan No. Matrik dan Kata Laluan!");
            return;
        }

        const fakeEmail = matrik + "@student.usim.edu.my";

        auth.createUserWithEmailAndPassword(fakeEmail, pw).then((result) => {
            const course = prompt("Pendaftaran Berjaya! Sila masukkan nama Kursus anda:");
            
            db.collection("users").doc(result.user.uid).set({
                noMatrik: matrik,
                kursus: course || "Tidak Dinyatakan",
                tarikhDaftar: new Date()
            }).then(() => {
                window.location.href = "calculator.html";
            });
        }).catch((error) => {
            alert("Ralat Pendaftaran: " + error.message);
        });
    });
}

// ==========================================
// 4. FUNGSI LOG MASUK
// ==========================================
const loginBtn = document.getElementById('btn-login');
if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        const matrik = document.getElementById('login-matrik').value;
        const pw = document.getElementById('login-pw').value;
        const fakeEmail = matrik + "@student.usim.edu.my";

        auth.signInWithEmailAndPassword(fakeEmail, pw).then((result) => {
            window.location.href = "calculator.html";
        }).catch((error) => {
            alert("Ralat: No. Matrik atau Kata Laluan salah!");
        });
    });
}

// ==========================================
// 5. SEMAK PROFIL
// ==========================================
function checkAndCreateProfile(user) {
    const userRef = db.collection("users").doc(user.uid);
    userRef.get().then((doc) => {
        if (doc.exists) {
            window.location.href = "calculator.html";
        } else {
            const matrik = prompt("Selamat datang! Sila masukkan No. Matrik anda:");
            const course = prompt("Sila masukkan nama Kursus/Fakulti anda:");
            
            userRef.set({
                nama: user.displayName,
                email: user.email,
                noMatrik: matrik,
                kursus: course,
                tarikhDaftar: new Date()
            }).then(() => {
                window.location.href = "calculator.html";
            });
        }
    });
} // <--- Tutup kurungan yang tertinggal tadi

// ==========================================
// FUNGSI PENDAFTARAN DARI HALAMAN REGISTER.HTML
// ==========================================
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Halang page dari refresh bila tekan butang submit

        // Ambil data dari kotak form Hasif
        const id = document.getElementById('regId').value.trim();
        const program = document.getElementById('regProgram').value;
        const pass = document.getElementById('regPass').value;
        const pass2 = document.getElementById('regPass2').value;

        // 1. Semak kata laluan
        if (pass !== pass2) {
            alert('Ralat: Kata laluan tidak sepadan!');
            return;
        }

        // 2. Trik E-mel USIM untuk Firebase
        const fakeEmail = id + "@student.usim.edu.my";

        // 3. Hantar data ke Firebase Authentication
        auth.createUserWithEmailAndPassword(fakeEmail, pass).then((result) => {
            
            // 4. Jika berjaya, simpan ID dan Program ke dalam Firestore Database
            db.collection("users").doc(result.user.uid).set({
                noMatrik: id,
                kursus: program,
                tarikhDaftar: new Date()
            }).then(() => {
                alert('Akaun berjaya didaftar! Selamat datang.');
                // Terus bawa ke kalkulator
                window.location.href = 'calculator.html';
            });

        }).catch((error) => {
            // Jika ID sudah wujud di Firebase, ia akan keluar di sini
            if(error.code === 'auth/email-already-in-use') {
                alert('ID pelajar ini sudah berdaftar dalam sistem!');
            } else {
                alert("Ralat Pendaftaran: " + error.message);
            }
        });
    });
}