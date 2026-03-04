/**
 * Baseline Engine
 * Costruisce e gestisce la linea di base comportamentale
 */

class BaselineEngine {
    constructor(segnali) {
        this.segnali = segnali || [];
        this.baseline = {
            nv: {},
            pv: {},
            v: {},
            timestamp: null,
            sessioni: 0
        };
        this.soglia_deviazione = 1.5;
    }

    costruisciBaseline(osservazioni) {
        if (!osservazioni || osservazioni.length === 0) {
            console.warn("Nessuna osservazione per la baseline");
            return this.baseline;
        }

        const aggregati = {};
        
        osservazioni.forEach(obs => {
            Object.entries(obs).forEach(([segnaleId, valore]) => {
                if (!aggregati[segnaleId]) {
                    aggregati[segnaleId] = [];
                }
                aggregati[segnaleId].push(valore);
            });
        });

        Object.entries(aggregati).forEach(([segnaleId, valori]) => {
            const segnale = this.segnali.find(s => s.id === segnaleId);
            if (!segnale) return;

            const media = valori.reduce((a, b) => a + b, 0) / valori.length;
            const devStd = this.calcolaDevStd(valori, media);
            
            if (segnale.canale === 'NV') {
                this.baseline.nv[segnaleId] = { media, devStd, conteggio: valori.length };
            } else if (segnale.canale === 'PV') {
                this.baseline.pv[segnaleId] = { media, devStd, conteggio: valori.length };
            } else if (segnale.canale === 'V') {
                this.baseline.v[segnaleId] = { media, devStd, conteggio: valori.length };
            }
        });

        this.baseline.timestamp = new Date().toISOString();
        this.baseline.sessioni = 1;
        
        return this.baseline;
    }

    calcolaDevStd(valori, media) {
        const quadrati = valori.map(v => Math.pow(v - media, 2));
        const mediaQuadrati = quadrati.reduce((a, b) => a + b, 0) / valori.length;
        return Math.sqrt(mediaQuadrati);
    }

    normalizza(osservato) {
        const deviazioni = {};
        
        Object.entries(osservato).forEach(([segnaleId, valore]) => {
            const segnale = this.segnali.find(s => s.id === segnaleId);
            if (!segnale) return;

            let baselineValore = 0;
            if (segnale.canale === 'NV') {
                baselineValore = this.baseline.nv[segnaleId]?.media || 0;
            } else if (segnale.canale === 'PV') {
                baselineValore = this.baseline.pv[segnaleId]?.media || 0;
            } else if (segnale.canale === 'V') {
                baselineValore = this.baseline.v[segnaleId]?.media || 0;
            }

            if (baselineValore === 0) {
                deviazioni[segnaleId] = valore;
            } else {
                const rapporto = valore / baselineValore;
                if (rapporto >= this.soglia_deviazione) {
                    deviazioni[segnaleId] = Math.min(3, Math.max(1, Math.round(rapporto - this.soglia_deviazione + 1)));
                } else {
                    deviazioni[segnaleId] = 0;
                }
            }
        });

        return deviazioni;
    }

    isDeviazione(segnaleId, valore) {
        const segnale = this.segnali.find(s => s.id === segnaleId);
        if (!segnale) return false;

        let baselineValore = 0;
        if (segnale.canale === 'NV') {
            baselineValore = this.baseline.nv[segnaleId]?.media || 0;
        } else if (segnale.canale === 'PV') {
            baselineValore = this.baseline.pv[segnaleId]?.media || 0;
        } else if (segnale.canale === 'V') {
            baselineValore = this.baseline.v[segnaleId]?.media || 0;
        }

        return valore >= baselineValore * this.soglia_deviazione;
    }

    esporta() {
        return JSON.stringify(this.baseline, null, 2);
    }
}

// Esponi come modulo (per browser)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaselineEngine;
}
