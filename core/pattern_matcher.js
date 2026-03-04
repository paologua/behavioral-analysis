/**
 * Pattern Matcher
 * Confronta le osservazioni con i pattern della libreria
 */

class PatternMatcher {
    constructor(patternLibrary) {
        this.patterns = patternLibrary || this.getPatternLibraryDefault();
        this.soglia_minima = 0.3;
    }

    getPatternLibraryDefault() {
        return [
            {
                nome: "Stress Cognitivo",
                cluster: "A",
                segnali_chiave: ["S001", "S004", "S006", "S014", "S018", "S020", "S026", "S027"],
                segnali_critici: ["S001", "S018"],
                vettore: { S001: 3, S004: 3, S006: 2, S014: 2, S018: 3, S020: 2, S026: 2, S027: 2 },
                direzione_prevalente: "fuga"
            },
            {
                nome: "Ansia Sociale",
                cluster: "A",
                segnali_chiave: ["S005", "S007", "S011", "S012", "S023", "S024"],
                segnali_critici: ["S007", "S011"],
                vettore: { S005: 2, S007: 3, S011: 3, S012: 3, S023: 2, S024: 2 },
                direzione_prevalente: "fuga"
            },
            {
                nome: "Interesse Autentico",
                cluster: "B",
                segnali_chiave: ["S008", "S010", "S013", "S020", "S025", "S028", "S029"],
                segnali_critici: ["S008", "S010", "S029"],
                vettore: { S008: 3, S010: 3, S013: 3, S020: 2, S025: 3, S028: 2, S029: 3 },
                direzione_prevalente: "apertura"
            },
            {
                nome: "Cooperazione",
                cluster: "E",
                segnali_chiave: ["S008", "S010", "S013", "S020", "S025", "S028", "S029"],
                segnali_critici: ["S008", "S029"],
                vettore: { S008: 3, S010: 2, S013: 3, S020: 2, S025: 3, S028: 2, S029: 3 },
                direzione_prevalente: "apertura"
            },
            {
                nome: "Dominanza Naturale",
                cluster: "C",
                segnali_chiave: ["S002", "S008", "S010", "S013", "S025", "S028"],
                segnali_critici: ["S002", "S008", "S013"],
                vettore: { S002: 2, S008: 3, S010: 3, S013: 3, S025: 3, S028: 2 },
                direzione_prevalente: "controllo"
            }
        ];
    }

    match(deviazioni, primoSegnaleId = null, baseline = null) {
        const risultati = [];
        
        for (const pattern of this.patterns) {
            let score = this.calcolaSimilarita(pattern.vettore, deviazioni);
            score = this.applicaFiltri(pattern, score, deviazioni, baseline);
            
            if (primoSegnaleId && pattern.vettore[primoSegnaleId] >= 2) {
                score = Math.min(score * 1.15, 1.0);
            }
            
            if (score > this.soglia_minima) {
                risultati.push({
                    pattern: pattern.nome,
                    cluster: pattern.cluster,
                    score: Math.round(score * 100),
                    direzione: pattern.direzione_prevalente
                });
            }
        }
        
        return risultati.sort((a, b) => b.score - a.score);
    }

    calcolaSimilarita(vettorePattern, deviazioni) {
        let dotProduct = 0;
        let normPattern = 0;
        let normObs = 0;
        let intersection = 0;
        let union = 0;
        
        const allKeys = new Set([...Object.keys(vettorePattern), ...Object.keys(deviazioni)]);
        
        for (const key of allKeys) {
            const pVal = vettorePattern[key] || 0;
            const oVal = (deviazioni[key] && deviazioni[key].valore) || 0;
            
            dotProduct += pVal * oVal;
            normPattern += pVal * pVal;
            normObs += oVal * oVal;
            
            const pPresente = pVal >= 2;
            const oPresente = oVal >= 2;
            
            if (pPresente && oPresente) intersection++;
            if (pPresente || oPresente) union++;
        }
        
        const coseno = (normPattern === 0 || normObs === 0) ? 0 : 
                       dotProduct / (Math.sqrt(normPattern) * Math.sqrt(normObs));
        
        const jaccard = (union === 0) ? 0 : intersection / union;
        
        return (coseno * 0.6) + (jaccard * 0.4);
    }

    applicaFiltri(pattern, score, deviazioni, baseline) {
        let scoreMod = score;
        
        if (pattern.segnali_critici) {
            for (const segnaleId of pattern.segnali_critici) {
                const valore = deviazioni[segnaleId] ? deviazioni[segnaleId].valore : 0;
                if (valore === 0) {
                    scoreMod *= 0.5;
                }
            }
        }
        
        return Math.max(0, Math.min(1, scoreMod));
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatternMatcher;
}
