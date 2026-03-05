/**
 * Behavioral Analysis System - App Principale
 * Versione 50 Segnali / 50 Pattern
 */

// Import moduli
const PATTERN_LIBRARY = require('./core/pattern_library.js');
const SEGNALI = require('./data/segnali.json').segnali;
const CONTESTI = require('./data/contesti.json').contesti;

// Core modules
const BaselineEngine = require('./core/baseline_engine.js');
const CongruenzaMatrix = require('./core/congruenza_matrix.js');
const PriorityRules = require('./core/priority_rules.js');
const PatternMatcher = require('./core/pattern_matcher.js');
const InferenceEngine = require('./core/inference_engine.js');

// Advanced modules
const IntensitaCalculator = require('./modules/intensita_calculator.js');
const ContestoModulator = require('./modules/contesto_modulator.js');
const PredictionEngine = require('./modules/prediction_engine.js');
const IdentitaAnalyzer = require('./modules/identita_analyzer.js');

// Utils
const ExportManager = require('./utils/export_manager.js');
const Validators = require('./utils/validators.js');

class App {
    constructor() {
        this.state = {
            segnali: SEGNALI,
            osservazione: {},
            primoSegnale: null,
            note: [],
            contesto: 'NEGOZIALE',
            sessionStart: Date.now(),
            timerInterval: null
        };
        
        // Inizializza tutti i segnali a 0
        SEGNALI.forEach(s => { this.state.osservazione[s.id] = 0; });
        
        // Inizializza moduli
        this.identitaAnalyzer = new IdentitaAnalyzer(SEGNALI);
        this.inferenceEngine = new InferenceEngine(SEGNALI, PATTERN_LIBRARY);
        this.exportManager = new ExportManager();
        
        this.init();
    }
    
    init() {
        this.renderSegnali();
        this.setupEventListeners();
        this.startTimer();
    }
    
    startTimer() {
        let secondi = 0;
        this.state.timerInterval = setInterval(() => {
            secondi++;
            const min = Math.floor(secondi / 60).toString().padStart(2, '0');
            const sec = (secondi % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${min}:${sec}`;
        }, 1000);
    }
    
    renderSegnali() {
        const container = document.getElementById('segnaliContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.state.segnali.forEach(s => {
            const valore = this.state.osservazione[s.id] || 0;
            const div = document.createElement('div');
            div.className = `segnale-item ${valore > 0 ? 'attivo' : ''}`;
            
            let pesiHtml = '';
            for (let i = 0; i <= 4; i++) {
                pesiHtml += `<button class="peso-btn ${valore === i ? 'active' : ''}" data-id="${s.id}" data-peso="${i}">${i}</button>`;
            }
            
            div.innerHTML = `
                <div class="segnale-header">
                    <span class="segnale-nome">${s.nome}</span>
                    <span class="badge badge-${s.zona}">${s.zona}</span>
                </div>
                <div class="segnale-pesi">
                    ${pesiHtml}
                </div>
            `;
            
            container.appendChild(div);
        });
        
        // Event listeners per i pulsanti
        document.querySelectorAll('.peso-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                const peso = parseInt(btn.dataset.peso);
                this.setPeso(id, peso);
            });
        });
    }
    
    setPeso(id, peso) {
        this.state.osservazione[id] = peso;
        
        // Gestione primo segnale
        if (peso > 0 && !this.state.primoSegnale) {
            const segnale = this.state.segnali.find(s => s.id === id);
            this.state.primoSegnale = segnale.nome;
            document.getElementById('primoSegnaleLabel').textContent = segnale.nome;
        }
        
        this.renderSegnali();
        this.updateStats();
    }
    
    updateStats() {
        const attivi = Object.values(this.state.osservazione).filter(v => v > 0).length;
        document.getElementById('activeCount').textContent = attivi;
    }
    
    analizza() {
        const segnaliAttivi = Object.entries(this.state.osservazione)
            .filter(([_, val]) => val > 0)
            .map(([id, _]) => id);
        
        if (segnaliAttivi.length === 0) {
            alert('Nessun segnale selezionato');
            return;
        }
        
        // Analisi comportamentale
        const risultati = this.inferenceEngine.analizza(
            segnaliAttivi,
            this.state.contesto
        );
        
        // Analisi identità
        const identita = this.identitaAnalyzer.analizza(new Set(segnaliAttivi));
        const dominante = this.identitaAnalyzer.getDominante(identita);
        
        // Aggiorna UI risultati
        this.mostraRisultati(risultati, identita, dominante);
    }
    
    mostraRisultati(risultati, identita, dominante) {
        // Implementazione UI risultati
        // ... (come nella versione precedente)
    }
    
    reset() {
        this.state.segnali.forEach(s => { this.state.osservazione[s.id] = 0; });
        this.state.primoSegnale = null;
        document.getElementById('primoSegnaleLabel').textContent = 'Nessuno';
        this.renderSegnali();
    }
    
    setupEventListeners() {
        document.getElementById('resetBtn')?.addEventListener('click', () => this.reset());
        document.getElementById('analizzaBtn')?.addEventListener('click', () => this.analizza());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.esporta());
        
        document.getElementById('ctx')?.addEventListener('change', (e) => {
            this.state.contesto = e.target.value;
        });
    }
    
    esporta() {
        const data = {
            timestamp: new Date().toISOString(),
            segnali: this.state.osservazione,
            contesto: this.state.contesto,
            note: this.state.note
        };
        this.exportManager.download(
            JSON.stringify(data, null, 2),
            `analisi_${new Date().toISOString().slice(0,10)}.json`
        );
    }
}

// Avvio applicazione
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
