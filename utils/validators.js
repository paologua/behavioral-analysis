class Validators {
    static validaPeso(peso) {
        const p = parseInt(peso);
        return !isNaN(p) && p >= 0 && p <= 3;
    }

    static validaContesto(contesto) {
        return ['formale', 'informale', 'negoziale', 'conflittuale', 'intimo'].includes(contesto);
    }

    static validaOsservazione(osservazione, segnali) {
        const errors = [];
        
        Object.entries(osservazione).forEach(([id, peso]) => {
            const segnale = segnali.find(s => s.id === id);
            if (!segnale) {
                errors.push(`Segnale ${id} non trovato`);
            } else if (!this.validaPeso(peso)) {
                errors.push(`Peso ${peso} non valido`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validators;
}
