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
            alert("Please enter Matric No. and Password.");
            return;
        }

        // Langkah 1: Detektif cari Matrik dalam Firestore
        db.collection("users").where("noMatrik", "==", matrik).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                alert("❌ Matric No. does not exist in the system. Please register first.");
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
                alert("❌ Login Error: Incorrect password or server error.");
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
            alert('Error: Passwords do not match!');
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
            alert('Account successfully registered! Please log in.');
            window.location.href = 'index.html'; 
        })
        .catch((error) => {
            console.error("❌ RALAT PENDAFTARAN:", error);
            alert("Registration failed: " + error.message);
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
                    greetingText.innerHTML = `Welcome, <b>${data.noMatrik}</b><br><span style="font-size: 1rem; font-weight: normal;">${data.kursus}</span>`;
                }
            } 
        }).catch((error) => {
            console.error("❌ RALAT KESELAMATAN FIRESTORE:", error.message);
        });
        
    } else {
        if (greetingText) {
            greetingText.innerHTML = `Guest Mode<br><span style="font-size: 1rem; font-weight: normal;">Please select your program</span>`;
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
        
        alert("⚠️ NOTE: You are entering as a Guest. Your grade data will be lost after you close this system.");
        window.location.href = './calculator.html'; 
    });
}

// ==========================================
// FUNGSI LUPA KATA LALUAN (GUNA MATRIK - SMART LOOKUP)
// ==========================================
function forgotPassword() {
    let matrik = prompt("Please enter your Matric No.:");
    if (!matrik) return;
    matrik = matrik.trim();

    db.collection("users").where("noMatrik", "==", matrik).get()
    .then((querySnapshot) => {
        if (querySnapshot.empty) {
            alert("❌ This Matric No. is not found in the system. Please register first.");
            throw new Error("Matrik tidak wujud");
        }

        let emailPersonal = "";
        querySnapshot.forEach((doc) => {
            emailPersonal = doc.data().email; 
        });

        // DETEKTIF CHECK: E-mel ada tak?
        if (!emailPersonal) {
            alert("❌ Data Error: Your profile has no personal email record. Please contact Admin to reset manually.");
            throw new Error("E-mel tiada dalam database");
        }

        console.log("Menghantar reset ke:", emailPersonal);

        return auth.sendPasswordResetEmail(emailPersonal)
        .then(() => {
            alert("✅ Success!\nA reset link has been sent to your personal email:\n" + emailPersonal);
        });
    })
    .catch((error) => {
        if (error.message !== "Matrik tidak wujud" && error.message !== "E-mel tiada dalam database") {
            alert("❌ Error: " + error.message);
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