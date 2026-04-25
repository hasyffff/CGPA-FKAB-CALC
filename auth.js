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
// 4. FUNGSI LOG MASUK
// ==========================================
const loginBtn = document.getElementById('btn-login');

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const matrik = document.getElementById('login-matrik').value.trim();
        const pw = document.getElementById('login-pw').value;

        if (!matrik || !pw) {
            alert("Sila masukkan No. Matrik dan Kata Laluan!");
            return;
        }

        // Tukar No. Matrik kepada format e-mel "palsu" yang kita daftar tempoh hari
        const loginEmail = matrik + "@student.usim.edu.my";

        // Minta Firebase semak adakah ID dan Password ini wujud & betul
        auth.signInWithEmailAndPassword(loginEmail, pw)
            .then((userCredential) => {
                // Log masuk berjaya!
                alert("Berjaya log masuk! Selamat kembali.");
                window.location.href = "calculator.html";
            })
            .catch((error) => {
                // Jika salah password atau belum daftar
                if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials') {
                    alert("Ralat: No. Matrik tidak wujud atau kata laluan salah.");
                } else {
                    alert("Ralat Log Masuk: " + error.message);
                }
            });
    });
}



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

// ==========================================
// SEMAK STATUS PENGGUNA (VERSI DETEKTIF)
// ==========================================
auth.onAuthStateChanged((user) => {
    const greetingText = document.getElementById('user-greeting');
    
    console.log("🔍 DETEKTIF 1: Firebase Auth mengesan user?", user ? "YA - " + user.email : "TIDAK (Guest)");

    if (user) {
        // Jika ADA pengguna log masuk
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log("🔍 DETEKTIF 2: Data Firestore dijumpai!", data);
                
                if (greetingText) {
                    greetingText.innerHTML = `Selamat Datang, <b>${data.noMatrik}</b><br><span style="font-size: 1rem; font-weight: normal;">${data.kursus}</span>`;
                    console.log("✅ BERJAYA: Tulisan di skrin telah ditukar.");
                } else {
                    console.error("❌ RALAT HTML: Tak jumpa ID 'user-greeting' di dalam calculator.html");
                }
            } else {
                console.error("❌ RALAT FIRESTORE: Akaun wujud, tapi tiada data nama/matrik disimpan!");
            }
        }).catch((error) => {
            console.error("❌ RALAT KESELAMATAN FIRESTORE:", error.message);
        });
        
    } else {
        // Jika TIADA pengguna log masuk (Tetamu)
        if (greetingText) {
            greetingText.innerHTML = `Mod Tetamu<br><span style="font-size: 1rem; font-weight: normal;">Sila pilih program anda</span>`;
        }
    }
});