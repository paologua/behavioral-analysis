// ==================== STATO GLOBALE ====================
let SEGNALI = [];
let PATTERN_LIBRARY = [];
let CONTESTI = {};
let selected = new Set();
let sessionLog = [];
let primoSegnale = null;
let secondi = 0;
let timerInterval;

// ==================== CARICAMENTO DATI JSON ====================
async function caricaDati() {
    try {
        document.getElementById('pattern-counter').innerHTML = '📚 Caricamento dati...';
        
        // Carica segnali
        const resSegnali = await fetch('data/segnali.json');
        const dataSegnali = await resSegnali.json();
        SEGNALI = dataSegnali.segnali || dataSegnali;
        
        // Carica patterns
        const resPatterns = await fetch('data/patterns.json');
        const dataPatterns = await resPatterns.json();
        PATTERN_LIBRARY = dataPatterns.patterns || dataPatterns;
        
        // Carica contesti
        const resContesti = await fetch('data/contesti.json');
        CONTESTI = await resContesti.json();
        
        console.log('✅ Dati caricati:', {
            segnali: SEGNALI.length,
            patterns: PATTERN_LIBRARY.length,
            contesti: Object.keys(CONTESTI).length
        });
        
        document.getElementById('pattern-counter').innerHTML = `📚 ${PATTERN_LIBRARY.length} Pattern caricati`;
        
        // Avvia l'app
        initApp();
        
    } catch (error) {
        console.error('❌ Errore caricamento:', error);
        document.getElementById('pattern-counter').innerHTML = '❌ Errore caricamento dati';
    }
}

