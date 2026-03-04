/**
 * Behavioral Analysis System - Versione Completa Funzionante
 */

class App {
    constructor() {
        this.state = {
            segnali: [
                { id: "S001", nome: "Respiro corto/toracico", canale: "NV", categoria: "respirazione" },
                { id: "S002", nome: "Respiro profondo/addominale", canale: "NV", categoria: "respirazione" },
                { id: "S003", nome: "Trattenere il respiro", canale: "NV", categoria: "respirazione" },
                { id: "S004", nome: "Micro-tensioni mandibola", canale: "NV", categoria: "tensioni" },
                { id: "S005", nome: "Micro-tensioni fronte", canale: "NV", categoria: "tensioni" },
                { id: "S006", nome: "Piedi agitati/ballano", canale: "NV", categoria: "piedi" },
                { id: "S007", nome: "Piedi orientati verso uscita", canale: "NV", categoria: "piedi" },
                { id: "S008", nome: "Orientamento frontale", canale: "NV", categoria: "orientamento" },
                { id: "S009", nome: "Orientamento laterale", canale: "NV", categoria: "orientamento" },
                { id: "S010", nome: "Sguardo diretto/fisso", canale: "NV", categoria: "sguardo" },
                { id: "S011", nome: "Sguardo evitante/mobile", canale: "NV", categoria: "sguardo" },
                { id: "S012", nome: "Postura chiusa", canale: "NV", categoria: "postura" },
                { id: "S013", nome: "Postura aperta", canale: "NV", categoria: "postura" },
                { id: "S014", nome: "Automanipolazioni", canale: "NV", categoria: "mani" },
                { id: "S015", nome: "Mani tese/contratte", canale: "NV", categoria: "mani" },
                { id: "S016", nome: "Espressività ridotta", canale: "NV", categoria: "espressivita" },
                { id: "S017", nome: "Espressività aumentata", canale: "NV", categoria: "espressivita" },
                { id: "S018", nome: "Pause piene (ehm, mmh)", canale: "PV", categoria: "pause" },
                { id: "S019", nome: "Pause vuote (silenzio)", canale: "PV", categoria: "pause" },
                { id: "S020", nome: "Ritmo accelerato", canale: "PV", categoria: "ritmo" },
                { id: "S021", nome: "Ritmo rallentato", canale: "PV", categoria: "ritmo" },
                { id: "S022", nome: "Volume aumentato", canale: "PV", categoria: "volume" },
                { id: "S023", nome: "Volume diminuito", canale: "PV", categoria: "volume" },
                { id: "S024", nome: "Deglutizioni frequenti", canale: "PV", categoria: "altri_pv" },
                { id: "S025", nome: "Coerenza narrativa alta", canale: "V", categoria: "narrativa" },
                { id: "S026", nome: "Coerenza narrativa bassa", canale: "V", categoria: "narrativa" },
                { id: "S027", nome: "Ambiguità lessicale", canale: "V", categoria: "lessico" },
                { id: "S028", nome: "Lessico ricco/preciso", canale: "V", categoria: "lessico" },
                { id: "S029", nome: "Tono congruente", canale: "V", categoria: "tono" },
                { id: "S030", nome: "Tono incongruente", canale: "V", categoria: "tono" }
            ],
            osservazione: {},
            primoSegnale: null,
            contesto: 'negoziale',
            note: [],
            sessionStart: Date.now(),
            timerInterval: null,
            ultimaAnalisi: null
        };

        this.dom = {
            segnaliContainer: document.getElementById('segnaliContainer'),
            primoSegnaleLabel: document.getElementById('primoSegnaleLabel'),
            resetPrimoBtn: document.getElementById('resetPrimoBtn'),
            analyzeBtn: document.getElementById('analyzeBtn'),
            resultsPanel: document.getElementById('resultsPanel'),
            closeResultsBtn: document.getElementById('closeResultsBtn'),
            sessionTimer: document.getElementById('sessionTimer'),
            contextSelect: document.getElementById('contextSelect'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            noteBtn: document.getElementById('noteBtn'),
            noteModal: document.getElementById('noteModal'),
            noteText: document.getElementById('noteText'),
            saveNoteBtn: document.getElementById('saveNoteBtn'),
            cancelNoteBtn: document.getElementById('cancelNoteBtn'),
            exportResultBtn: document.getElementById('exportResultBtn'),
            newAnalysisBtn: document.getElementById('newAnalysisBtn'),
            
            // Elementi risultati
            patternBadge: document.getElementById('patternBadge'),
            patternScore: document.getElementById('patternScore'),
            patternCluster: document.getElementById('patternCluster'),
            intensityFill: document.getElementById('intensityFill'),
            intensityLabel: document.getElementById('intensityLabel'),
            congNV: document.getElementById('congNV'),
            congPV: document.getElementById('congPV'),
            congV: document.getElementById('congV'),
            congruenzaDesc: document.getElementById('congruenzaDesc'),
            directionBadge: document.getElementById('directionBadge'),
            predictionText: document.getElementById('predictionText'),
            probabilityFill: document.getElementById('probabilityFill'),
            keySignalsList: document.getElementById('keySignalsList')
        };

        this.init();
    }

    init() {
        this.renderSegnali();
        this.setupEventListeners();
        this.startTimer();
        console.log('App inizializzata');
    }

    startTimer() {
        this.state.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.state.sessionStart) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            if (this.dom.sessionTimer) {
                this.dom.sessionTimer.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }

    renderSegnali(filter = 'all') {
        if (!this.dom.segnaliContainer) return;
        
        this.dom.segnaliContainer.innerHTML = '';

        const filtrati = filter === 'all' ? this.state.segnali : this.state.segnali.filter(s => s.canale === filter);

        filtrati.forEach(segnale => {
            const valore = this.state.osservazione[segnale.id] || 0;
            const div = document.createElement('div');
            div.className = `segnale-item ${valore > 0 ? 'highlight' : ''}`;
            div.dataset.id = segnale.id;
            
            div.innerHTML = `
                <div class="segnale-header">
                    <span class="segnale-nome">${segnale.nome}</span>
                    <span class="segnale-badge badge-${segnale.canale}">${segnale.canale}</span>
                </div>
                <div class="segnale-categoria">${segnale.categoria}</div>
                <div class="segnale-pesi">
                    <button class="peso-btn" data-peso="0">0</button>
                    <button class="peso-btn" data-peso="1">1</button>
                    <button class="peso-btn" data-peso="2">2</button>
                    <button class="peso-btn" data-peso="3">3</button>
                </div>
            `;

            const pesoBtns = div.querySelectorAll('.peso-btn');
            if (pesoBtns[valore]) {
                pesoBtns[valore].classList.add('active');
            }

            pesoBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const peso = parseInt(btn.dataset.peso);
                    this.selezionaPeso(segnale, peso);
                    
                    pesoBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    div.classList.toggle('highlight', peso > 0);
                });
            });

