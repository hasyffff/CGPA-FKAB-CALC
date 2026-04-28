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
const db = firebase.firestore(); 

// ==========================================
// FUNGSI LOG MASUK (GUNA MATRIK - SMART LOOKUP)
// ==========================================
const loginBtn = document.getElementById('btn-login');

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const matrik = document.getElementById('login-matrik').value.trim();
        const pw = document.getElementById('login-pw').value;

        if (!matrik || !pw) {
            alert("Sila isi No. Matrik dan Kata Laluan.");
            return;
        }

        // Langkah 1: Detektif cari Matrik dalam Firestore
        db.collection("users").where("noMatrik", "==", matrik).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                alert("❌ No. Matrik tidak wujud dalam sistem. Sila daftar dahulu.");
                throw new Error("Matrik tidak wujud"); 
            }

            // Langkah 2: Matrik dijumpai! Ambil e-mel personal dia
            let emailPersonal = "";
            querySnapshot.forEach((doc) => {
                emailPersonal = doc.data().email;
            });

            console.log("Detektif jumpa e-mel:", emailPersonal);

            // Langkah 3: Log masuk ke Firebase guna e-mel personal tersebut
            return auth.signInWithEmailAndPassword(emailPersonal, pw);
        })
        .then((userCredential) => {
            // Langkah 4: Log masuk berjaya!
            const user = userCredential.user;
            localStorage.setItem('currentUser', user.uid);

            // Tarik data profil untuk tahu program apa
            return db.collection("users").doc(user.uid).get();
        })
        .then((doc) => {
            if (doc && doc.exists) {
                const data = doc.data();

                // Simpan program & Redirect ke page yang betul
                localStorage.setItem('currentProgram', data.kursus === "Kejuruteraan Elektronik" ? 'Electronic' : 'Electrical');
                
                if (data.kursus === "Kejuruteraan Elektronik") {
                    window.location.href = "calculator-electronic.html";
                } else {
                    window.location.href = "calculator-electrical.html";
                }
            }
        })
        .catch((error) => {
            if (error.message !== "Matrik tidak wujud") {
                alert("❌ Ralat Log Masuk: Kata laluan salah atau masalah pelayan.");
                console.error("Ralat Log Masuk:", error);
            }
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

        const nama = document.getElementById('reg-nama').value;
        const id = document.getElementById('regId').value.trim();
        const personalEmail = document.getElementById('regEmail').value.trim();
        const program = document.getElementById('regProgram').value;
        const pass = document.getElementById('regPass').value;
        const pass2 = document.getElementById('regPass2').value;

        if (pass !== pass2) {
            alert('Ralat: Kata laluan tidak sepadan!');
            return;
        }

        // 2. Mula buat akaun (Auth)
        auth.createUserWithEmailAndPassword(personalEmail, pass)
        .then((result) => {
            console.log("✅ Langkah 1: Auth berjaya! UID:", result.user.uid);
            
            // 3. Mula simpan profil (Firestore) 
            return db.collection("users").doc(result.user.uid).set({
                namaPenuh: nama,
                noMatrik: id,
                email: personalEmail, // <-- Laci e-mel dah ada!
                kursus: program,
                tarikhDaftar: new Date()
            });
        })
        .then(() => {
            console.log("✅ Langkah 2: Firestore berjaya simpan profil!");
            alert('Akaun berjaya didaftar! Sila log masuk.');
            window.location.href = 'index.html'; 
        })
        .catch((error) => {
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
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log("🔍 DETEKTIF 2: Data Firestore dijumpai!", data);
                
                if (greetingText) {
                    greetingText.innerHTML = `Selamat Datang, <b>${data.noMatrik}</b><br><span style="font-size: 1rem; font-weight: normal;">${data.kursus}</span>`;
                }
            } 
        }).catch((error) => {
            console.error("❌ RALAT KESELAMATAN FIRESTORE:", error.message);
        });
        
    } else {
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
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentProgram');
        
        alert("⚠️ NOTA: Anda masuk sebagai Tetamu. Data gred anda akan hilang selepas anda menutup sistem ini.");
        window.location.href = './calculator.html'; 
    });
}

// ==========================================
// FUNGSI LUPA KATA LALUAN (GUNA MATRIK - SMART LOOKUP)
// ==========================================
function forgotPassword() {
    let matrik = prompt("Sila masukkan No. Matrik anda:");
    if (!matrik) return;
    matrik = matrik.trim();

    db.collection("users").where("noMatrik", "==", matrik).get()
    .then((querySnapshot) => {
        if (querySnapshot.empty) {
            alert("❌ No. Matrik ini tidak dijumpai dalam sistem. Sila daftar dahulu.");
            throw new Error("Matrik tidak wujud");
        }

        let emailPersonal = "";
        querySnapshot.forEach((doc) => {
            emailPersonal = doc.data().email; 
        });

        // DETEKTIF CHECK: E-mel ada tak?
        if (!emailPersonal) {
            alert("❌ Ralat Data: Profil anda tiada rekod e-mel personal. Sila hubungi Admin untuk reset manual.");
            throw new Error("E-mel tiada dalam database");
        }

        console.log("Menghantar reset ke:", emailPersonal);

        return auth.sendPasswordResetEmail(emailPersonal)
        .then(() => {
            alert("✅ Berjaya!\nPautan reset telah dihantar ke e-mel personal anda:\n" + emailPersonal);
        });
    })
    .catch((error) => {
        if (error.message !== "Matrik tidak wujud" && error.message !== "E-mel tiada dalam database") {
            alert("❌ Ralat: " + error.message);
        }
    });
}

// Tambah fungsi ini di bahagian bawah fail
function initializeUserAcademicProfile(userUid, programType) {
    const userRef = db.collection("users").doc(userUid);
    
    userRef.get().then((doc) => {
        // Jika akaun baru ATAU belum ada data 'silibusPeribadi'
        if (!doc.exists || !doc.data().silibusPeribadi) {
            console.log("Mencipta silibus peribadi pertama kali...");
            
            // Ambil salinan asal dari data.js
            const originalProgramData = programmes[programType].semesters;
            
            // Simpan ke Firestore
            userRef.set({
                program: programType,
                silibusPeribadi: originalProgramData,
                dataGred: {} // Kosongkan gred dulu
            }, { merge: true }) // merge: true penting supaya data login tak hilang
            .then(() => {
                console.log("Silibus peribadi berjaya dicipta!");
                // Panggil semula fungsi paparan UI
                if (typeof loadSilibusPeribadi === 'function') {
                    loadSilibusPeribadi();
                }
            });
        }
    });
}
// ============================================
// FUNGSI TUNJUK/SEMBUNYI KATA LALUAN
// ============================================
function togglePasswordVisibility(inputId, iconElement) {
    const passwordInput = document.getElementById(inputId);
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Tunjuk teks
        iconElement.textContent = "🙈"; // Tukar ikon jadi monyet tutup mata (atau ikon palang)
    } else {
        passwordInput.type = "password"; // Sembunyi teks
        iconElement.textContent = "👁️"; // Kembali ke ikon mata terbuka
    }
}