// ==================== TIMER ====================
function avviaTimer() {
    timerInterval = setInterval(() => {
        secondi++;
        const min = Math.floor(secondi / 60).toString().padStart(2, '0');
        const sec = (secondi % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${min}:${sec}`;
    }, 1000);
}

// ==================== RENDER SEGNALI ====================
function renderSegnali() {
    const container = document.getElementById('btn-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    SEGNALI.forEach(s => {
        const btn = document.createElement('button');
        btn.className = `btn ${s.zona} ${selected.has(s.id) ? 'active' : ''}`;
        btn.innerText = `${s.id}: ${s.nome.substring(0, 20)}`;
        btn.onclick = () => toggleSegnale(s.id);
        container.appendChild(btn);
    });
}

// ==================== TOGGLE SEGNALE ====================
function toggleSegnale(id) {
    if (selected.has(id)) {
        selected.delete(id);
    } else {
        selected.add(id);
        
        if (!primoSegnale) {
            const segnale = SEGNALI.find(s => s.id === id);
            primoSegnale = segnale.nome;
            document.getElementById('primoSegnaleLabel').textContent = segnale.nome;
        }
    }
    
    // Aggiorna UI
    document.querySelectorAll('.btn').forEach(btn => {
        const btnId = btn.innerText.split(':')[0];
        if (selected.has(btnId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    updateStats();
}

// ==================== UPDATE STATS ====================
function updateStats() {
    document.getElementById('active-count').innerText = selected.size;
}

// ==================== ANALISI IDENTITÀ ====================
function analizzaIdentita() {
    const pesi = {
        competenza: { S024: 2, S025: 2, S008: 1, S020: 1, S045: 1 },
        intelligenza: { S025: 2, S033: 1.5, S005: 1, S045: 1.5, S047: 1 },
        status: { S008: 2, S019: 1.5, S029: 1.5, S024: 1, S013: 1 },
        indipendenza: { S007: 2, S009: 2, S034: 1.5, S050: 1.5, S039: 1 },
        moralita: { S045: 2.5, S049: 2, S040: -1.5, S046: -1.5, S029: -1 },
        superiorita: { S029: 2, S019: 2, S013: 1.5, S001: -1, S004: -1 },
        sicurezza: { S002: 2, S008: 2, S024: 1.5, S045: 1.5, S019: 1 }
    };
    
    let punteggi = {};
    Object.keys(pesi).forEach(tratto => {
        let totale = 0, massimo = 0;
        Object.entries(pesi[tratto]).forEach(([segnale, peso]) => {
            const segnaleObj = SEGNALI.find(s => s.id === segnale);
            const valore = selected.has(segnale) ? (segnaleObj?.peso || 1) : 0;
            if (peso > 0) { totale += valore * peso; massimo += 4 * peso; }
            else { totale -= valore * Math.abs(peso); massimo += 4 * Math.abs(peso); }
        });
        punteggi[tratto] = massimo > 0 ? Math.min(100, Math.max(0, Math.round((totale / massimo) * 100))) : 0;
    });
    return punteggi;
}

function getIdentitaDominante(punteggi) {
    let max = 0, dominante = 'neutro';
    Object.entries(punteggi).forEach(([tratto, val]) => { if (val > max) { max = val; dominante = tratto; } });
    let livello = 'basso';
    if (max >= 70) livello = 'alto';
    else if (max >= 40) livello = 'medio';
    return { dominante, livello, punteggio: max };
}

// ==================== CALCOLA ANALISI ====================
function calcolaAnalisi() {
    let risultati = [];
    let vettori = { apertura: 0, fuga: 0, controllo: 0, approccio: 0, dipendenza: 0, sottomissione: 0, vittima: 0, conflitto: 0, indiretto: 0 };
    let canali = { NV: 0, PV: 0, V: 0 };
    let conteggi = { NV: 0, PV: 0, V: 0 };
    
    const contestoKey = document.getElementById('ctx').value;
    const ctx = CONTESTI[contestoKey] || { moltiplicatore: 1, focus: [] };

    // Calcolo canali
    selected.forEach(id => {
        const s = SEGNALI.find(s => s.id === id);
        if (!s) return;
        if (s.zona === "NV") { canali.NV += s.peso; conteggi.NV++; }
        else if (s.zona === "PV") { canali.PV += s.peso; conteggi.PV++; }
        else if (s.zona === "V") { canali.V += s.peso; conteggi.V++; }
    });

    // Calcolo pattern
    PATTERN_LIBRARY.forEach(pattern => {
        let score = 0;
        let max = 0;
        pattern.segnali.forEach(sID => {
            const segnale = SEGNALI.find(s => s.id === sID);
            if (!segnale) return;
            max += segnale.peso;
            if (selected.has(sID)) score += segnale.peso;
        });

        let prob = max > 0 ? (score / max) * 100 : 0;
        
        if (ctx.focus.includes(pattern.cluster)) {
            prob *= ctx.moltiplicatore || 1;
        }

        if (prob > 15) {
            risultati.push({ 
                nome: pattern.nome, 
                prob: Math.min(Math.round(prob), 100), 
                direzione: pattern.direzione 
            });
            if (vettori[pattern.direzione] !== undefined) {
                vettori[pattern.direzione] += prob;
            }
        }
    });

    risultati.sort((a, b) => b.prob - a.prob);
    
    let direzione = 'neutrale';
    let maxVettore = 0;
    Object.entries(vettori).forEach(([dir, val]) => {
        if (val > maxVettore) { maxVettore = val; direzione = dir; }
    });
    
    const totaleSegnali = selected.size;
    const intensitaRaw = Math.min(100, totaleSegnali * 2 + (canali.NV + canali.PV + canali.V) * 2);
    const intensita = intensitaRaw > 70 ? "FORTE" : intensitaRaw > 40 ? "MODERATA" : "LEGGERA";
    
    const incongruenza = Math.abs(canali.NV - canali.PV) > 1.5 || Math.abs(canali.NV - canali.V) > 1.5;

    return {
        top: risultati.slice(0, 3),
        tutti: risultati,
        direzione: direzione,
        intensita: intensita,
        intensitaRaw: Math.round(intensitaRaw),
        canali: canali,
        conteggi: conteggi,
        incongruenza: incongruenza,
        totaleSegnali: totaleSegnali,
        patternCount: risultati.length
    };
}

function generaSuggerimento(direzione) {
    const suggerimenti = {
        apertura: "La persona è recettiva e collaborativa. Incoraggia lo scambio.",
        fuga: "Possibile disagio o chiusura. Rallenta, crea spazio e rassicura.",
        controllo: "Tentativo di dominare la situazione. Mantieni la calma e non opporti direttamente.",
        approccio: "Interesse crescente. Approfondisci senza forzare.",
        dipendenza: "Ricerca di approvazione. Fornisci rinforzi positivi.",
        sottomissione: "Atteggiamento remissivo. Incoraggia l'espressione.",
        vittima: "Posizione di vittima. Evita di alimentare il ruolo.",
        conflitto: "Tensione evidente. De-escala e mantieni la calma.",
        indiretto: "Comunicazione indiretta. Chiarisci e chiedi esplicitamente.",
        neutrale: "Baseline stabile. Continua osservazione."
    };
    return suggerimenti[direzione] || "Continua osservazione...";
}

// ==================== ANALIZZA ====================
function analizza() {
    if (selected.size === 0) {
        alert('Seleziona almeno un segnale');
        return;
    }
    
    const data = calcolaAnalisi();
    const identita = analizzaIdentita();
    const dominante = getIdentitaDominante(identita);
    
    // Aggiorna valori canali
    document.getElementById('valoreNV').innerText = data.canali.NV.toFixed(1);
    document.getElementById('valorePV').innerText = data.canali.PV.toFixed(1);
    document.getElementById('valoreV').innerText = data.canali.V.toFixed(1);
    
    // Aggiorna barre
    document.getElementById('bar-nv').style.width = Math.min(100, data.canali.NV * 8) + '%';
    document.getElementById('bar-pv').style.width = Math.min(100, data.canali.PV * 8) + '%';
    document.getElementById('bar-v').style.width = Math.min(100, data.canali.V * 8) + '%';
    
    document.getElementById('nv-detail').innerText = `${data.conteggi.NV}/25`;
    document.getElementById('pv-detail').innerText = `${data.conteggi.PV}/13`;
    document.getElementById('v-detail').innerText = `${data.conteggi.V}/12`;
    
    document.getElementById('alert-box').style.display = data.incongruenza ? 'block' : 'none';
    document.getElementById('intensity-level').innerText = data.intensitaRaw + '%';
    document.getElementById('pattern-count').innerText = data.patternCount;
    
    // Pattern principale
    const out = document.getElementById('res');
    if (data.top.length > 0) {
        out.innerHTML = `
            <strong style="font-size:1.2rem;">${data.top[0].nome}</strong> 
            <span class="direzione-badge ${data.direzione}">${data.top[0].prob}%</span>
            <div style="margin-top:8px;">📊 Intensità: <strong>${data.intensita}</strong> (${data.intensitaRaw}%) | Direzione: <strong>${data.direzione.toUpperCase()}</strong></div>
        `;
        document.getElementById('adv').innerHTML = `💡 ${generaSuggerimento(data.direzione)}`;
        
        // Pattern secondari
        let secHtml = '';
        for (let i = 1; i < Math.min(4, data.top.length); i++) {
            secHtml += `<div style="margin:5px 0;">• ${data.top[i].nome} <span style="color:#666;">(${data.top[i].prob}%)</span></div>`;
        }
        document.getElementById('secondary-patterns').innerHTML = secHtml || '<div style="color:#666;">Nessuno</div>';
        
        // Log
        let entry = `${new Date().toLocaleTimeString()} - ${data.top[0].nome}`;
        if (sessionLog[0] !== entry) {
            sessionLog.unshift(entry);
            if (sessionLog.length > 5) sessionLog.pop();
            document.getElementById('log').innerHTML = sessionLog.join('<br>');
        }
    } else {
        out.innerHTML = "🌀 Baseline - Nessuna deviazione significativa";
        document.getElementById('adv').innerHTML = "Seleziona uno o più segnali per attivare l'analisi";
        document.getElementById('secondary-patterns').innerHTML = '';
    }
    
    // Identità
    document.getElementById('identita-dominante').innerText = `${dominante.dominante} (${dominante.livello})`;
    
    let identitaHtml = '';
    const colori = {
        competenza: '#3498db', intelligenza: '#9b59b6', status: '#f1c40f',
        indipendenza: '#e67e22', moralita: '#2ecc71', superiorita: '#e74c3c', sicurezza: '#1abc9c'
    };
    Object.entries(identita).forEach(([tratto, valore]) => {
        identitaHtml += `
            <div class="identita-item">
                <div class="identita-label">${tratto}</div>
                <div class="identita-valore" style="color:${colori[tratto]}">${valore}%</div>
                <div class="identita-bar">
                    <div class="identita-fill" style="width:${valore}%; background:${colori[tratto]};"></div>
                </div>
            </div>
        `;
    });
    document.getElementById('identita-grid').innerHTML = identitaHtml;
}

// ==================== RESET ====================
function reset() {
    if (confirm("Resettare tutti i segnali?")) {
        selected.clear();
        primoSegnale = null;
        document.getElementById('primoSegnaleLabel').textContent = 'Nessuno';
        renderSegnali();
        updateStats();
        document.getElementById('res').innerHTML = '';
        document.getElementById('secondary-patterns').innerHTML = '';
        document.getElementById('adv').innerHTML = '';
        document.getElementById('valoreNV').innerText = '0';
        document.getElementById('valorePV').innerText = '0';
        document.getElementById('valoreV').innerText = '0';
        document.getElementById('bar-nv').style.width = '0%';
        document.getElementById('bar-pv').style.width = '0%';
        document.getElementById('bar-v').style.width = '0%';
        document.getElementById('nv-detail').innerText = '0/25';
        document.getElementById('pv-detail').innerText = '0/13';
        document.getElementById('v-detail').innerText = '0/12';
        document.getElementById('pattern-count').innerText = '0';
        document.getElementById('alert-box').style.display = 'none';
    }
}

// ==================== SETUP ====================
function initApp() {
    renderSegnali();
    avviaTimer();
    
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('analizzaBtn').addEventListener('click', analizza);
    document.getElementById('resetPrimo').addEventListener('click', () => {
        primoSegnale = null;
        document.getElementById('primoSegnaleLabel').textContent = 'Nessuno';
    });
}

// ==================== AVVIO ====================
caricaDati();
