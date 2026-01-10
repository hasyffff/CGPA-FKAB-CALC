
// Baca mode dari URL
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const studentId = urlParams.get('id');

if (mode === 'login' && studentId) {
    // Papar ID di header
    document.body.insertAdjacentHTML('afterbegin', '<div style="text-align:center; padding:10px; background:#007bff; color:white;">ID: ' + studentId + '</div>');
    
    // Load data
    const saved = localStorage.getItem('cgpa_' + studentId);
    if (saved) {
        // Load data ke form (sesuaikan dengan struktur kalkulator anda)
    }
}

// Bila simpan CGPA, tambah:
function simpanCGPA() {
    if (mode === 'login' && studentId) {
        // Simpan data
        localStorage.setItem('cgpa_' + studentId, JSON.stringify({/* data anda */}));
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

// ============================================
// PROGRAM SELECTION
// ============================================
function selectProgram(programType) {
  currentProgram = programType;
  localStorage.setItem('currentProgram', programType);

  document.getElementById('programSelection').style.display = 'none';
  document.getElementById('calculatorPage').style.display = 'block';

  const program = programmes[programType];
  document.getElementById('programTitle').textContent = program.fullName;

  loadSavedData();
  initializeSemesters();
  showSemester(1);
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

// ============================================
// SEMESTER MANAGEMENT
// ============================================
function initializeSemesters() {
    const program = programmes[currentProgram];
    const tabsContainer = document.getElementById('semesterTabs');
    const contentContainer = document.getElementById('semesterContent');
    
    tabsContainer.innerHTML = '';
    contentContainer.innerHTML = '';
    
    Object.keys(program.semesters).forEach(semNum => {
        const tab = document.createElement('button');
        tab.className = 'tab';
        tab.textContent = `Semester ${semNum}`;
        tab.onclick = () => showSemester(parseInt(semNum));
        tabsContainer.appendChild(tab);
        
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester-data';
        semesterDiv.id = `semester-${semNum}`;
        semesterDiv.innerHTML = createSemesterContent(semNum, program.semesters[semNum]);
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
        
        <table class="subject-table">
            <thead>
                <tr>
                    <th style="width: 12%">Kod</th>
                    <th style="width: 40%">Nama Kursus</th>
                    <th style="width: 8%">Kredit</th>
                    <th style="width: 8%">Taraf</th>
                    <th style="width: 20%">Gred</th>
                    <th style="width: 12%">Ambil?</th>
                </tr>
            </thead>
            <tbody>
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
                    <select id="grade-${subjectId}" onchange="saveGradeInput('${subjectId}')">
                        <option value="">- Pilih -</option>
                        ${createGradeOptions(savedGrade)}
                    </select>
                </td>
                <td style="text-align: center;">
                    ${isOptional ? `
                        <input type="checkbox" 
                               id="taken-${subjectId}" 
                               onchange="toggleSubject('${subjectId}')"
                               ${isTaken ? 'checked' : ''}>
                    ` : '✓'}
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        
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
        `<option value="${koku.kod}" data-credit="${koku.kredit}">${koku.nama} (${koku.kredit} kredit)</option>`
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
function saveGradeInput(subjectId) {
    const gradeSelect = document.getElementById(`grade-${subjectId}`);
    savedGrades[subjectId] = gradeSelect.value;
}

function toggleSubject(subjectId) {
    const checkbox = document.getElementById(`taken-${subjectId}`);
    savedGrades[`${subjectId}-taken`] = checkbox.checked;
}

function saveData() {
    const dataToSave = {
        program: currentProgram,
        grades: savedGrades,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cgpa-calculator-data', JSON.stringify(dataToSave));
    alert('✓ Data berjaya disimpan! Data anda akan kekal walaupun tutup browser.');
}

function loadSavedData() {
    const saved = localStorage.getItem('cgpa-calculator-data');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.program === currentProgram) {
            savedGrades = data.grades || {};
        }
    }
}

function clearAll() {
    if (confirm('Anda pasti mahu reset semua data? Tindakan ini tidak boleh dibatalkan.')) {
        savedGrades = {};
        localStorage.removeItem('cgpa-calculator-data');
        initializeSemesters();
        showSemester(1);
        document.getElementById('currentGPA').textContent = '-';
        document.getElementById('overallCGPA').textContent = '-';
        alert('✓ Semua data telah direset.');
    }
}

// ============================================
// CGPA CALCULATION
// ============================================
function calculateAll() {
    const program = programmes[currentProgram];
    let totalGradePoints = 0;
    let totalCredits = 0;
    let semesterResults = {};
    
    Object.keys(program.semesters).forEach(semNum => {
        const subjects = program.semesters[semNum];
        let semGradePoints = 0;
        let semCredits = 0;
        
        subjects.forEach((subject, index) => {
            const subjectId = `${semNum}-${index}`;
            const grade = document.getElementById(`grade-${subjectId}`)?.value;
            const isTaken = document.getElementById(`taken-${subjectId}`)?.checked !== false;
            
            if (grade && isTaken) {
                const points = gradePoints[grade] * subject.kredit;
                semGradePoints += points;
                semCredits += subject.kredit;
            }
        });
        
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
    
    if (totalCredits > 0) {
        alert(`✓ Pengiraan selesai!\n\nCGPA Keseluruhan: ${cgpa}\nJumlah Kredit: ${totalCredits}`);
    } else {
        alert('⚠️ Sila masukkan gred untuk sekurang-kurangnya satu subjek.');
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
    } else if (requiredGPA < 0) {
        resultsDiv.innerHTML = `
            <h4 style="color: #28a745;">✓ Target Sudah Tercapai!</h4>
            <p>CGPA semasa anda (<strong>${(totalGradePoints / totalCredits).toFixed(2)}</strong>) sudah melebihi target!</p>
        `;
    } else {
        resultsDiv.innerHTML = `
            <h4 style="color: #667eea;">🎯 Ramalan untuk Target CGPA ${targetCGPA.toFixed(2)}</h4>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p><strong>CGPA Semasa:</strong> ${(totalGradePoints / totalCredits).toFixed(2)}</p>
                <p><strong>Kredit Selesai:</strong> ${totalCredits}</p>
                <p><strong>Kredit Tinggal:</strong> ${remainingCredits}</p>
                <hr style="margin: 15px 0;">
                <p style="font-size: 1.1em;"><strong>GPA Minimum Diperlukan:</strong> <span style="color: #667eea; font-size: 1.3em;">${requiredGPA.toFixed(2)}</span></p>
                
                <h5 style="margin-top: 20px;">Scenario Gred:</h5>
                <ul style="line-height: 1.8;">
                    <li>Jika semua subjek dapat <strong>A (4.00)</strong>: CGPA = ${((totalGradePoints + remainingCredits * 4.0) / (totalCredits + remainingCredits)).toFixed(2)}</li>
                    <li>Jika semua subjek dapat <strong>B+ (3.50)</strong>: CGPA = ${((totalGradePoints + remainingCredits * 3.5) / (totalCredits + remainingCredits)).toFixed(2)}</li>
                    <li>Jika semua subjek dapat <strong>B (3.00)</strong>: CGPA = ${((totalGradePoints + remainingCredits * 3.0) / (totalCredits + remainingCredits)).toFixed(2)}</li>
                </ul>
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
