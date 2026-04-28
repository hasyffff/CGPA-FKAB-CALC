let totalCredits = 0;
// Baca mode dari URL
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const studentId = urlParams.get('id');

let myPersonalSyllabus = {}; // Ini akan pegang struktur subjek pelajar

// 1. Biarkan ID Matrik dipapar jika ada (Jangan usik)
if (mode === 'login' && studentId) {
    document.body.insertAdjacentHTML('afterbegin', `<div style="text-align:center; padding:10px; background:#1a1a2e; color:white;">No. Matrik: ${studentId}</div>`);
}

// 2. PINDAHKAN INI KE LUAR (Supaya dia sentiasa "mendengar" Firebase)
// Gantikan bahagian auth.onAuthStateChanged sedia ada dengan ini:
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("🔍 Firebase mengesan user:", user.email);
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                
                // Tarik Gred
                if (data.dataGred) savedGrades = data.dataGred;
                
                // Tarik Silibus Peribadi (Ini yang baharu!)
                if (data.silibusPeribadi) {
                    myPersonalSyllabus = data.silibusPeribadi;
                } else if (currentProgram) {
                    // Jika tiada (fallback), ambil dari data.js
                    myPersonalSyllabus = programmes[currentProgram].semesters;
                }
                
                if (currentProgram) {
                    initializeSemesters(); // Lukis semula jadual dengan data awan!
                    showSemester(currentSemester || 1); 
                    updateUI(); // Masukkan gred ke dalam kotak
                }
            }
        });
    } else {
        // Logik Guest Mode kekal sama
        const guestData = sessionStorage.getItem('cgpa_guest');
        if (guestData) savedGrades = JSON.parse(guestData);
        if (currentProgram) {
            myPersonalSyllabus = programmes[currentProgram].semesters; // Guest guna default
            initializeSemesters();
        }
    }
});

// Bila simpan CGPA, tambah:
// Gantian untuk Baris 19-24
function simpanCGPA() {
    const user = auth.currentUser; // Kenali siapa yang tengah login

    if (user && mode === 'login') {
        // Ambil semua gred yang Hasif dah isi dalam form/variable
        // Pastikan variable 'savedGrades' (atau apa-apa nama variable gred Hasif) ada data
        
        db.collection("users").doc(user.uid).update({
            dataGred: savedGrades, // Simpan array/object gred ke Firestore
            lastUpdated: new Date()
        })
        .then(() => {
            alert("✅ Data berjaya disimpan ke awan! Anda boleh akses di mana-mana peranti.");
        })
        .catch((error) => {
            console.error("Ralat simpan awan:", error);
            // Backup kalau cloud gagal, simpan ke local
            localStorage.setItem('cgpa_' + studentId, JSON.stringify(savedGrades));
        });
    } else {
        alert("⚠️ Anda dalam mod Tetamu. Data disimpan pada peranti ini sahaja.");
        localStorage.setItem('cgpa_guest', JSON.stringify(savedGrades));
    }
}


// ============================================
// GLOBAL VARIABLES
// ============================================
let currentProgram = null;
let currentSemester = 1;
let savedGrades = {};

/// bezakan user akaun vs guest
const currentUser   = localStorage.getItem('currentUser');
const storedProgram = localStorage.getItem('currentProgram');

if (currentUser && storedProgram) {
  // USER AKAUN → terus guna course dari akaun
  selectProgram(storedProgram);
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) backBtn.style.display = 'none';
} else {
  // GUEST → jangan auto select apa‑apa
  document.getElementById('programSelection').style.display = 'block';
  document.getElementById('calculatorPage').style.display = 'none';
}

// AUTO-LOAD PROGRAM SEBAIK PAGE DIBUKA
window.addEventListener('DOMContentLoaded', () => {
    const storedProgram = localStorage.getItem('currentProgram');
    const isGuest = !localStorage.getItem('currentUser');

    if (storedProgram) {
        // Jika user login, terus select program mereka
        selectProgram(storedProgram);
    } else if (isGuest && window.location.pathname.includes('calculator.html')) {
        // Jika guest, biar dia pilih di calculator.html
        document.getElementById('programSelection').style.display = 'block';
    }
});

// ============================================
// PROGRAM SELECTION (VERSI KEBAL)
// ============================================
function selectProgram(programType) {
  currentProgram = programType;
  localStorage.setItem('currentProgram', programType);

  const program = programmes[programType];
  
  // Update tajuk jika ada
  const titleElem = document.getElementById('programTitle');
  if (titleElem) {
      titleElem.textContent = program.fullName;
  }

  if (Object.keys(myPersonalSyllabus).length === 0) {
        myPersonalSyllabus = program.semesters;
    }
  // 1. Tarik data & Bina jadual dahulu
  //loadSavedData();
  
  initializeSemesters();
  showSemester(1);

  // 2. BARU panggil updateUI untuk isi gred (INI YANG KITA TAMBAH)
  if (typeof updateUI === "function") {
      updateUI();
  }

  // Sorok/Papar elemen JIKA ia wujud dalam HTML tersebut
  const progSel = document.getElementById('programSelection');
  const calcPage = document.getElementById('calculatorPage');
  const guestOpts = document.getElementById('guestModeOptions');

  if (progSel) progSel.style.display = 'none';
  if (calcPage) calcPage.style.display = 'block';

  // Khas untuk Guest jika ada kotak options
  if (!currentUser && guestOpts) {
      guestOpts.style.display = 'block';
  }
}


function goBack() {
  function goBack() {
  // hanya guest yang akan nampak butang ni
  document.getElementById('calculatorPage').style.display = 'none';
  document.getElementById('programSelection').style.display = 'block';
  currentProgram = null;
}

  // hanya guest yang sampai sini
  document.getElementById('calculatorPage').style.display = 'none';
  document.getElementById('programSelection').style.display = 'block';
  currentProgram = null;
}

