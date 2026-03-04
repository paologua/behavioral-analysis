// Import moduli (in browser si usano le variabili globali)
// I moduli sono già caricati come file separati

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
            sessionStart: Date.now(),
            timerInterval: null,
            inferenceEngine: null,
            risultati: null
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
            
            patternBadge: document.getElementById('patternBadge'),
            patternScore: document.getElementById('patternScore'),
            intensityFill: document.getElementById('intensityFill'),
            intensityLabel: document.getElementById('intensityLabel'),
            directionBadge: document.getElementById('directionBadge'),
            predictionText: document.getElementById('predictionText'),
            detailsJson: document.getElementById('detailsJson')
        };

        this.init();
    }

    init() {
        this.initInferenceEngine();
        this.renderSegnali();
        this.setupEventListeners();
        this.startTimer();
    }

    initInferenceEngine() {
        if (typeof InferenceEngine !== 'undefined') {
            this.state.inferenceEngine = new InferenceEngine(this.state.segnali, []);
        } else {
            console.warn('InferenceEngine non trovato, uso modalità simulata');
        }
    }

    startTimer() {
        this.state.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.state.sessionStart) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.dom.sessionTimer.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    renderSegnali(filter = 'all') {
        const container = this.dom.segnaliContainer;
        container.innerHTML = '';

        const filtrati = filter === 'all' ? this.state.segnali : this.state.segnali.filter(s => s.canale === filter);

        filtrati.forEach(segnale => {
            const valore = this.state.osservazione[segnale.id] || 0;
            const div = document.createElement('div');
            div.className = `segnale-item ${valore > 0 ? 'highlight' : ''}`;
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
            if (pesoBtns[valore]) pesoBtns[valore].classList.add('active');

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

            container.appendChild(div);
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
                this.dom.primoSegnaleLabel.textContent = segnale.nome;
            }
        }
    }

    setupEventListeners() {
        // Filtri
        this.dom.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.dom.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderSegnali(btn.dataset.filter);
            });
        });

        // Reset primo segnale
        this.dom.resetPrimoBtn.addEventListener('click', () => {
            this.state.primoSegnale = null;
            this.dom.primoSegnaleLabel.textContent = 'Nessuno';
        });

        // Contesto
        this.dom.contextSelect.addEventListener('change', (e) => {
            this.state.contesto = e.target.value;
        });

        // Analizza
        this.dom.analyzeBtn.addEventListener('click', () => {
            this.analizza();
        });

        // Chiudi risultati
        this.dom.closeResultsBtn.addEventListener('click', () => {
            this.dom.resultsPanel.classList.add('hidden');
        });
    }

    analizza() {
        const count = Object.keys(this.state.osservazione).length;
        
        if (count === 0) {
            alert('Nessun segnale selezionato');
            return;
        }

        let risultati;

        if (this.state.inferenceEngine) {
            // Usa il motore reale
            risultati = this.state.inferenceEngine.analizza(
                this.state.osservazione,
                {
                    primoSegnaleId: this.state.primoSegnale?.id,
                    contesto: this.state.contesto
                }
            );
        } else {
            // Fallback simulato
            const pattern = ['Stress Cognitivo', 'Ansia Sociale', 'Interesse Autentico', 'Cooperazione', 'Dominanza Naturale'][Math.floor(Math.random() * 5)];
            const score = 60 + Math.floor(Math.random() * 30);
            const intensita = 50 + Math.floor(Math.random() * 40);
            const direzioni = ['Approccio', 'Fuga', 'Controllo', 'Apertura'];
            const direzione = direzioni[Math.floor(Math.random() * direzioni.length)];

            risultati = {
                pattern: { principale: { pattern, score } },
                intensita: { valore: intensita, livello: 'attivo' },
                congruenza: { tipo: 'dissonante', descrizione: 'Dissonanza emotiva' },
                direzione: direzione.toLowerCase(),
                predizione: `Predizione: ${direzione}`,
                probabilita: 0.75,
                dettagli: { confidenza: 0.8 }
            };
        }

        this.state.risultati = risultati;
        this.mostraRisultati(risultati);
    }

    mostraRisultati(r) {
        this.dom.patternBadge.textContent = r.pattern?.principale?.pattern || 'Non identificato';
        this.dom.patternScore.textContent = (r.pattern?.principale?.score || 0) + '%';
        
        const intensitaVal = r.intensita?.valore || 0;
        this.dom.intensityFill.style.width = intensitaVal + '%';
        this.dom.intensityLabel.textContent = `Intensità: ${intensitaVal}% (${r.intensita?.livello || 'attivo'})`;
        
        this.dom.directionBadge.textContent = `↪️ ${r.direzione || 'indeterminata'}`;
        this.dom.predictionText.textContent = r.predizione || 'Predizione non disponibile';
        
        this.dom.detailsJson.textContent = JSON.stringify({
            congruenza: r.congruenza?.tipo || 'non disponibile',
            confidenza: r.dettagli?.confidenza || 0.8,
            segnali: Object.keys(this.state.osservazione).length,
            primo: this.state.primoSegnale?.nome || 'nessuno',
            contesto: this.state.contesto
        }, null, 2);

        this.dom.resultsPanel.classList.remove('hidden');
    }
}

// Avvia app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
