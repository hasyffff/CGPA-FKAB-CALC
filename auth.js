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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore(); // BARIS INI PENTING

// ==========================================
// FUNGSI LOG MASUK
// ==========================================
// Pastikan baris ini ada di luar fungsi, biasanya di bahagian atas auth.js
const loginBtn = document.getElementById('btn-login');

// Pastikan fungsi ini wujud
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Ini penting supaya page tak refresh
        
        // ... (kod login Firebase yang kita bincang sebelum ini)
        console.log("Butang login ditekan!"); // Tambah ini untuk kita test
    });
}

// ==========================================
// FUNGSI LOG MASUK (SMART REDIRECT)
// ==========================================
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const matrik = document.getElementById('login-matrik').value.trim();
        const pw = document.getElementById('login-pw').value;
        const loginEmail = matrik + "@student.usim.edu.my";

        auth.signInWithEmailAndPassword(loginEmail, pw)
            .then((userCredential) => {
                const user = userCredential.user;

                // Simpan status login untuk script.js guna nanti
                localStorage.setItem('currentUser', user.uid);

                // 1. Tarik data dari Firestore untuk tengok kursus apa
                db.collection("users").doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();

                        // Simpan program supaya script.js tahu nak load subjek mana
                        localStorage.setItem('currentProgram', data.kursus === "Kejuruteraan Elektronik" ? 'Electronic' : 'Electrical');
                        
                        // Redirect ke fail spesifik
                        if (data.kursus === "Kejuruteraan Elektronik") {
                            window.location.href = "calculator-electronic.html";
                        } else {
                            window.location.href = "calculator-electrical.html";
                        }
                    }
                });
            })
            .catch((error) => {
                alert("Ralat Log Masuk: " + error.message);
            });
    });
}



// ==========================================
// FUNGSI PENDAFTARAN (REGISTER)
// ==========================================
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        // 1. INI PALING PENTING: Halang page dari ter-refresh awal!
        e.preventDefault(); 

        const id = document.getElementById('regId').value.trim();
        const program = document.getElementById('regProgram').value;
        const pass = document.getElementById('regPass').value;
        const pass2 = document.getElementById('regPass2').value;

        if (pass !== pass2) {
            alert('Ralat: Kata laluan tidak sepadan!');
            return;
        }

        const fakeEmail = id + "@student.usim.edu.my";

        // 2. Mula buat akaun (Auth)
        auth.createUserWithEmailAndPassword(fakeEmail, pass)
        .then((result) => {
            console.log("✅ Langkah 1: Auth berjaya! UID:", result.user.uid);
            
            // 3. Mula simpan profil (Firestore) - PASTIKAN ADA 'return' DI DEPAN
            return db.collection("users").doc(result.user.uid).set({
                noMatrik: id,
                kursus: program,
                tarikhDaftar: new Date()
            });
        })
        .then(() => {
            console.log("✅ Langkah 2: Firestore berjaya simpan profil!");
            alert('Akaun berjaya didaftar! Sila log masuk.');
            window.location.href = 'index.html'; // Bawa balik ke page login
        })
        .catch((error) => {
            // Jika ada apa-apa yang gagal, ia akan menjerit di sini!
            console.error("❌ RALAT PENDAFTARAN:", error);
            alert("Pendaftaran tergendala: " + error.message);
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

// ==========================================
// FUNGSI MOD TETAMU (GUEST LALUAN C)
// ==========================================
const guestBtn = document.getElementById('btn-guest');

if (guestBtn) {
    guestBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        // 1. CUCI DATA LAMA DI SINI (Supaya tak melompat ke page sebelum ni)
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentProgram');
        
        // 2. Beri amaran dan hantar ke pintu gerbang
        alert("⚠️ NOTA: Anda masuk sebagai Tetamu. Data gred anda akan hilang selepas anda menutup sistem ini.");
        window.location.href = './calculator.html'; 
    });
}