function startGuestCalculator() {
  const modeRadio = document.querySelector('input[name="guestMode"]:checked');
  const mode = modeRadio ? modeRadio.value : 'full';

  if (mode === 'single') {
    const semNum = parseInt(document.getElementById('guestSingleSem').value);
    document.getElementById('currentSemester').value = semNum;
    updateVisibleSemesters();
    showSemester(semNum);
  } else {
    const program = programmes[currentProgram];
    const totalSem = Object.keys(program.semesters).length;
    document.getElementById('currentSemester').value = totalSem;
    updateVisibleSemesters();
    showSemester(1);
  }

  document.getElementById('guestModeOptions').style.display = 'none';
  document.getElementById('calculatorPage').style.display = 'block';
}


// ============================================
// SEMESTER MANAGEMENT
// ============================================
function initializeSemesters() {
    const tabsContainer = document.getElementById('semesterTabs');
    const contentContainer = document.getElementById('semesterContent');
    
    tabsContainer.innerHTML = '';
    contentContainer.innerHTML = '';
    
    Object.keys(myPersonalSyllabus).forEach(semNum => {
        const tab = document.createElement('button');
        tab.className = 'tab';
        
        // UBAH BARIS INI: Tukar 'Semester' kepada 'SEM'
        tab.textContent = `SEM ${semNum}`; 
        
        tab.onclick = () => showSemester(parseInt(semNum));
        tabsContainer.appendChild(tab);
        
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester-data';
        semesterDiv.id = `semester-${semNum}`;
        semesterDiv.innerHTML = createSemesterContent(semNum, myPersonalSyllabus[semNum]);
        contentContainer.appendChild(semesterDiv);
    });
}

