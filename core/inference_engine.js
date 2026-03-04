/**
 * Motore di Inferenza Principale
 * Integra tutti i moduli e produce l'output finale
 */

class InferenceEngine {
    constructor(segnali, patternLibrary) {
        this.segnali = segnali;
        this.patternLibrary = patternLibrary;
        
        this.BaselineEngine = typeof BaselineEngine !== 'undefined' ? BaselineEngine : require('./baseline_engine');
        this.CongruenzaMatrix = typeof CongruenzaMatrix !== 'undefined' ? CongruenzaMatrix : require('./congruenza_matrix');
        this.PriorityRules = typeof PriorityRules !== 'undefined' ? PriorityRules : require('./priority_rules');
        this.PatternMatcher = typeof PatternMatcher !== 'undefined' ? PatternMatcher : require('./pattern_matcher');
        
        this.baselineEngine = new this.BaselineEngine(segnali);
        this.congruenzaMatrix = new this.CongruenzaMatrix();
        this.priorityRules = new this.PriorityRules();
        this.patternMatcher = new this.PatternMatcher(patternLibrary);
        
        this.stato = {
            baselineCostruita: false,
            ultimaAnalisi: null
        };
    }

    analizza(input, metadata = {}) {
        const startTime = Date.now();

        let deviazioni = this.arricchisciDeviazioni(input);
        
        const congruenza = this.congruenzaMatrix.calcolaCongruenza(deviazioni);
        const priorita = this.priorityRules.canaleDominante(deviazioni);
        const validazionePriorita = this.priorityRules.validaConPriorita(congruenza);

        const patternMatch = this.patternMatcher.match(
            deviazioni, 
            metadata.primoSegnaleId
        );

        const intensita = this.calcolaIntensita(deviazioni, patternMatch);
        const predizione = this.generaPredizione(patternMatch, congruenza);

        const risultato = {
            timestamp: new Date().toISOString(),
            processingTime: Date.now() - startTime,
            
            pattern: {
                principale: patternMatch[0] || { pattern: 'Non identificato', score: 0 },
                secondario: patternMatch[1] || null,
                cluster: patternMatch[0]?.cluster || 'unknown'
            },
            
            intensita: {
                valore: intensita,
                livello: this.getLivelloIntensita(intensita)
            },
            
            congruenza: {
                tipo: congruenza.tipo,
                descrizione: congruenza.descrizione,
                score: congruenza.score_complessivo
            },
            
            direzione: predizione.direzione,
            predizione: predizione.azione,
            probabilita: predizione.probabilita,
            
            dettagli: {
                canaleDominante: priorita.canale,
                segnaliRilevati: Object.keys(input).length,
                confidenza: this.calcolaConfidenza(congruenza, intensita, validazionePriorita)
            }
        };

        this.stato.ultimaAnalisi = risultato;
        return risultato;
    }

    arricchisciDeviazioni(input) {
        const arricchite = {};
        
        Object.entries(input).forEach(([id, valore]) => {
            const segnale = this.segnali.find(s => s.id === id);
            if (segnale) {
                arricchite[id] = {
                    valore,
                    canale: segnale.canale,
                    categoria: segnale.categoria,
                    nome: segnale.nome
                };
            }
        });
        
        return arricchite;
    }

    calcolaIntensita(deviazioni, patternMatch) {
        const valori = Object.values(deviazioni).map(d => d.valore);
        if (valori.length === 0) return 0;
        
        const media = valori.reduce((a, b) => a + b, 0) / valori.length;
        const countAlti = valori.filter(v => v >= 2).length;
        
        const contributoMedia = (media / 3) * 50;
        const contributoCount = (countAlti / Math.max(1, valori.length)) * 50;
        
        const baseIntensita = contributoMedia + contributoCount;
        
        const topScore = patternMatch[0]?.score || 0;
        const bonusPattern = topScore * 0.3;
        
        return Math.min(100, Math.round(baseIntensita + bonusPattern));
    }

    getLivelloIntensita(valore) {
        if (valore < 30) return 'tendenza';
        if (valore < 60) return 'attivo';
        if (valore < 80) return 'forte';
        return 'dominante';
    }

    generaPredizione(patternMatch, congruenza) {
        if (!patternMatch || patternMatch.length === 0) {
            return { direzione: 'indeterminata', azione: 'Nessuna predizione', probabilita: 0.3 };
        }

        const pattern = patternMatch[0];
        const direzioni = {
            'Stress Cognitivo': 'fuga',
            'Ansia Sociale': 'fuga',
            'Interesse Autentico': 'apertura',
            'Cooperazione': 'apertura',
            'Dominanza Naturale': 'controllo'
        };

        const direzione = direzioni[pattern.pattern] || 'indeterminata';
        
        const azioni = {
            fuga: 'Tendenza all\'allontanamento dalla situazione',
            apertura: 'Disponibilità alla comunicazione e collaborazione',
            controllo: 'Tentativo di influenzare la direzione dell\'interazione',
            approccio: 'Ricerca di maggiore vicinanza e coinvolgimento'
        };

        const probabilitaBase = 0.6 + (pattern.score / 200);
        const probabilita = Math.min(0.95, probabilitaBase);

        return {
            direzione,
            azione: azioni[direzione] || 'Comportamento non determinabile',
            probabilita: Math.round(probabilita * 100) / 100
        };
    }

    calcolaConfidenza(congruenza, intensita, validazionePriorita) {
        return Math.round(
            (congruenza.score_complessivo * 0.4 +
            (intensita / 100) * 0.4 +
            validazionePriorita.livelloConfidenza * 0.2) * 100
        ) / 100;
    }

    costruisciBaseline(osservazioni) {
        const baseline = this.baselineEngine.costruisciBaseline(osservazioni);
        this.stato.baselineCostruita = true;
        return baseline;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InferenceEngine;
}
