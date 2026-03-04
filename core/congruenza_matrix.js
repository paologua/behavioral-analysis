/**
 * Matrice di Congruenza
 * Analizza la congruenza interna e inter-canale
 */

class CongruenzaMatrix {
    constructor() {
        this.matriceCongruenza = {
            autentico: {
                condizione: (nv, pv, v) => nv === pv && nv !== v,
                descrizione: "Emozione autentica",
                livello: 0.9
            },
            dissonante: {
                condizione: (nv, pv, v) => nv !== v && nv === pv,
                descrizione: "Dissonanza emotiva",
                livello: 0.6
            },
            controllo: {
                condizione: (nv, pv, v) => pv !== v && nv === pv,
                descrizione: "Controllo / Manipolazione",
                livello: 0.7
            },
            conflitto: {
                condizione: (nv, pv, v) => nv !== pv && pv !== v && nv !== v,
                descrizione: "Conflitto interno / Inganno",
                livello: 0.8
            },
            allineato: {
                condizione: (nv, pv, v) => nv === pv && pv === v,
                descrizione: "Piena congruenza",
                livello: 1.0
            },
            indeterminato: {
                condizione: () => true,
                descrizione: "Pattern non definito",
                livello: 0.5
            }
        };
    }

    calcolaCongruenza(deviazioni) {
        const nvMedia = this.mediaCanale(deviazioni, 'NV');
        const pvMedia = this.mediaCanale(deviazioni, 'PV');
        const vMedia = this.mediaCanale(deviazioni, 'V');

        let tipo = 'indeterminato';
        let livello = 0.5;

        for (const [key, value] of Object.entries(this.matriceCongruenza)) {
            if (value.condizione(nvMedia, pvMedia, vMedia)) {
                tipo = key;
                livello = value.livello;
                break;
            }
        }

        const dettaglio = {
            nv: this.coerenzaInterna(deviazioni, 'NV'),
            pv: this.coerenzaInterna(deviazioni, 'PV'),
            v: this.coerenzaInterna(deviazioni, 'V')
        };

        return {
            tipo,
            descrizione: this.matriceCongruenza[tipo].descrizione,
            livello,
            medie: { nv: nvMedia, pv: pvMedia, v: vMedia },
            coerenza_interna: dettaglio,
            score_complessivo: this.calcolaScoreComplessivo(livello, dettaglio)
        };
    }

    mediaCanale(deviazioni, canale) {
        const valori = Object.values(deviazioni).filter(v => v && v.canale === canale);
        if (valori.length === 0) return 0;
        return valori.reduce((a, b) => a + (b.valore || 0), 0) / valori.length;
    }

    coerenzaInterna(deviazioni, canale) {
        const segnaliCanale = Object.entries(deviazioni)
            .filter(([id, valore]) => valore && valore.canale === canale)
            .map(([id, valore]) => ({ id, valore: valore.valore || 0 }));

        if (segnaliCanale.length === 0) {
            return { livello: 0, segnali_coerenti: 0, totale: 0 };
        }

        const media = segnaliCanale.reduce((a, b) => a + b.valore, 0) / segnaliCanale.length;
        const varianza = segnaliCanale.reduce((a, b) => a + Math.pow(b.valore - media, 2), 0) / segnaliCanale.length;
        const devStd = Math.sqrt(varianza);

        const coerenza = Math.max(0, 1 - (devStd / 3));

        return {
            livello: coerenza,
            segnali_coerenti: segnaliCanale.filter(s => s.valore >= 2).length,
            totale: segnaliCanale.length,
            varianza
        };
    }

    calcolaScoreComplessivo(livelloInter, coerenzaInterna) {
        const mediaInterna = (coerenzaInterna.nv.livello + 
                              coerenzaInterna.pv.livello + 
                              coerenzaInterna.v.livello) / 3;
        
        return (livelloInter * 0.6) + (mediaInterna * 0.4);
    }

    verificaRegolaAssoluta(deviazioni) {
        const nvMedia = this.mediaCanale(deviazioni, 'NV');
        const pvMedia = this.mediaCanale(deviazioni, 'PV');
        const vMedia = this.mediaCanale(deviazioni, 'V');

        return nvMedia >= pvMedia && pvMedia >= vMedia;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CongruenzaMatrix;
}