function createSemesterContent(semNum, subjects) {
    const totalCredits = subjects.reduce((sum, sub) => sum + sub.kredit, 0);
    
    let html = `
        <div class="semester-header">
            <h3>Semester ${semNum}</h3>
            <p>Jumlah Kredit: <strong>${totalCredits}</strong></p>
        </div>
        
        <div class="table-responsive">
            <table class="subject-table">
            <thead>
                <tr>
                    <th style="width: 12%">Kod</th>
                    <th style="width: 40%">Nama Kursus</th>
                    <th style="width: 8%">Kredit</th>
                    <th style="width: 8%">Taraf</th>
                    <th style="width: 20%">Gred</th>
                    <th style="width: 12%">Tindakan</th>
                </tr>
            </thead>
            <tbody>
        </div>
    `;
    
    subjects.forEach((subject, index) => {
        const subjectId = `${semNum}-${index}`;
        const isOptional = subject.optional || subject.elektif || false;
        const savedGrade = savedGrades[subjectId] || '';
        const isTaken = savedGrades[`${subjectId}-taken`] !== false;
        
        html += `
            <tr>
                <td>${subject.kod}</td>
                <td>${subject.nama}${subject.elektif ? ' *' : ''}</td>
                <td>${subject.kredit}</td>
                <td><span class="badge">${subject.taraf}</span></td>
                <td>
                    <select id="grade-${subject.kod}" onchange="saveGradeInput('${subject.kod}')">
                        <option value="">- Pilih -</option>
                        ${createGradeOptions(savedGrade)}
                    </select>
                </td>
                <td style="text-align: center;">
                    <button onclick="removeDefaultSubject('${semNum}', '${subject.kod}')" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 600;">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });
    
// BAHAGIAN TAMBAH SUBJEK KE JADUAL (VERSI CUSTOM CANTIK)
        html += `
            </tbody>
        </table>
        
        <div class="manual-item-controls" style="margin-top: 15px; background: rgba(91, 192, 190, 0.05); padding: 15px; border-radius: 8px; border: 1px dashed #5bc0be; display: flex; gap: 10px; align-items: center;">
            
            <div style="flex: 1; position: relative;"> <input type="text" id="add-subject-input-${semNum}" 
                       placeholder="🔍 Taip kod atau nama subjek (Cth: KEE1133)..." 
                       autocomplete="off"
                       onfocus="showCustomDropdown('${semNum}')" 
                       oninput="filterCustomDropdown('${semNum}')" 
                       style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #475569; background: #1e293b; color: white; box-sizing: border-box;">
                
                <div id="custom-dropdown-${semNum}" class="custom-select-dropdown"></div>
            </div>

            <button onclick="addSubjectToSyllabus('${semNum}')" style="background: #5bc0be; color: #1a1a2e; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; white-space: nowrap;">
                + Masukkan Ke Jadual
            </button>
        </div>
        
        <div style="margin-top: 20px;">
            <button onclick="addKOKU(${semNum})" class="btn-secondary" style="padding: 10px 20px;">
                + Tambah Ko-Kurikulum
            </button>
        </div>
        
        <div id="koku-container-${semNum}"></div>
    `;
    
    return html;
}

function createGradeOptions(selectedGrade) {
    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
    return grades.map(grade => 
        `<option value="${grade}" ${grade === selectedGrade ? 'selected' : ''}>${grade} (${gradePoints[grade].toFixed(2)})</option>`
    ).join('');
}

function showSemester(semNum) {
    document.querySelectorAll('.semester-data').forEach(sem => {
        sem.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(`semester-${semNum}`).classList.add('active');
    document.querySelectorAll('.tab')[semNum - 1].classList.add('active');
    
    currentSemester = semNum;
}

function updateVisibleSemesters() {
    const selectedSem = parseInt(document.getElementById('currentSemester').value);
    
    for (let i = 1; i <= 9; i++) {
        const semDiv = document.getElementById(`semester-${i}`);
        const tabBtn = document.querySelectorAll('.tab')[i - 1];
        
        if (semDiv && tabBtn) {
            if (i <= selectedSem) {
                tabBtn.style.display = 'inline-block';
            } else {
                tabBtn.style.display = 'none';
            }
        }
    }
    
    showSemester(1);
}

// ============================================
// KOKU MANAGEMENT
// ============================================
let kokuCounter = 0;

function addKOKU(semNum) {
    const container = document.getElementById(`koku-container-${semNum}`);
    const kokuId = `koku-${semNum}-${kokuCounter++}`;
    
    const kokuOptions = kokuSubjects.map(koku => 
        `<option value="${koku.kod}" data-credit="${koku.kredit}">
            ${koku.nama}
        </option>`
    ).join('');

    
    const kokuHtml = `
        <div class="koku-item" id="${kokuId}" style="background: #fff3cd; padding: 15px; margin-top: 10px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h4 style="margin-bottom: 10px; color: #856404;">📚 Ko-Kurikulum</h4>
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end;">
                <div>
                    <label style="font-weight: 600; color: #856404;">Pilih Subjek KOKU:</label>
                    <select id="${kokuId}-subject" onchange="updateKOKUCredit('${kokuId}')"
                            style="width: 100%; padding: 10px; border: 2px solid #ffc107; border-radius: 6px; font-size: 0.95em;">
                        <option value="">-- Pilih KOKU --</option>
                        ${kokuOptions}
                    </select>
                </div>
                <div>
                    <label style="font-weight: 600; color: #856404;">Kredit:</label>
                    <input type="number" id="${kokuId}-credit" value="2" min="1" max="3" readonly
                           style="width: 100%; padding: 10px; border: 2px solid #dee2e6; border-radius: 6px; background: #f8f9fa;">
                </div>
                <div>
                    <label style="font-weight: 600; color: #856404;">Gred:</label>
                    <select id="${kokuId}-grade" style="width: 100%; padding: 10px; border: 2px solid #ffc107; border-radius: 6px;">
                        <option value="">- Pilih -</option>
                        ${createGradeOptions('')}
                    </select>
                </div>
                <button onclick="removeKOKU('${kokuId}')" 
                        style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    Hapus
                </button>
            </div>
            <small style="color: #856404; display: block; margin-top: 5px;">
                💡 Nota: Wajib ambil minimum 1 KOKU sepanjang pengajian
            </small>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', kokuHtml);
}

function updateKOKUCredit(kokuId) {
    const selectElement = document.getElementById(`${kokuId}-subject`);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const credit = selectedOption.getAttribute('data-credit') || 2;
    
    document.getElementById(`${kokuId}-credit`).value = credit;
}

function removeKOKU(kokuId) {
    if (confirm('Hapus Ko-Kurikulum ini?')) {
        document.getElementById(kokuId).remove();
    }
}

// ============================================
// GRADE INPUT & STORAGE
// ============================================
function saveGradeInput(kodSubjek) {
    const gradeSelect = document.getElementById(`grade-${kodSubjek}`);
    if (gradeSelect) {
        savedGrades[kodSubjek] = gradeSelect.value;
        // Kita simpan ke localStorage sebagai backup pantas
        //saveData(); 
    }
}

function toggleSubject(subjectId) {
    const checkbox = document.getElementById(`taken-${subjectId}`);
    savedGrades[`${subjectId}-taken`] = checkbox.checked;
}

// ============================================
// FUNGSI SIMPAN DATA KE FIREBASE
// ============================================
function saveData() {
    const user = auth.currentUser; // Kenal pasti siapa yang login

    if (user) {
        // Jika ada user login, simpan terus ke akaun (Awan/Firestore)
        db.collection("users").doc(user.uid).update({
            dataGred: savedGrades,
            lastUpdated: new Date()
        })
        .then(() => {
            alert("✅ Tahniah! Data gred berjaya disimpan ke dalam akaun USIM anda.");
            console.log("Data disimpan:", savedGrades);
        })
        .catch((error) => {
            console.error("❌ Ralat simpan awan:", error);
            alert("Gagal menyimpan data ke awan. Sila cuba lagi.");
        });
    } else {
        // Jika Mod Tetamu (Guest), simpan dalam komputer sahaja
        sessionStorage.setItem('cgpa_guest', JSON.stringify(savedGrades));
        alert("⚠️ Mod Tetamu: Data hanya disimpan sementara. Ia akan terpadam secara automatik apabila anda menutup pelayar (browser) ini.");
    }
}

function loadSavedData() {
  if (!studentId) return;

  const saved = localStorage.getItem('cgpa_' + studentId);
  if (saved) {
    const data = JSON.parse(saved);
    if (data.program === currentProgram) {
      savedGrades = data.grades || {};
    }
  }
}


// ============================================
// RESET SEMUA (FACTORY RESET SEBENAR)
// ============================================
function clearAll() {
    if (confirm('Anda pasti mahu reset semua data? Tindakan ini akan memadam data di peranti dan di awan (Firebase).')) {
        
        // 1. Cuci memori tempatan (PC/Phone)
        savedGrades = {};
        localStorage.removeItem('cgpa-calculator-data');
        
        // 2. Cuci memori awan (Firebase)
        const user = auth.currentUser;
        if (user) {
            db.collection("users").doc(user.uid).update({
                dataGred: {}, // Kosongkan semua gred
                silibusPeribadi: firebase.firestore.FieldValue.delete() // Buang silibus custom (kembali ke asal)
            }).then(() => {
                console.log("Firebase berjaya dicuci bersih.");
            }).catch(error => {
                console.error("Ralat mencuci Firebase:", error);
            });
        }
        
        // 3. Reset UI ke tetapan kilang
        myPersonalSyllabus = programmes[currentProgram].semesters; 
        initializeSemesters();
        showSemester(1);
        
        document.getElementById('currentGPA').textContent = '-';
        document.getElementById('overallCGPA').textContent = '-';
        
        alert('✓ Semua data telah direset. Sistem anda kini bersih seperti baru.');
    }
}

// ============================================
// CGPA CALCULATION
// ============================================
function calculateAll(isSenyap = false) {
    const program = programmes[currentProgram];
    let totalGradePoints = 0;
    let totalCredits = 0;
    let semesterResults = {};
    
    Object.keys(program.semesters).forEach(semNum => {
        const subjects = program.semesters[semNum];
        let semGradePoints = 0;
        let semCredits = 0;
        
        subjects.forEach((subject, index) => {
            // Tukar carian ID menggunakan subject.kod
            const grade = document.getElementById(`grade-${subject.kod}`)?.value;
            const isTaken = document.getElementById(`taken-${subject.kod}`)?.checked !== false;
            
            if (grade && isTaken) {
                const points = gradePoints[grade] * subject.kredit;
                semGradePoints += points;
                semCredits += subject.kredit;
            }
        });

        // Di dalam loop semester dalam fungsi calculateAll
        const manualCont = document.getElementById(`manual-container-${semNum}`);
        if (manualCont) {
            manualCont.querySelectorAll('.manual-item').forEach(item => {
                const credit = parseFloat(item.querySelector('.manual-credit').value) || 0;
                const grade = item.querySelector('.manual-grade').value;
                
                // Logik USIM: Jika gred bukan L, baru kira dalam CGPA
                if (grade && grade !== "L" && credit > 0) {
                    semGradePoints += (gradePoints[grade] * credit);
                    semCredits += credit;
                }
            });
        }
        
        const kokuContainer = document.getElementById(`koku-container-${semNum}`);
        if (kokuContainer) {
            const kokuItems = kokuContainer.querySelectorAll('.koku-item');
            kokuItems.forEach(item => {
                const kokuId = item.id;
                const credit = parseFloat(document.getElementById(`${kokuId}-credit`)?.value || 0);
                const grade = document.getElementById(`${kokuId}-grade`)?.value;
                
                if (grade && credit > 0) {
                    const points = gradePoints[grade] * credit;
                    semGradePoints += points;
                    semCredits += credit;
                }
            });
        }
        
        const semGPA = semCredits > 0 ? (semGradePoints / semCredits).toFixed(2) : 0;
        semesterResults[semNum] = { gpa: semGPA, credits: semCredits };
        
        totalGradePoints += semGradePoints;
        totalCredits += semCredits;
    });
    
    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    
    const currentSemGPA = semesterResults[currentSemester]?.gpa || '-';
    document.getElementById('currentGPA').textContent = currentSemGPA;
    document.getElementById('overallCGPA').textContent = cgpa;
    
    // --- TAMBAH LOGIK ANUGERAH DEKAN DI SINI ---
    const dekanMessageDiv = document.getElementById('dekanMessage');
    
    if (currentSemGPA !== '-' && parseFloat(currentSemGPA) >= 3.60) {
        dekanMessageDiv.style.display = 'block';
        dekanMessageDiv.innerHTML = `
            <strong>🎉 TAHNIAH! 🎉</strong><br>
            Anda telah berjaya mencapai status <strong>Anugerah Dekan</strong> untuk semester ini dengan GPA ${currentSemGPA}! Teruskan kecemerlangan!
        `;
    } else {
        // Sembunyikan mesej jika GPA jatuh bawah 3.60 atau jika belum dikira
        dekanMessageDiv.style.display = 'none'; 
    }
    // --- TAMAT LOGIK ANUGERAH DEKAN ---

    // Cari bahagian ni dan letak if (!isSenyap)
    if (!isSenyap) {
        if (totalCredits > 0) {
            alert(`✓ Pengiraan selesai!\n\nCGPA Keseluruhan: ${cgpa}\nJumlah Kredit: ${totalCredits}`);
        } else {
            alert('⚠️ Sila masukkan gred untuk sekurang-kurangnya satu subjek.');
        }
    }
}


// ============================================
// CGPA PREDICTION
// ============================================
function predictGrades() {
    const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);
    
    if (!targetCGPA || targetCGPA < 0 || targetCGPA > 4) {
        alert('⚠️ Sila masukkan target CGPA yang sah (0.00 - 4.00)');
        return;
    }
    
    const program = programmes[currentProgram];
    let totalGradePoints = 0;
    let totalCredits = 0;
    let remainingCredits = 0;
    
    const currentSem = parseInt(document.getElementById('currentSemester').value);
    
    for (let semNum = 1; semNum <= currentSem; semNum++) {
        const subjects = program.semesters[semNum];
        if (!subjects) continue;
        
        subjects.forEach((subject, index) => {
            const subjectId = `${semNum}-${index}`;
            const grade = document.getElementById(`grade-${subjectId}`)?.value;
            const isTaken = document.getElementById(`taken-${subjectId}`)?.checked !== false;
            
            if (grade && isTaken) {
                totalGradePoints += gradePoints[grade] * subject.kredit;
                totalCredits += subject.kredit;
            }
        });
    }
    
    for (let semNum = currentSem + 1; semNum <= 9; semNum++) {
        const subjects = program.semesters[semNum];
        if (subjects) {
            remainingCredits += subjects.reduce((sum, sub) => sum + sub.kredit, 0);
        }
    }
    
    if (remainingCredits === 0) {
        alert('⚠️ Tiada semester lagi untuk predict. Anda sudah di semester akhir.');
        return;
    }
    
    const requiredTotalPoints = targetCGPA * (totalCredits + remainingCredits);
    const requiredRemainingPoints = requiredTotalPoints - totalGradePoints;
    const requiredGPA = requiredRemainingPoints / remainingCredits;
    
    const resultsDiv = document.getElementById('predictionResults');
    
    if (requiredGPA > 4.0) {
        resultsDiv.innerHTML = `
            <h4 style="color: #dc3545;">❌ Target Tidak Dapat Dicapai</h4>
            <p>Maaf, target CGPA <strong>${targetCGPA.toFixed(2)}</strong> tidak mungkin dicapai walaupun anda mendapat 4.00 untuk semua subjek yang tinggal.</p>
            <p>CGPA maksimum yang boleh dicapai: <strong>${((totalGradePoints + (remainingCredits * 4.0)) / (totalCredits + remainingCredits)).toFixed(2)}</strong></p>
        `;
    } else if (requiredGPA <= (totalGradePoints / totalCredits) && requiredRemainingPoints <= 0) {
        resultsDiv.innerHTML = `
            <h4 style="color: #28a745;">✓ Target Sudah Tercapai!</h4>
            <p>CGPA semasa anda (<strong>${(totalGradePoints / totalCredits).toFixed(2)}</strong>) sudah berada di atas target yang anda inginkan.</p>
        `;
    } else {
        
        // --- LOGIK STRATEGI KOMBINASI GRED (PENDEKATAN 2) ---
        
        const nextSem = currentSem + 1;
        let nextSemHTML = '';
        
        if (program.semesters[nextSem]) {
            const nextSubjects = program.semesters[nextSem];
            const nextSemCredits = nextSubjects.reduce((sum, sub) => sum + sub.kredit, 0);
            
            // Senarai gred dari tertinggi ke terendah
            const gradeScale = [
                { g: 'A+', p: 4.00 }, { g: 'A', p: 4.00 }, { g: 'A-', p: 3.67 },
                { g: 'B+', p: 3.33 }, { g: 'B', p: 3.00 }, { g: 'B-', p: 2.67 },
                { g: 'C+', p: 2.33 }, { g: 'C', p: 2.00 }
            ];

            // 1. Setkan semua subjek kepada A sebagai permulaan (Senario Terbaik)
            let recommendedGrades = nextSubjects.map(sub => ({ ...sub, targetG: 'A', targetP: 4.00 }));

            // 2. Susun indeks subjek mengikut kredit tertinggi ke terendah
            // Tujuannya: Kita nak cuba turunkan gred subjek berat (susah) dahulu
            let sortedIndices = nextSubjects.map((sub, idx) => ({ idx, k: sub.kredit }))
                                            .sort((a, b) => b.k - a.k)
                                            .map(item => item.idx);

            // 3. Algoritma mencari kombinasi optimum
            let canDowngrade = true;
            while(canDowngrade) {
                canDowngrade = false; // Reset status setiap kali gelung (loop) bermula
                
                for (let i of sortedIndices) {
                    let currentSub = recommendedGrades[i];
                    let currentGradeIdx = gradeScale.findIndex(g => g.g === currentSub.targetG);
                    
                    // Jika gred masih boleh diturunkan (bukan C)
                    if (currentGradeIdx < gradeScale.length - 1) {
                        let nextLowerGrade = gradeScale[currentGradeIdx + 1];

                        // Kira adakah purata GPA masih melepasi requiredGPA jika gred ini diturunkan?
                        let testTotalPoints = 0;
                        recommendedGrades.forEach((sub, idx) => {
                            if (idx === i) testTotalPoints += nextLowerGrade.p * sub.kredit;
                            else testTotalPoints += sub.targetP * sub.kredit;
                        });

                        let testGPA = testTotalPoints / nextSemCredits;

                        // Jika ya, jadikan gred yang lebih rendah ini sebagai target baharu
                        if (testGPA >= requiredGPA) {
                            recommendedGrades[i].targetG = nextLowerGrade.g;
                            recommendedGrades[i].targetP = nextLowerGrade.p;
                            canDowngrade = true; 
                            break; // Mula dari awal susunan (cuba gilir-gilir subjek lain pula)
                        }
                    }
                }
            }

            // 4. Kira purata awal selepas algoritma siap
            const initialExpectedPoints = recommendedGrades.reduce((sum, sub) => sum + sub.targetP * sub.kredit, 0);
            const initialExpectedCGPA = (totalGradePoints + initialExpectedPoints) / (totalCredits + nextSemCredits);

            // 5. Cetak Visual dengan Dropdown Interaktif (Simulator)
            nextSemHTML = `
                <h5 style="margin-top: 20px; color: var(--sky-blue); display: flex; align-items: center; gap: 8px;">
                    🕹️ Simulator Strategi Semester ${nextSem}
                </h5>
                <p style="font-size: 0.95em; opacity: 0.9;">Sistem telah memberikan cadangan awal. Anda bebas mengubah gred di bawah untuk melihat kesan pada CGPA anda secara langsung.</p>
                
                <div style="background: var(--theme-dark-blue); padding: 20px; border-radius: 12px; border: 2px solid var(--sky-blue); margin-top: 15px; text-align: center; box-shadow: 0 8px 25px rgba(91, 192, 190, 0.15);">
                    <p style="margin: 0; color: #a0aec0; font-size: 0.95em; font-weight: 500;">Ramalan CGPA Baharu Anda</p>
                    <h2 id="live-cgpa-display" style="color: #28a745; margin: 10px 0; font-size: 3em; font-weight: 700; text-shadow: 0 0 15px rgba(40, 167, 69, 0.4);">${initialExpectedCGPA.toFixed(2)}</h2>
                    <p id="live-warning" style="color: #dc3545; font-size: 0.9em; margin: 0; display: none; font-weight: 600;">⚠️ Kombinasi gred ini gagal melepasi sasaran ${targetCGPA.toFixed(2)}</p>
                    <p id="live-success" style="color: var(--sky-blue); font-size: 0.9em; margin: 0; font-weight: 600;">✨ Sasaran berjaya dicapai!</p>
                </div>

                <ul style="background: transparent; padding: 0; margin-top: 25px; list-style: none;">
            `;
            
            // Senarai semua gred untuk dropdown
            const allGradesOptions = [
                { g: 'A+', p: 4.00 }, { g: 'A', p: 4.00 }, { g: 'A-', p: 3.67 },
                { g: 'B+', p: 3.33 }, { g: 'B', p: 3.00 }, { g: 'B-', p: 2.67 },
                { g: 'C+', p: 2.33 }, { g: 'C', p: 2.00 }, { g: 'C-', p: 1.67 },
                { g: 'D+', p: 1.33 }, { g: 'D', p: 1.00 }, { g: 'E', p: 0.00 }, { g: 'F', p: 0.00 }
            ];

            recommendedGrades.forEach(sub => {
                let optionsHTML = allGradesOptions.map(opt => 
                    `<option value="${opt.p}" ${opt.g === sub.targetG ? 'selected' : ''}>${opt.g}</option>`
                ).join('');

                nextSemHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid rgba(91, 192, 190, 0.1); background: var(--card-blue); margin-bottom: 8px; border-radius: 8px;">
                    <div>
                        <strong>${sub.kod}</strong><br>
                        <span style="font-size: 0.9em; color: #e2e8f0;">${sub.nama}</span> 
                        <span style="font-size:0.8em; color: var(--sky-blue); margin-left: 5px; background: rgba(91,192,190,0.1); padding: 2px 6px; border-radius: 4px;">${sub.kredit} Kredit</span>
                    </div>
                    <div>
                        <select class="live-grade-editor" data-kredit="${sub.kredit}" style="padding: 8px 12px; border-radius: 6px; background: var(--theme-dark-blue); color: #fff; border: 1px solid var(--sky-blue); cursor: pointer; font-weight: bold; font-size: 1em; outline: none;">
                            ${optionsHTML}
                        </select>
                    </div>
                </li>`;
            });
            nextSemHTML += `</ul>`;
        } else {
            nextSemHTML = `<p style="margin-top: 20px; font-style: italic; color: #a0aec0;">Tiada data subjek bagi semester seterusnya.</p>`;
        }

        resultsDiv.innerHTML = `
            <div style="padding: 5px; margin-top: 10px;">
                ${nextSemHTML}
            </div>
        `;

        // --- FUNGSI PENGIRAAN LIVE (REAL-TIME) ---
        // Kita letak delay sedikit (setTimeout) supaya HTML sempat dirender sebelum JS mencari elemen
        setTimeout(() => {
            const dropdowns = document.querySelectorAll('.live-grade-editor');
            const displayCGPA = document.getElementById('live-cgpa-display');
            const warningText = document.getElementById('live-warning');
            const successText = document.getElementById('live-success');

            function calculateLive() {
                let liveNewPoints = 0;
                let liveNewCredits = 0;

                dropdowns.forEach(dd => {
                    let kredit = parseFloat(dd.getAttribute('data-kredit'));
                    let mata = parseFloat(dd.value);
                    liveNewPoints += (kredit * mata);
                    liveNewCredits += kredit;
                });

                let liveTotalPoints = totalGradePoints + liveNewPoints;
                let liveTotalCredits = totalCredits + liveNewCredits;
                let liveCGPA = liveTotalPoints / liveTotalCredits;

                displayCGPA.textContent = liveCGPA.toFixed(2);

                // Tukar warna dan amaran mengikut status
                if (liveCGPA >= targetCGPA) {
                    displayCGPA.style.color = '#28a745'; // Hijau
                    displayCGPA.style.textShadow = '0 0 15px rgba(40, 167, 69, 0.4)';
                    warningText.style.display = 'none';
                    successText.style.display = 'block';
                } else {
                    displayCGPA.style.color = '#dc3545'; // Merah
                    displayCGPA.style.textShadow = '0 0 15px rgba(220, 53, 69, 0.4)';
                    warningText.style.display = 'block';
                    successText.style.display = 'none';
                }
            }

            // Tambah 'pendengar' pada setiap dropdown. Jika berubah, kira semula.
            dropdowns.forEach(dd => {
                dd.addEventListener('change', calculateLive);
            });
            
            // Jalankan sekali pada mula-mula
            calculateLive();

        }, 50);

        // BUANG background: white; pada div di bawah
        resultsDiv.innerHTML = `
            <h4 style="color: var(--sky-blue);">🎯 Ramalan untuk Target CGPA ${targetCGPA.toFixed(2)}</h4>
            <div style="padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p><strong>CGPA Semasa:</strong> ${(totalGradePoints / totalCredits).toFixed(2)}</p>
                <hr style="margin: 15px 0; border-color: rgba(91, 192, 190, 0.2);">
                <p style="font-size: 1.1em;"><strong>GPA Minimum Diperlukan (Baki Sem):</strong> <span style="color: #fd7e14; font-size: 1.3em; font-weight: bold;">${requiredGPA.toFixed(2)}</span></p>
                
                ${nextSemHTML}
                
            </div>
        `;
    }
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
window.onload = function() {
    const saved = localStorage.getItem('cgpa-calculator-data');
    if (saved) {
        const data = JSON.parse(saved);
        if (confirm('Terdapat data tersimpan. Mahu sambung dari data lepas?')) {
            selectProgram(data.program);
        }
    }
};

// ===== GUEST MODE OPTIONS EVENTS =====

// bila tukar radio
document.addEventListener('change', function (e) {
  if (e.target.name === 'guestMode') {
    if (e.target.value === 'single') {
      document.getElementById('singleSemSelector').style.display = 'block';
    } else {
      document.getElementById('singleSemSelector').style.display = 'none';
      const program = programmes[currentProgram];
      const totalSem = Object.keys(program.semesters).length;
      document.getElementById('currentSemester').value = totalSem;
      updateVisibleSemesters();
    }
  }
});

// bila pilih semester tunggal
document.addEventListener('change', function (e) {
  if (e.target.id === 'guestSingleSem') {
    const semNum = parseInt(e.target.value);
    document.getElementById('currentSemester').value = semNum;
    updateVisibleSemesters();
    showSemester(semNum);
  }
});

function logoutUser() {
    // 1. Beritahu Firebase untuk betul-betul log keluar
    auth.signOut().then(() => {
        // 2. Cuci semua kunci memori di komputer
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentProgram');
        
        // 3. Cuci juga data Guest lama supaya bila orang masuk Guest, ia kosong bersih
        localStorage.removeItem('cgpa_guest'); 
        
        // 4. Bawa pulang ke muka depan
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("Gagal log keluar:", error);
    });
}

function updateUI() {
    if (!savedGrades || Object.keys(savedGrades).length === 0) return;

    console.log("Memuatkan gred ke skrin...");

    for (const kodSubjek in savedGrades) {
        // Cari id grade-ECC3022
        const selectElem = document.getElementById(`grade-${kodSubjek}`);
        
        if (selectElem) {
            selectElem.value = savedGrades[kodSubjek];
        }
    }
    // Selepas isi semua, kira terus
    calculateAll(true); 
}

function showSemester(semNum) {
    document.querySelectorAll('.semester-data').forEach(sem => {
        sem.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Ini kalau ada ralat takpe, cuma untuk keselamatan
    const semDiv = document.getElementById(`semester-${semNum}`);
    if (semDiv) semDiv.classList.add('active');
    
    const tabs = document.querySelectorAll('.tab');
    if (tabs[semNum - 1]) tabs[semNum - 1].classList.add('active');
    
    // Update variable global supaya sistem tahu kita kat Sem berapa
    currentSemester = semNum;

    // --- TAMBAH BARIS INI ---
    // Arahkan sistem kemaskini kotak GPA dan CGPA di bawah secara senyap
    if (typeof calculateAll === "function") {
        calculateAll(true); 
    }
}

// ============================================
// TAMBAH SUBJEK MANUAL (REPEAT/ELECTIVE)
// ============================================
// ============================================
// TAMBAH SUBJEK MANUAL (VERSI SMART DROPDOWN)
// ============================================
let manualCount = 0;
function addManualRow(semNum) {
    manualCount++;
    const container = document.getElementById(`manual-container-${semNum}`);
    const rowId = `manual-${semNum}-${manualCount}`;

    // Panggil senarai semua subjek
    const subjectOptions = generateAllSubjectOptions();

    const html = `
        <div class="manual-item" id="${rowId}" style="background: rgba(91, 192, 190, 0.1); padding: 15px; margin-top: 10px; border-radius: 8px; border-left: 4px solid #5bc0be;">
            <div style="display: grid; grid-template-columns: 2.5fr 0.8fr 1fr auto; gap: 10px; align-items: end;">
                
                <div>
                    <label style="font-size: 0.8em; color: #5bc0be; font-weight: bold;">Pilih Subjek FKAB:</label>
                    <select class="manual-kod-select" onchange="autoFillManualSubject('${rowId}')" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; background: white; color: black;">
                        ${subjectOptions}
                    </select>
                </div>

                <div>
                    <label style="font-size: 0.8em; color: #5bc0be; font-weight: bold;">Kredit:</label>
                    <input type="number" class="manual-credit" value="0" min="1" readonly style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; background: #e9ecef; color: #495057;">
                </div>

                <div>
                    <label style="font-size: 0.8em; color: #5bc0be; font-weight: bold;">Gred:</label>
                    <select class="manual-grade" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; background: white; color: black;">
                        <option value="">- Pilih -</option>
                        ${createGradeOptions('')}
                        <option value="L">L (Lulus)</option>
                    </select>
                </div>

                <button onclick="document.getElementById('${rowId}').remove(); calculateAll(true);" style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                    Hapus
                </button>
            </div>
        </div>
    `;
    if (container) {
        container.insertAdjacentHTML('beforeend', html);
    }
}

/// ============================================
// HIMPUNKAN & SUSUN SUBJEK UNTUK DATALIST (SEARCHABLE)
// ============================================
function generateAllSubjectOptions() {
    let subjectsArray = [];
    let addedSubjects = new Set();

    // Kumpul semua subjek ke dalam satu tatasusunan (array)
    for (const progKey in programmes) {
        for (const semKey in programmes[progKey].semesters) {
            programmes[progKey].semesters[semKey].forEach(sub => {
                if (!addedSubjects.has(sub.kod)) {
                    addedSubjects.add(sub.kod);
                    subjectsArray.push(sub);
                }
            });
        }
    }

    // Susun array tersebut mengikut Kod Subjek (A-Z)
    subjectsArray.sort((a, b) => a.kod.localeCompare(b.kod));

    let optionsHtml = '';
    // Hasilkan senarai <option> untuk Datalist
    subjectsArray.forEach(sub => {
        optionsHtml += `<option value="${sub.kod} - ${sub.nama}"></option>`;
    });
    
    return optionsHtml;
}

// Fungsi Auto-Isi (Bila pengguna pilih subjek, jam kredit bertukar automatik)
function autoFillManualSubject(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;

    const selectElem = row.querySelector('.manual-kod-select');
    const creditInput = row.querySelector('.manual-credit');

    const selectedOption = selectElem.options[selectElem.selectedIndex];
    
    if (selectedOption.value !== "") {
        // Tarik nilai kredit dari option yang dipilih
        creditInput.value = selectedOption.getAttribute('data-credit');
    } else {
        creditInput.value = "0";
    }
}

// ============================================
// HAPUS SUBJEK ASAL (JADIKAN SILIBUS FLEKSIBEL)
// ============================================
function removeDefaultSubject(semNum, subjectCode) {
    if (confirm(`Anda pasti mahu menghapus subjek ${subjectCode} dari semester ini?`)) {
        
        // 1. Tapis dan buang subjek yang dipilih daripada memori
        myPersonalSyllabus[semNum] = myPersonalSyllabus[semNum].filter(sub => sub.kod !== subjectCode);

        // 2. Lukis semula jadual supaya ia hilang dari skrin
        initializeSemesters();
        showSemester(parseInt(semNum));
        
        // 3. Masukkan semula gred-gred lain yang telah diisi & kira semula CGPA
        if (typeof updateUI === "function") updateUI();
        calculateAll(true);

        // 4. Simpan struktur baharu ini ke Firebase supaya tak hilang bila refresh
        const user = auth.currentUser;
        if (user) {
            db.collection("users").doc(user.uid).update({
                silibusPeribadi: myPersonalSyllabus,
                lastUpdated: new Date()
            }).then(() => {
                console.log("Subjek berjaya dihapuskan dari silibus peribadi awan.");
            }).catch(err => {
                console.error("Ralat padam subjek:", err);
            });
        }
    }
}

// ============================================
// SUNTIK SUBJEK BAHARU TERUS KE DALAM JADUAL
// ============================================
function addSubjectToSyllabus(semNum) {
    const inputElem = document.getElementById(`add-subject-input-${semNum}`);
    const fullText = inputElem.value;
    
    // Ekstrak kod subjek (Cth: Dari "KEE1133 - Teknologi Elektrik" ambil "KEE1133" sahaja)
    const subjectCode = fullText.split(' - ')[0].trim();
    
    if (!subjectCode) {
        alert("Sila taip dan pilih subjek daripada senarai terlebih dahulu.");
        return;
    }
    
    // 1. Cari butiran penuh subjek dari "database" asal
    let newSubject = null;
    for (const p in programmes) {
        for (const s in programmes[p].semesters) {
            const found = programmes[p].semesters[s].find(x => x.kod === subjectCode);
            if (found) {
                newSubject = { ...found }; // Salin data subjek
                break;
            }
        }
        if (newSubject) break;
    }
    
    if (newSubject) {
        // 2. Semak supaya tiada subjek yang bertindih (double) dalam sem yang sama
        const isExist = myPersonalSyllabus[semNum].some(sub => sub.kod === subjectCode);
        if (isExist) {
            alert("Subjek ini sudah ada dalam jadual semester ini.");
            return;
        }
        
        // 3. Masukkan subjek ini ke dalam jadual peribadi pelajar
        myPersonalSyllabus[semNum].push(newSubject);
        
        // 4. LUKIS SEMULA SKRIN (Ini akan auto-update Jumlah Kredit!)
        initializeSemesters();
        showSemester(parseInt(semNum));
        
        // 5. Kembalikan gred yang dah diisi & kira CGPA
        if (typeof updateUI === "function") updateUI();
        calculateAll(true);
        
        // 6. Simpan jadual baharu ke Firebase
        const user = auth.currentUser;
        if (user) {
            db.collection("users").doc(user.uid).update({
                silibusPeribadi: myPersonalSyllabus,
                lastUpdated: new Date()
            }).then(() => {
                console.log("Subjek berjaya ditambah ke jadual awan.");
            });
        }
    }
}

// ============================================
// FUNGSI CETAK SLIP KEPUTUSAN (PDF) - VERSI BAIKI
// ============================================
function printReport() {
    calculateAll(true);
    
    // 1. Cari semua kotak pilihan (dropdown) di dalam jadual
    const allSelects = document.querySelectorAll('table select');
    
    allSelects.forEach(select => {
        // 2. Cipta teks biasa untuk menggantikan kotak dropdown semasa print
        const span = document.createElement('span');
        span.className = 'print-gred-text';
        
        // Semak jika pengguna ada pilih gred
        if(select.selectedIndex >= 0 && select.value !== "") {
            span.textContent = select.options[select.selectedIndex].text;
        } else {
            span.textContent = "-";
        }
        
        // Sembunyikan di skrin biasa, hanya tunjuk masa print
        span.style.display = 'none'; 
        
        // 3. Letak teks ini bersebelahan kotak dropdown
        select.parentNode.insertBefore(span, select.nextSibling);
    });
    
    // 4. Panggil arahan cetak sistem
    window.print();
    
    // 5. Bersihkan semula teks tambahan tadi selepas dialog print ditutup
    document.querySelectorAll('.print-gred-text').forEach(el => el.remove());
}

// ============================================
// ENJIN CUSTOM SEARCHABLE DROPDOWN
// ============================================

// 1. Dapatkan senarai subjek tersusun (A-Z)
function getSortedSubjectsArray() {
    let subjectsArray = [];
    let addedSubjects = new Set();
    for (const progKey in programmes) {
        for (const semKey in programmes[progKey].semesters) {
            programmes[progKey].semesters[semKey].forEach(sub => {
                if (!addedSubjects.has(sub.kod)) {
                    addedSubjects.add(sub.kod);
                    subjectsArray.push(sub);
                }
            });
        }
    }
    return subjectsArray.sort((a, b) => a.kod.localeCompare(b.kod));
}

// 2. Lukis isi dalam dropdown berdasarkan apa yang ditaip
function renderCustomDropdown(semNum, filterText = "") {
    const dropdown = document.getElementById(`custom-dropdown-${semNum}`);
    if (!dropdown) return;

    const subjects = getSortedSubjectsArray();
    dropdown.innerHTML = ""; // Kosongkan dulu
    
    const lowerFilter = filterText.toLowerCase();
    
    // Tapis subjek (Boleh cari Kod atau Nama)
    const filteredSubjects = subjects.filter(sub => 
        sub.kod.toLowerCase().includes(lowerFilter) || 
        sub.nama.toLowerCase().includes(lowerFilter)
    );

    // Jika tak jumpa subjek
    if (filteredSubjects.length === 0) {
        dropdown.innerHTML = `<div style="padding: 10px; color: #94a3b8; text-align: center; font-style: italic; font-size: 0.85em;">Tiada subjek dijumpai</div>`;
        return;
    }

    // Masukkan subjek yang melepasi tapisan ke dalam kotak
    filteredSubjects.forEach(sub => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = `${sub.kod} - ${sub.nama}`;
        
        // Bila pengguna klik subjek ini
        item.onclick = function() {
            document.getElementById(`add-subject-input-${semNum}`).value = this.textContent;
            dropdown.style.display = 'none'; // Tutup dropdown
        };
        dropdown.appendChild(item);
    });
}

// 3. Fungsi dipanggil bila pengguna mula menaip
function filterCustomDropdown(semNum) {
    const inputVal = document.getElementById(`add-subject-input-${semNum}`).value;
    const dropdown = document.getElementById(`custom-dropdown-${semNum}`);
    dropdown.style.display = 'block';
    renderCustomDropdown(semNum, inputVal);
}

// 4. Fungsi dipanggil bila pengguna klik kotak input
function showCustomDropdown(semNum) {
    // Tutup mana-mana dropdown semester lain yang mungkin terbuka
    document.querySelectorAll('.custom-select-dropdown').forEach(el => el.style.display = 'none');
    
    const dropdown = document.getElementById(`custom-dropdown-${semNum}`);
    dropdown.style.display = 'block';
    filterCustomDropdown(semNum); // Tunjuk senarai penuh dulu
}

// 5. Tutup dropdown bila pengguna klik merata tempat kat skrin (Luar kawasan)
document.addEventListener('click', function(event) {
    if (!event.target.closest('.manual-item-controls')) {
        document.querySelectorAll('.custom-select-dropdown').forEach(el => {
            el.style.display = 'none';
        });
    }
});