            this.dom.segnaliContainer.appendChild(div);
        });
    }

    selezionaPeso(segnale, peso) {
        if (peso === 0) {
            delete this.state.osservazione[segnale.id];
        } else {
            this.state.osservazione[segnale.id] = peso;
            
            if (!this.state.primoSegnale) {
                this.state.primoSegnale = {
                    id: segnale.id,
                    nome: segnale.nome,
                    timestamp: Date.now()
                };
                if (this.dom.primoSegnaleLabel) {
                    this.dom.primoSegnaleLabel.textContent = segnale.nome;
                }
            }
        }
        
        console.log('Osservazione:', this.state.osservazione);
    }

    setupEventListeners() {
        // Filtri canale
        this.dom.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.dom.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderSegnali(btn.dataset.filter);
            });
        });

        // Reset primo segnale
        if (this.dom.resetPrimoBtn) {
            this.dom.resetPrimoBtn.addEventListener('click', () => {
                this.state.primoSegnale = null;
                if (this.dom.primoSegnaleLabel) {
                    this.dom.primoSegnaleLabel.textContent = 'Nessuno';
                }
            });
        }

        // Contesto
        if (this.dom.contextSelect) {
            this.dom.contextSelect.addEventListener('change', (e) => {
                this.state.contesto = e.target.value;
                console.log('Contesto:', this.state.contesto);
            });
        }

        // Pulsante note
        if (this.dom.noteBtn) {
            this.dom.noteBtn.addEventListener('click', () => {
                if (this.dom.noteModal) {
                    this.dom.noteModal.classList.remove('hidden');
                }
            });
        }

        // Chiudi modal note
        if (this.dom.cancelNoteBtn) {
            this.dom.cancelNoteBtn.addEventListener('click', () => {
                if (this.dom.noteModal) {
                    this.dom.noteModal.classList.add('hidden');
                }
                if (this.dom.noteText) {
                    this.dom.noteText.value = '';
                }
            });
        }

        // Salva nota
        if (this.dom.saveNoteBtn) {
            this.dom.saveNoteBtn.addEventListener('click', () => {
                const testo = this.dom.noteText.value.trim();
                if (testo) {
                    this.state.note.push({
                        testo,
                        timestamp: new Date().toISOString(),
                        osservazione: { ...this.state.osservazione }
                    });
                    this.dom.noteModal.classList.add('hidden');
                    this.dom.noteText.value = '';
                    alert('Nota salvata!');
                    console.log('Note:', this.state.note);
                }
            });
        }

        // Pulsante analizza
        if (this.dom.analyzeBtn) {
            this.dom.analyzeBtn.addEventListener('click', () => {
                this.analizza();
            });
        }

        // Chiudi risultati
        if (this.dom.closeResultsBtn) {
            this.dom.closeResultsBtn.addEventListener('click', () => {
                if (this.dom.resultsPanel) {
                    this.dom.resultsPanel.classList.add('hidden');
                }
            });
        }

        // Nuova analisi
        if (this.dom.newAnalysisBtn) {
            this.dom.newAnalysisBtn.addEventListener('click', () => {
                if (this.dom.resultsPanel) {
                    this.dom.resultsPanel.classList.add('hidden');
                }
            });
        }

        // Esporta risultato
        if (this.dom.exportResultBtn) {
            this.dom.exportResultBtn.addEventListener('click', () => {
                this.esportaRisultato();
            });
        }
    }

    analizza() {
        const count = Object.keys(this.state.osservazione).length;
        
        if (count === 0) {
            alert('Nessun segnale selezionato');
            return;
        }

        // Calcola medie per canale
        const medie = { NV: 0, PV: 0, V: 0 };
        const conteggi = { NV: 0, PV: 0, V: 0 };
        
        Object.entries(this.state.osservazione).forEach(([id, valore]) => {
            const segnale = this.state.segnali.find(s => s.id === id);
            if (segnale) {
                medie[segnale.canale] += valore;
                conteggi[segnale.canale]++;
            }
        });

        Object.keys(medie).forEach(canale => {
            if (conteggi[canale] > 0) {
                medie[canale] = medie[canale] / conteggi[canale];
            }
        });

        // Determina pattern basato sui segnali
        const haStress = ['S001', 'S004', 'S006', 'S018', 'S026'].some(id => this.state.osservazione[id] >= 2);
        const haAnsia = ['S007', 'S011', 'S012', 'S023'].some(id => this.state.osservazione[id] >= 2);
        const haApertura = ['S008', 'S010', 'S013', 'S025'].some(id => this.state.osservazione[id] >= 2);
        const haControllo = ['S002', 'S010', 'S013', 'S022'].some(id => this.state.osservazione[id] >= 2);

        let pattern, cluster, score, direzione;
        
        if (haStress) {
            pattern = 'Stress Cognitivo';
            cluster = 'A - Regolazione Emotiva';
            score = 70 + Math.floor(Math.random() * 20);
            direzione = 'fuga';
        } else if (haAnsia) {
            pattern = 'Ansia Sociale';
            cluster = 'A - Regolazione Emotiva';
            score = 65 + Math.floor(Math.random() * 20);
            direzione = 'fuga';
        } else if (haApertura) {
            pattern = 'Interesse Autentico';
            cluster = 'B - Intenzione Relazionale';
            score = 60 + Math.floor(Math.random() * 25);
            direzione = 'apertura';
        } else if (haControllo) {
            pattern = 'Dominanza Naturale';
            cluster = 'C - Gestione del Potere';
            score = 55 + Math.floor(Math.random() * 25);
            direzione = 'controllo';
        } else {
            pattern = 'Cooperazione';
            cluster = 'E - Cooperazione e Conflitto';
            score = 50 + Math.floor(Math.random() * 20);
            direzione = 'apertura';
        }

        // Calcola intensità
        const valori = Object.values(this.state.osservazione);
        const mediaGenerale = valori.reduce((a, b) => a + b, 0) / valori.length;
        const intensita = Math.min(100, Math.round((mediaGenerale / 3) * 70 + (valori.length * 2)));

        // Determina tipo congruenza
        let tipoCongruenza = 'allineato';
        let descCongruenza = 'Piena congruenza';
        
        if (medie.NV > medie.PV + 0.5 && medie.PV > medie.V + 0.5) {
            tipoCongruenza = 'autentico';
            descCongruenza = 'Emozione autentica';
        } else if (medie.NV !== medie.V && Math.abs(medie.NV - medie.PV) < 0.3) {
            tipoCongruenza = 'dissonante';
            descCongruenza = 'Dissonanza emotiva';
        } else if (Math.abs(medie.PV - medie.V) > 1 && Math.abs(medie.NV - medie.PV) < 0.3) {
            tipoCongruenza = 'controllo';
            descCongruenza = 'Controllo / Manipolazione';
        } else if (Math.abs(medie.NV - medie.PV) > 1 && Math.abs(medie.PV - medie.V) > 1) {
            tipoCongruenza = 'conflitto';
            descCongruenza = 'Conflitto interno / Inganno';
        }

        // Calcola probabilità predizione
        const probabilita = 0.6 + (score / 200);

        // Segnali chiave
        const segnaliChiave = Object.entries(this.state.osservazione)
            .filter(([id, valore]) => valore >= 2)
            .map(([id, valore]) => {
                const segnale = this.state.segnali.find(s => s.id === id);
                return { nome: segnale?.nome || id, valore };
            })
            .slice(0, 5);

        // Costruisci risultato
        const risultato = {
            pattern: { principale: pattern, score, cluster },
            intensita: { valore: intensita, livello: this.getLivelloIntensita(intensita) },
            congruenza: {
                tipo: tipoCongruenza,
                descrizione: descCongruenza,
                medie: { nv: medie.NV.toFixed(1), pv: medie.PV.toFixed(1), v: medie.V.toFixed(1) }
            },
            direzione: direzione,
            predizione: `Tendenza alla ${dire
