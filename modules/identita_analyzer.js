/**
 * IDENTITA ANALYZER - Analisi del profilo identitario
 */

class IdentitaAnalyzer {
    constructor(segnali) {
        this.segnali = segnali;
        
        // Pesi per ogni tratto identitario
        this.pesi = {
            competenza: { S024: 2, S025: 2, S008: 1, S020: 1, S045: 1 },
            intelligenza: { S025: 2, S033: 1.5, S005: 1, S045: 1.5, S047: 1 },
            status: { S008: 2, S019: 1.5, S029: 1.5, S024: 1, S013: 1 },
            indipendenza: { S007: 2, S009: 2, S034: 1.5, S050: 1.5, S039: 1 },
            moralita: { S045: 2.5, S049: 2, S040: -1.5, S046: -1.5, S029: -1 },
            superiorita: { S029: 2, S019: 2, S013: 1.5, S001: -1, S004: -1 },
            sicurezza: { S002: 2, S008: 2, S024: 1.5, S045: 1.5, S019: 1 }
        };
    }

    /**
     * Analizza identità basata sui segnali selezionati
     * @param {Set} selected - Set di ID segnali selezionati
     * @returns {Object} Punteggi identitari
     */
    analizza(selected) {
        let punteggi = {};
        
        Object.keys(this.pesi).forEach(tratto => {
            let totale = 0;
            let massimo = 0;
            
            Object.entries(this.pesi[tratto]).forEach(([segnale, peso]) => {
                const segnaleObj = this.segnali.find(s => s.id === segnale);
                const valore = selected.has(segnale) ? (segnaleObj?.peso || 1) : 0;
                
                if (peso > 0) {
                    totale += valore * peso;
                    massimo += 4 * peso;
                } else {
                    totale -= valore * Math.abs(peso);
                    massimo += 4 * Math.abs(peso);
                }
            });
            
            punteggi[tratto] = massimo > 0 ? 
                Math.min(100, Math.max(0, Math.round((totale / massimo) * 100))) : 0;
        });
        
        return punteggi;
    }

    /**
     * Determina il tratto identitario dominante
     * @param {Object} punteggi - Punteggi identitari
     * @returns {Object} Tratto dominante con livello
     */
    getDominante(punteggi) {
        let max = 0;
        let dominante = 'neutro';
        
        Object.entries(punteggi).forEach(([tratto, val]) => {
            if (val > max) {
                max = val;
                dominante = tratto;
            }
        });
        
        let livello = 'basso';
        if (max >= 70) livello = 'alto';
        else if (max >= 40) livello = 'medio';
        
        return {
            tratto: dominante,
            livello: livello,
            punteggio: max
        };
    }

    /**
     * Genera descrizione del profilo identitario
     * @param {Object} punteggi - Punteggi identitari
     * @returns {string} Descrizione testuale
     */
    generaDescrizione(punteggi) {
        const dominante = this.getDominante(punteggi);
        
        const descrizioni = {
            competenza: "Si percepisce come competente e preparato",
            intelligenza: "Si percepisce come brillante e analitico",
            status: "Attento alla posizione sociale e gerarchica",
            indipendenza: "Valuta l'autonomia e l'indipendenza",
            moralita: "Si identifica come etico e corretto",
            superiorita: "Tendenza a sentirsi superiore",
            sicurezza: "Mostra fiducia in sé stabile",
            neutro: "Profilo identitario non chiaramente definito"
        };
        
        return descrizioni[dominante.tratto] || descrizioni.neutro;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IdentitaAnalyzer;
}
