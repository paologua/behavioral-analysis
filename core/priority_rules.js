/**
 * Regole di Priorità
 * Gestisce l'ordinamento dei segnali secondo le priorità definite
 */

class PriorityRules {
    constructor() {
        this.prioritaCanali = ['NV', 'PV', 'V'];
        
        this.prioritaNV = [
            'respirazione',
            'tensioni',
            'piedi',
            'orientamento',
            'sguardo',
            'postura',
            'mani',
            'espressivita'
        ];
        
        this.prioritaPV = ['pause', 'ritmo', 'volume'];
        this.prioritaV = ['narrativa', 'lessico', 'tono'];

        this.pesiDinamici = {
            primaDeviazione: 1.5,
            segnaleBreve: 1.3,
            baseline: 0.7
        };
    }

    ordinaSegnali(segnali) {
        return segnali.sort((a, b) => {
            const canaleA = this.prioritaCanali.indexOf(a.canale);
            const canaleB = this.prioritaCanali.indexOf(b.canale);
            
            if (canaleA !== canaleB) {
                return canaleA - canaleB;
            }
            
            return this.prioritaInterna(a, b);
        });
    }

    prioritaInterna(a, b) {
        if (a.canale === 'NV') {
            return this.prioritaCategoria(a.categoria, b.categoria, this.prioritaNV);
        } else if (a.canale === 'PV') {
            return this.prioritaCategoria(a.categoria, b.categoria, this.prioritaPV);
        } else if (a.canale === 'V') {
            return this.prioritaCategoria(a.categoria, b.categoria, this.prioritaV);
        }
        return 0;
    }

    prioritaCategoria(catA, catB, priorita) {
        const indexA = priorita.indexOf(catA);
        const indexB = priorita.indexOf(catB);
        
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        
        return indexA - indexB;
    }

    canaleDominante(deviazioni) {
        const canali = { NV: { count: 0, somma: 0 }, PV: { count: 0, somma: 0 }, V: { count: 0, somma: 0 } };

        Object.entries(deviazioni).forEach(([id, valore]) => {
            if (valore && valore.canale && valore.valore > 0) {
                canali[valore.canale].count++;
                canali[valore.canale].somma += valore.valore;
            }
        });

        const medie = {};
        Object.entries(canali).forEach(([canale, dati]) => {
            medie[canale] = dati.count > 0 ? dati.somma / dati.count : 0;
        });

        let dominante = 'NV';
        if (medie.PV > medie.NV && medie.PV > medie.V) {
            dominante = 'PV';
        } else if (medie.V > medie.NV && medie.V > medie.PV) {
            dominante = 'V';
        }

        return {
            canale: dominante,
            medie,
            priorita: this.prioritaCanali.indexOf(dominante) + 1
        };
    }

    validaConPriorita(risultatoCongruenza) {
        const { medie } = risultatoCongruenza;
        const rispettaRegola = medie.nv >= medie.pv && medie.pv >= medie.v;
        
        return {
            rispettaRegola,
            livelloConfidenza: rispettaRegola ? 1.0 : 0.5
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PriorityRules;
}
